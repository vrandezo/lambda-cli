'use strict';

const c = require('../src/constants.js').constants;

QUnit.module('constants');

QUnit.test('Object is Z1', (assert) => {
  assert.strictEqual(c.Object, 'Z1');
});

QUnit.test('Type is Z1K1', (assert) => {
  assert.strictEqual(c.ObjectType, 'Z1K1');
});
