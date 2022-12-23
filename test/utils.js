'use strict';

const utils = require('../src/utils.js');
const c = require('../src/constants.js').constants;

QUnit.module('utils');

QUnit.test('is object []', (assert) => {
  assert.strictEqual(utils.isObject([]), false);
});

QUnit.test('is object [ "a" ]', (assert) => {
  assert.strictEqual(utils.isObject([ 'a' ]), false);
});

QUnit.test('is object [ "a", "b" ]', (assert) => {
  assert.strictEqual(utils.isObject([ 'a', 'b' ]), false);
});

QUnit.test('is object [ {} ]', (assert) => {
  assert.strictEqual(utils.isObject([ {} ]), false);
});

QUnit.test('is object [ {}, {} ]', (assert) => {
  assert.strictEqual(utils.isObject([ {}, {} ]), false);
});

QUnit.test('is object {}', (assert) => {
  assert.strictEqual(utils.isObject({}), true);
});

QUnit.test('is object { Z1K1: Z6, ... }', (assert) => {
  assert.strictEqual(utils.isObject({ Z1K1: 'Z6', Z6K1: 'a' }), true);
});

QUnit.test('is object true', (assert) => {
  assert.strictEqual(utils.isObject(true), false);
});

QUnit.test('is object 1', (assert) => {
  assert.strictEqual(utils.isObject(1), false);
});

QUnit.test('is object null', (assert) => {
  assert.strictEqual(utils.isObject(null), false);
});

QUnit.test('is object undefined', (assert) => {
  assert.strictEqual(utils.isObject(undefined), false);
});

QUnit.test('is object "test"', (assert) => {
  assert.strictEqual(utils.isObject('test'), false);
});

QUnit.test('is object ""', (assert) => {
  assert.strictEqual(utils.isObject(''), false);
});

QUnit.test('is object " "', (assert) => {
  assert.strictEqual(utils.isObject(' '), false);
});

QUnit.test('is array []', (assert) => {
  assert.strictEqual(utils.isArray([]), true);
});

QUnit.test('is array [ "a" ]', (assert) => {
  assert.strictEqual(utils.isArray([ 'a' ]), true);
});

QUnit.test('is array [ "a", "b" ]', (assert) => {
  assert.strictEqual(utils.isArray([ 'a', 'b' ]), true);
});

QUnit.test('is array [ {} ]', (assert) => {
  assert.strictEqual(utils.isArray([ {} ]), true);
});

QUnit.test('is array [ {}, {} ]', (assert) => {
  assert.strictEqual(utils.isArray([ {}, {} ]), true);
});

QUnit.test('is array {}', (assert) => {
  assert.strictEqual(utils.isArray({}), false);
});

QUnit.test('is array { Z1K1: Z6, ... }', (assert) => {
  assert.strictEqual(utils.isArray({ Z1K1: 'Z6', Z6K1: 'a' }), false);
});

QUnit.test('is array true', (assert) => {
  assert.strictEqual(utils.isArray(true), false);
});

QUnit.test('is array 1', (assert) => {
  assert.strictEqual(utils.isArray(1), false);
});

QUnit.test('is array null', (assert) => {
  assert.strictEqual(utils.isArray(null), false);
});

QUnit.test('is array undefined', (assert) => {
  assert.strictEqual(utils.isArray(undefined), false);
});

QUnit.test('is array "test"', (assert) => {
  assert.strictEqual(utils.isArray('test'), false);
});

QUnit.test('is array ""', (assert) => {
  assert.strictEqual(utils.isArray(''), false);
});

QUnit.test('is array " "', (assert) => {
  assert.strictEqual(utils.isArray(' '), false);
});

QUnit.test('is string []', (assert) => {
  assert.strictEqual(utils.isString([]), false);
});

QUnit.test('is string [ "a" ]', (assert) => {
  assert.strictEqual(utils.isString([ 'a' ]), false);
});

QUnit.test('is string [ "a", "b" ]', (assert) => {
  assert.strictEqual(utils.isString([ 'a', 'b' ]), false);
});

QUnit.test('is string [ {} ]', (assert) => {
  assert.strictEqual(utils.isString([ {} ]), false);
});

