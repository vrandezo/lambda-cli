const utils = require('../src/utils.js');

QUnit.module('utils');

QUnit.test('is array []', assert => {
  assert.equal(utils.is_array([]), true);
});
