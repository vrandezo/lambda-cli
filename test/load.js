'use strict';

const c = require('../src/constants.js').constants;
const config = require('../src/config.js');
const load = require('../src/load.js');

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

QUnit.test('load Z0 with error', async (assert) => {
  config.reset();
  config.setWiki('files');
  load.resetAll();
  assert.deepEqual((await load.load('Z0'))[c.ObjectType], c.Error);
});

QUnit.test('get labelmap', async (assert) => {
  config.reset();
  config.setWiki('files');
  load.resetAll();
  const labelmap = await load.labelmap(c.English);
  assert.deepEqual(labelmap.error[0][0], c.Error);
});