QUnit.test('is string [ {}, {} ]', (assert) => {
  assert.strictEqual(utils.isString([ {}, {} ]), false);
});

QUnit.test('is string {}', (assert) => {
  assert.strictEqual(utils.isString({}), false);
});

QUnit.test('is string { Z1K1: Z6, ... }', (assert) => {
  assert.strictEqual(utils.isString({ Z1K1: 'Z6', Z6K1: 'a' }), false);
});

QUnit.test('is string true', (assert) => {
  assert.strictEqual(utils.isString(true), false);
});

QUnit.test('is string 1', (assert) => {
  assert.strictEqual(utils.isString(1), false);
});

QUnit.test('is string null', (assert) => {
  assert.strictEqual(utils.isString(null), false);
});

QUnit.test('is string undefined', (assert) => {
  assert.strictEqual(utils.isString(undefined), false);
});

QUnit.test('is string "test"', (assert) => {
  assert.strictEqual(utils.isString('test'), true);
});

QUnit.test('is string ""', (assert) => {
  assert.strictEqual(utils.isString(''), true);
});

QUnit.test('is string " "', (assert) => {
  assert.strictEqual(utils.isString(' '), true);
});

QUnit.test('is id Z1', (assert) => {
  assert.strictEqual(utils.isId('Z1'), true);
});

QUnit.test('is id Z123', (assert) => {
  assert.strictEqual(utils.isId('Z123'), true);
});

QUnit.test('is id Z0', (assert) => {
  assert.strictEqual(utils.isId('Z0'), false);
});

QUnit.test('is id Z1K1', (assert) => {
  assert.strictEqual(utils.isId('Z1K1'), true);
});

QUnit.test('is id Z0K1', (assert) => {
  assert.strictEqual(utils.isId('Z0K1'), false);
});

QUnit.test('is id Q1', (assert) => {
  assert.strictEqual(utils.isId('Q1'), false);
});

QUnit.test('is id ID', (assert) => {
  assert.strictEqual(utils.isId('ID'), false);
});

QUnit.test('is id Z1230', (assert) => {
  assert.strictEqual(utils.isId('Z1230'), true);
});

QUnit.test('is id Z123K', (assert) => {
  assert.strictEqual(utils.isId('Z123K'), false);
});

QUnit.test('is id Z123K1', (assert) => {
  assert.strictEqual(utils.isId('Z123K1'), true);
});

QUnit.test('is id Z123K123', (assert) => {
  assert.strictEqual(utils.isId('Z123K123'), true);
});

QUnit.test('is id Z123K0', (assert) => {
  assert.strictEqual(utils.isId('Z123K0'), false);
});

QUnit.test('is id K1', (assert) => {
  assert.strictEqual(utils.isId('K1'), true);
});

QUnit.test('is id K123', (assert) => {
  assert.strictEqual(utils.isId('K123'), true);
});

QUnit.test('is id K0', (assert) => {
  assert.strictEqual(utils.isId('K0'), false);
});

QUnit.test('is id ZK1', (assert) => {
  assert.strictEqual(utils.isId('ZK1'), false);
});

QUnit.test('is id ""', (assert) => {
  assert.strictEqual(utils.isId(''), false);
});

QUnit.test('is zid Z1', (assert) => {
  assert.strictEqual(utils.isZid('Z1'), true);
});

QUnit.test('is zid Z123', (assert) => {
  assert.strictEqual(utils.isZid('Z123'), true);
});

QUnit.test('is zid Z0', (assert) => {
  assert.strictEqual(utils.isZid('Z0'), false);
});

QUnit.test('is zid Z1K1', (assert) => {
  assert.strictEqual(utils.isZid('Z1K1'), false);
});

QUnit.test('is zid Z0K1', (assert) => {
  assert.strictEqual(utils.isZid('Z0K1'), false);
});

QUnit.test('is zid Q1', (assert) => {
  assert.strictEqual(utils.isZid('Q1'), false);
});

QUnit.test('is zid ID', (assert) => {
  assert.strictEqual(utils.isZid('ID'), false);
});

QUnit.test('is zid Z1230', (assert) => {
  assert.strictEqual(utils.isZid('Z1230'), true);
});

