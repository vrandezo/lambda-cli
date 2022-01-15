'use strict';

const c = require('./../src/constants.js').constants;
const parse = require('../src/parse.js');

QUnit.module('parse');

QUnit.test('parse "test"', async (assert) => {
  assert.deepEqual(
    await parse.parseAsync('"test"'),
    {
      [c.ObjectType]: c.String,
      [c.StringValue]: 'test'
    }
  );
});

QUnit.test('parse "Z4"', async (assert) => {
  assert.deepEqual(
    await parse.parseAsync('"Z4"'),
    {
      [c.ObjectType]: c.String,
      [c.StringValue]: 'Z4'
    }
  );
});
