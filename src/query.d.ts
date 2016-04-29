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