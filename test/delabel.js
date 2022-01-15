'use strict';

const c = require('../src/constants.js').constants;
const config = require('../src/config.js');
const load = require('../src/load.js');
const delabel = require('../src/delabel.js');

QUnit.module('delabel');

QUnit.test('delabel English', async (assert) => {
  config.reset();
  config.setWiki('files');
  load.resetAll();
  assert.deepEqual(
    (await delabel.delabel('English'))[0].K1,
    c.English
  );
});

QUnit.test('delabel english', async (assert) => {
  config.reset();
  config.setWiki('files');
  load.resetAll();
  assert.deepEqual(
    (await delabel.delabel('english'))[0].K1,
    c.English
  );
});

QUnit.test('delabel IF', async (assert) => {
  config.reset();
  config.setWiki('files');
  load.resetAll();
  assert.deepEqual(
    (await delabel.delabel('IF'))[0].K1,
    c.If
  );
});

QUnit.test('delabel first element', async (assert) => {
  config.reset();
  config.setWiki('files');
  load.resetAll();
  assert.deepEqual(
    (await delabel.delabel('first element'))[0].K1,
    c.FirstElement
  );
});
