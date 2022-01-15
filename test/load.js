'use strict';

const c = require('../src/constants.js').constants;
const load = require('../src/load.js');
const config = require('../src/config.js');

QUnit.module('load');

QUnit.test('load Z1', async (assert) => {
  config.reset();
  config.setWiki('files');
  load.resetAll();
  assert.deepEqual(
    (await load.load(c.Object))[c.PersistentobjectValue][c.ObjectType],
    c.Type
  );
});

QUnit.test('load Z0', async (assert) => {
  config.reset();
  config.setWiki('files');
  load.resetAll();
  assert.deepEqual((await load.load('Z0'))[c.ObjectType], c.Error);
});
