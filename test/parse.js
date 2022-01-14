'use strict';

const parse = require('../src/parse.js');

QUnit.module('parse');

QUnit.test('parse "test"', async (assert) => {
  assert.deepEqual(
    await parse.parseAsync('"test"'),
    {
      Z1K1: 'Z6',
      Z6K1: 'test'
    }
  );
});

QUnit.test('parse "Z4"', async (assert) => {
  assert.deepEqual(
    await parse.parseAsync('"Z4"'),
    {
      Z1K1: 'Z6',
      Z6K1: 'Z4'
    }
  );
});
