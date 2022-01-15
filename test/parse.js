'use strict';

const c = require('./../src/constants.js').constants;
const parse = require('../src/parse.js');

QUnit.module('parse');

QUnit.test('tokenize symbol', (assert) => {
  assert.deepEqual(
    parse.tokenize('symbol'),
    [
      {
        [c.ObjectType]: 'ZToken',
        [c.Key1]: 'ZSymbol',
        [c.Key2]: '1',
        [c.Key3]: 'symbol'
      }
    ]
  );
});

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
