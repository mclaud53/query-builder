import {Field, Value, ConditionType, ConditionOperator} from './query';

export interface IConditionValidate
{
	throwErrorIfInvalidConditionType(conditionType: ConditionType): void;
	throwErrorIfInvalidConditionOperator(conditionOperator: ConditionOperator): void;
	throwErrorIfInvalidField(field: Field): void;
	throwErrorIfInvalidValue(field: Field, value: Value): void;
}