export type Field = string;
export type Value = any;
export type ConditionType = 'field' | 'value';
export type ConditionOperator = 'eq' | 'ne' | 'lt' | 'le' | 'ge' | 'gt' | 'in' | 'nin';
export type GroupOperator = 'and' | 'or' | 'xor';
export interface Condition {
	left: Field;
	right: Field | Value;
	type?: ConditionType; // by default: value
	operator?: ConditionOperator; // by default: eq
}
export interface Group {
	operator?: GroupOperator; // by default: and
	items: (this | Condition)[];
}
export type Query = Condition | Group;

export interface IConditionValidate {
	throwErrorIfInvalidConditionType(conditionType: ConditionType): void;
	throwErrorIfInvalidConditionOperator(conditionOperator: ConditionOperator): void;
	throwErrorIfInvalidField(field: Field): void;
	throwErrorIfInvalidValue(field: Field, value: Value): void;
}

export declare class QueryBuilder {
    private operator;
    private parent;
    private items;
    private conditionValidate;
    constructor(operator?: GroupOperator, parent?: QueryBuilder, conditionValidate?: IConditionValidate);
    addCondition(left: Field, right: Field | Value, type?: ConditionType, operator?: ConditionOperator): QueryBuilder;
    addGroup(operator?: GroupOperator): QueryBuilder;
    getParent(): QueryBuilder;
    getQuery(): Query;
    isEmpty(): boolean;
    remove(value: QueryBuilder | Condition): boolean;
}
