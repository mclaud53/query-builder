import {Field, Value, ConditionType, ConditionOperator, GroupOperator, Condition, Group, Query} from './query';
import {IConditionValidate} from './IConditionValidate';

export class QueryBuilder {
	private operator: GroupOperator;
	private parent: QueryBuilder;
	private items: (QueryBuilder | Condition)[] = [];
	private conditionValidate: IConditionValidate;

	public constructor(operator: GroupOperator = 'and', parent: QueryBuilder = null, conditionValidate: IConditionValidate = null) {
		this.operator = operator;
		this.parent = parent;
		this.conditionValidate = conditionValidate;
	}

	public addCondition(left: Field, right: Field | Value, type: ConditionType = 'value', operator: ConditionOperator = 'eq'): QueryBuilder {
		if (this.conditionValidate) {
			this.conditionValidate.throwErrorIfInvalidConditionOperator(operator);
			this.conditionValidate.throwErrorIfInvalidConditionType(type);
			this.conditionValidate.throwErrorIfInvalidField(left);
			switch (type) {
				case 'field':
					this.conditionValidate.throwErrorIfInvalidField(right);
					break;

				case 'value':
					this.conditionValidate.throwErrorIfInvalidValue(left, right);
					break;

				default:
					throw new Error('Unsupported condition type: ' + type);
			}
		}

		this.items.push({
			left: left,
			right: right,
			type: type,
			operator: operator
		});
		return this;
	}

	public addGroup(operator: GroupOperator = 'and'): QueryBuilder {
		var ret: QueryBuilder = new QueryBuilder(operator, this);
		this.items.push(ret);
		return ret;
	}

	public getParent(): QueryBuilder {
		return this.parent;
	}

	public getQuery(): Query {
		var i: number,
			ret: Query,
			item: QueryBuilder | Condition,
			items: Query[],
			query: Query;

		if (0 === this.items.length) {
			return null;
		} else if (1 === this.items.length) {
			item = this.items[0];
			if (item instanceof QueryBuilder) {
				ret = item.getQuery();
			} else {
				ret = item;
			}
		} else {
			items = [];
			for (i = 0; i < this.items.length; i++) {
				item = this.items[i];
				if (item instanceof QueryBuilder) {
					if (!item.isEmpty()) {
						items.push(item.getQuery());
					}
				} else {
					items.push(item);
				}
			}
			if (0 === items.length) {
				ret = null;
			} else if (1 === items.length) {
				ret = items[0];
			} else {
				ret = {
					operator: this.operator,
					items: items
				};
			}
		}
		return ret;
	}

	public isEmpty(): boolean {
		var i: number,
			item: QueryBuilder | Condition;

		if (1 === this.items.length) {
			item = this.items[0];
			if (item instanceof QueryBuilder) {
				return item.isEmpty();
			} else {
				return false;
			}
		} else {
			for (i = 0; i < this.items.length; i++) {
				item = this.items[i];
				if (item instanceof QueryBuilder) {
					if (!item.isEmpty()) {
						return false;
					}
				} else {
					return false;
				}
			}
		}

		return true;
	}

	public remove(value: QueryBuilder | Condition): boolean {
		var i: number,
			item: QueryBuilder | Condition,
			ret: boolean = false;

		if (value instanceof QueryBuilder) {
			i = this.items.indexOf(value);
			ret = i > -1;
			if (ret) {
				this.items.splice(i, 1);
			}
		} else {
			if (!value.hasOwnProperty('type')) {
				value.type = 'value';
			}
			if (!value.hasOwnProperty('operator')) {
				value.operator = 'eq';
			}
			for (i = 0; i < this.items.length; i++) {
				item = this.items[i];
				if (item instanceof QueryBuilder) {
					continue;
				} else {
					if ((item.left === value.left) &&
						(item.right === value.right) &&
						(item.type === value.type) &&
						(item.operator === value.operator)) {
						ret = true;
						this.items.splice(i, 1);
						break;
					}

				}
			}
		}

		return ret;
	}
}