QUnit.test('is zid Z123K', (assert) => {
  assert.strictEqual(utils.isZid('Z123K'), false);
});

QUnit.test('is zid Z123K1', (assert) => {
  assert.strictEqual(utils.isZid('Z123K1'), false);
});

QUnit.test('is zid Z123K123', (assert) => {
  assert.strictEqual(utils.isZid('Z123K123'), false);
});

QUnit.test('is zid Z123K0', (assert) => {
  assert.strictEqual(utils.isZid('Z123K0'), false);
});

QUnit.test('is zid K1', (assert) => {
  assert.strictEqual(utils.isZid('K1'), false);
});

QUnit.test('is zid K123', (assert) => {
  assert.strictEqual(utils.isZid('K123'), false);
});

QUnit.test('is zid K0', (assert) => {
  assert.strictEqual(utils.isZid('K0'), false);
});

QUnit.test('is zid ZK1', (assert) => {
  assert.strictEqual(utils.isZid('ZK1'), false);
});

QUnit.test('is zid ""', (assert) => {
  assert.strictEqual(utils.isZid(''), false);
});

QUnit.test('is zkid Z1', (assert) => {
  assert.strictEqual(utils.isZkid('Z1'), false);
});

QUnit.test('is zkid Z123', (assert) => {
  assert.strictEqual(utils.isZkid('Z123'), false);
});

QUnit.test('is zkid Z0', (assert) => {
  assert.strictEqual(utils.isZkid('Z0'), false);
});

QUnit.test('is zkid Z1K1', (assert) => {
  assert.strictEqual(utils.isZkid('Z1K1'), true);
});

QUnit.test('is zkid Z0K1', (assert) => {
  assert.strictEqual(utils.isZkid('Z0K1'), false);
});

QUnit.test('is zkid Q1', (assert) => {
  assert.strictEqual(utils.isZkid('Q1'), false);
});

QUnit.test('is zkid ID', (assert) => {
  assert.strictEqual(utils.isZkid('ID'), false);
});

QUnit.test('is zkid Z1230', (assert) => {
  assert.strictEqual(utils.isZkid('Z1230'), false);
});

QUnit.test('is zkid Z123K', (assert) => {
  assert.strictEqual(utils.isZkid('Z123K'), false);
});

QUnit.test('is zkid Z123K1', (assert) => {
  assert.strictEqual(utils.isZkid('Z123K1'), true);
});

QUnit.test('is zkid Z123K123', (assert) => {
  assert.strictEqual(utils.isZkid('Z123K123'), true);
});

QUnit.test('is zkid Z123K0', (assert) => {
  assert.strictEqual(utils.isZkid('Z123K0'), false);
});

QUnit.test('is zkid K1', (assert) => {
  assert.strictEqual(utils.isZkid('K1'), false);
});

QUnit.test('is zkid K123', (assert) => {
  assert.strictEqual(utils.isZkid('K123'), false);
});

QUnit.test('is zkid K0', (assert) => {
  assert.strictEqual(utils.isZkid('K0'), false);
});

QUnit.test('is zkid ZK1', (assert) => {
  assert.strictEqual(utils.isZkid('ZK1'), false);
});

QUnit.test('is zkid ""', (assert) => {
  assert.strictEqual(utils.isZkid(''), false);
});

QUnit.test('is zid from zkid Z1K1', (assert) => {
  assert.strictEqual(utils.zidFromZkid('Z1K1'), 'Z1');
});

QUnit.test('is zid from zkid Z123K1', (assert) => {
  assert.strictEqual(utils.zidFromZkid('Z123K1'), 'Z123');
});

QUnit.test('is zid from zkid Z1230K1', (assert) => {
  assert.strictEqual(utils.zidFromZkid('Z1230K1'), 'Z1230');
});

QUnit.test('sort zkid Z1 Z2', (assert) => {
  assert.true(utils.sortZkids('Z1', 'Z2') < 0);
});

QUnit.test('sort zkid Z2 Z1', (assert) => {
  assert.true(utils.sortZkids('Z2', 'Z1') > 0);
});

QUnit.test('sort zkid Z1 Z1', (assert) => {
  assert.false(utils.sortZkids('Z1', 'Z1'));
});

