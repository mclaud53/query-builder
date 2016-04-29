/// <reference path="../typings/main.d.ts" />
import {Field, Value, ConditionType, ConditionOperator, GroupOperator, Condition, Group, Query} from '../src/query';
import {QueryBuilder} from '../src/QueryBuilder';
import * as assert from 'assert';
require('sinomocha')();

describe('QueryBuilder', function() {
	it('creation', function() {
		var instance: QueryBuilder = new QueryBuilder('and');
		assert.equal(instance.isEmpty(), true, 'Method isEmpty of new instance must returms true');
		assert.equal(instance.getQuery(), null, 'Method getQuery of new instance must returms null');
	});

	it('deep empty query returns null', function() {
		var instance: QueryBuilder = new QueryBuilder('and');
		instance.addGroup('or')
			.addGroup('xor')
			.addGroup('and');

		assert.equal(instance.getQuery(), null, 'getQuery must returns null');
	});

	it('empty query returns null', function() {
		var instance: QueryBuilder = new QueryBuilder('and');
		instance.addGroup('or')
			.getParent()
			.addGroup('xor')
			.getParent()
			.addGroup('and');

		assert.equal(instance.getQuery(), null, 'getQuery must returns null');
	});

	it('tree of empty queries returns null', function() {
		var instance: QueryBuilder = new QueryBuilder('and');
		instance.addGroup('or')
			.addGroup('xor')
			.addGroup('and');

		instance.addGroup('or')
			.addGroup('xor')
			.addGroup('and');

		assert.equal(instance.getQuery(), null, 'getQuery must returns null');
	});

	it('single condition with default values', function() {
		var instance: QueryBuilder = new QueryBuilder('and'),
			actual: Query;

		instance.addCondition('left', 'right');
		actual = instance.getQuery();

		assert.equal(JSON.stringify(actual), '{"left":"left","right":"right","type":"value","operator":"eq"}', 'getQuery returns wrong value');
	});

	it('single condition with custom values', function() {
		var instance: QueryBuilder = new QueryBuilder('and'),
			actual: Query;

		instance.addCondition('left', 'right', 'field', 'ne');
		actual = instance.getQuery();

		assert.equal(JSON.stringify(actual), '{"left":"left","right":"right","type":"field","operator":"ne"}', 'getQuery returns wrong value');
	});

	it('several conditions', function() {
		var instance: QueryBuilder = new QueryBuilder('xor'),
			actual: Query;

		instance.addCondition('left', 'right')
			.addCondition('left', 'right', 'field', 'ne');
		actual = instance.getQuery();

		assert.equal(JSON.stringify(actual), '{"operator":"xor","items":[{"left":"left","right":"right","type":"value","operator":"eq"},{"left":"left","right":"right","type":"field","operator":"ne"}]}', 'getQuery returns wrong value');
	});

	it('several groups', function() {
		var instance: QueryBuilder = new QueryBuilder('xor'),
			actual: Query;

		instance.addGroup('or')
			.addCondition('left', 'right')
			.addCondition('left', 'right', 'field', 'ne')
			.getParent()
			.addGroup('and')
			.addCondition('left', 'right')
			.addCondition('left', 'right', 'field', 'ne');

		actual = instance.getQuery();

		assert.equal(JSON.stringify(actual), '{"operator":"xor","items":[{"operator":"or","items":[{"left":"left","right":"right","type":"value","operator":"eq"},{"left":"left","right":"right","type":"field","operator":"ne"}]},{"operator":"and","items":[{"left":"left","right":"right","type":"value","operator":"eq"},{"left":"left","right":"right","type":"field","operator":"ne"}]}]}', 'getQuery returns wrong value');
	});

	it('mixed groups & conditions', function()
	{
		var instance: QueryBuilder = new QueryBuilder('xor'),
			actual: Query;

		instance.addGroup('or')
			.addCondition('left', 'right')
			.addCondition('left', 'right', 'field', 'ne')
			.getParent()
			.addCondition('left', 'right')
			.addCondition('left', 'right', 'field', 'ne');

		actual = instance.getQuery();

		assert.equal(JSON.stringify(actual), '{"operator":"xor","items":[{"operator":"or","items":[{"left":"left","right":"right","type":"value","operator":"eq"},{"left":"left","right":"right","type":"field","operator":"ne"}]},{"left":"left","right":"right","type":"value","operator":"eq"},{"left":"left","right":"right","type":"field","operator":"ne"}]}', 'getQuery returns wrong value');
	});

	it('remove group', function()
	{
		var instance: QueryBuilder = new QueryBuilder('xor'),
			group: QueryBuilder = instance.addGroup('or'),
			actual: Query;

		group.addCondition('left', 'right')
			.addCondition('left', 'right', 'field', 'ne');

		instance.addCondition('left', 'right')
			.addCondition('left', 'right', 'field', 'ne');

		instance.remove(group);

		actual = instance.getQuery();

		assert.equal(JSON.stringify(actual), '{"operator":"xor","items":[{"left":"left","right":"right","type":"value","operator":"eq"},{"left":"left","right":"right","type":"field","operator":"ne"}]}', 'getQuery returns wrong value');
	});

	it('remove condition with default values', function() {
		var instance: QueryBuilder = new QueryBuilder('xor'),
			actual: Query;

		instance.addGroup('or')
			.addCondition('left', 'right')
			.addCondition('left', 'right', 'field', 'ne')
			.getParent()
			.addCondition('left', 'right')
			.addCondition('left', 'right', 'field', 'ne');

		instance.remove({
			left: 'left',
			right: 'right'
		});

		actual = instance.getQuery();

		assert.equal(JSON.stringify(actual), '{"operator":"xor","items":[{"operator":"or","items":[{"left":"left","right":"right","type":"value","operator":"eq"},{"left":"left","right":"right","type":"field","operator":"ne"}]},{"left":"left","right":"right","type":"field","operator":"ne"}]}', 'getQuery returns wrong value');
	});	

	it('remove condition with custom values', function() {
		var instance: QueryBuilder = new QueryBuilder('xor'),
			actual: Query;

		instance.addGroup('or')
			.addCondition('left', 'right')
			.addCondition('left', 'right', 'field', 'ne')
			.getParent()
			.addCondition('left', 'right')
			.addCondition('left', 'right', 'field', 'ne');

		instance.remove({
			left: 'left',
			right: 'right',
			type: 'field',
			operator: 'ne'
		});

		actual = instance.getQuery();

		assert.equal(JSON.stringify(actual), '{"operator":"xor","items":[{"operator":"or","items":[{"left":"left","right":"right","type":"value","operator":"eq"},{"left":"left","right":"right","type":"field","operator":"ne"}]},{"left":"left","right":"right","type":"value","operator":"eq"}]}', 'getQuery returns wrong value');
	});		
});