QUnit.test('sort zkid Z12 Z1', (assert) => {
  assert.true(utils.sortZkids('Z12', 'Z1') > 0);
});

QUnit.test('sort zkid Z12 Z2', (assert) => {
  assert.true(utils.sortZkids('Z12', 'Z2') > 0);
});

QUnit.test('sort zkid Z1K1 Z1K1', (assert) => {
  assert.false(utils.sortZkids('Z1K1', 'Z1K1'));
});

QUnit.test('sort zkid Z1K1 Z1K2', (assert) => {
  assert.true(utils.sortZkids('Z1K1', 'Z1K2') < 0);
});

QUnit.test('sort zkid Z2K1 Z1K2', (assert) => {
  assert.true(utils.sortZkids('Z2K1', 'Z1K2') > 0);
});

QUnit.test('sort zkid Z1K123 Z1K2', (assert) => {
  assert.true(utils.sortZkids('Z1K123', 'Z1K2') > 0);
});

QUnit.test('get label [en: yes, de: ja], en', (assert) => {
  assert.strictEqual(utils.getLabel(
    {
      [c.ObjectType]: c.Multilingualtext,
      [c.MultilingualtextTexts]: [
        c.Monolingualtext,
        {
          [c.ObjectType]: c.Monolingualtext,
          [c.MonolingualtextLanguage]: c.English,
          [c.MonolingualtextText]: 'yes'
        },
        {
          [c.ObjectType]: c.Monolingualtext,
          [c.MonolingualtextLanguage]: c.German,
          [c.MonolingualtextText]: 'ja'
        }
      ]
    },
    c.English
  ), 'yes');
});

QUnit.test('get label [en: yes, de: ja], de', (assert) => {
  assert.strictEqual(utils.getLabel(
    {
      [c.ObjectType]: c.Multilingualtext,
      [c.MultilingualtextTexts]: [
        {
          [c.ObjectType]: c.Monolingualtext,
          [c.MonolingualtextLanguage]: c.English,
          [c.MonolingualtextText]: 'yes'
        },
        {
          [c.ObjectType]: c.Monolingualtext,
          [c.MonolingualtextLanguage]: c.German,
          [c.MonolingualtextText]: 'ja'
        }
      ]
    },
    c.German
  ), 'ja');
});

QUnit.test('get label [en: yes, de: ja], ar', (assert) => {
  assert.strictEqual(utils.getLabel(
    {
      [c.ObjectType]: c.Multilingualtext,
      [c.MultilingualtextTexts]: [
        {
          [c.ObjectType]: c.Monolingualtext,
          [c.MonolingualtextLanguage]: c.English,
          [c.MonolingualtextText]: 'yes'
        },
        {
          [c.ObjectType]: c.Monolingualtext,
          [c.MonolingualtextLanguage]: c.German,
          [c.MonolingualtextText]: 'ja'
        }
      ]
    },
    c.Arabic
  ), null);
});

QUnit.test('get label [], en', (assert) => {
  assert.strictEqual(utils.getLabel(
    {
      [c.Object_Type]: c.Multilingualtext,
      [c.MultilingualtextTexts]: []
    },
    c.English
  ), null);
});

QUnit.test('string normalize Hello, Welt!', (assert) => {
  assert.strictEqual(utils.stringNormalize('Hello, Welt!'), 'hello,welt!');
});

QUnit.test('string normalize Hello_Welt', (assert) => {
  assert.strictEqual(utils.stringNormalize('Hello_Welt'), 'hellowelt');
});

QUnit.test('string normalize Hello Welt', (assert) => {
  assert.strictEqual(utils.stringNormalize('Hello Welt'), 'hellowelt');
});

QUnit.test('string normalize Hello-Welt', (assert) => {
  assert.strictEqual(utils.stringNormalize('Hello-Welt'), 'hellowelt');
});

QUnit.test('string normalize HelloWelt', (assert) => {
  assert.strictEqual(utils.stringNormalize('HelloWelt'), 'hellowelt');
});

QUnit.test('string normalize hellowelt', (assert) => {
  assert.strictEqual(utils.stringNormalize('hellowelt'), 'hellowelt');
});
