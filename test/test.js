const utils = require('../src/utils.js');

QUnit.module('utils');

QUnit.test('is object []', assert => {
  assert.equal(utils.is_object([]), false);
});

QUnit.test('is object [ "a" ]', assert => {
  assert.equal(utils.is_object([ "a" ]), false);
});

QUnit.test('is object [ "a", "b" ]', assert => {
  assert.equal(utils.is_object([ "a", "b" ]), false);
});

QUnit.test('is object [ {} ]', assert => {
  assert.equal(utils.is_object([ {} ]), false);
});

QUnit.test('is object [ {}, {} ]', assert => {
  assert.equal(utils.is_object([ {}, {} ]), false);
});

QUnit.test('is object {}', assert => {
  assert.equal(utils.is_object({}), true);
});

QUnit.test('is object { Z1K1: Z6, ... }', assert => {
  assert.equal(utils.is_object({ "Z1K1": "Z6", "Z6K1": "a"}), true);
});

QUnit.test('is object true', assert => {
  assert.equal(utils.is_object(true), false);
});

QUnit.test('is object 1', assert => {
  assert.equal(utils.is_object(1), false);
});

QUnit.test('is object null', assert => {
  assert.equal(utils.is_object(null), false);
});

QUnit.test('is object undefined', assert => {
  assert.equal(utils.is_object(undefined), false);
});

QUnit.test('is object "test"', assert => {
  assert.equal(utils.is_object("test"), false);
});

QUnit.test('is object ""', assert => {
  assert.equal(utils.is_object(""), false);
});

QUnit.test('is object " "', assert => {
  assert.equal(utils.is_object(" "), false);
});

QUnit.test('is array []', assert => {
  assert.equal(utils.is_array([]), true);
});

QUnit.test('is array [ "a" ]', assert => {
  assert.equal(utils.is_array([ "a" ]), true);
});

QUnit.test('is array [ "a", "b" ]', assert => {
  assert.equal(utils.is_array([ "a", "b" ]), true);
});

QUnit.test('is array [ {} ]', assert => {
  assert.equal(utils.is_array([ {} ]), true);
});

QUnit.test('is array [ {}, {} ]', assert => {
  assert.equal(utils.is_array([ {}, {} ]), true);
});

QUnit.test('is array {}', assert => {
  assert.equal(utils.is_array({}), false);
});

QUnit.test('is array { Z1K1: Z6, ... }', assert => {
  assert.equal(utils.is_array({ "Z1K1": "Z6", "Z6K1": "a"}), false);
});

QUnit.test('is array true', assert => {
  assert.equal(utils.is_array(true), false);
});

QUnit.test('is array 1', assert => {
  assert.equal(utils.is_array(1), false);
});

QUnit.test('is array null', assert => {
  assert.equal(utils.is_array(null), false);
});

QUnit.test('is array undefined', assert => {
  assert.equal(utils.is_array(undefined), false);
});

QUnit.test('is array "test"', assert => {
  assert.equal(utils.is_array("test"), false);
});

QUnit.test('is array ""', assert => {
  assert.equal(utils.is_array(""), false);
});

QUnit.test('is array " "', assert => {
  assert.equal(utils.is_array(" "), false);
});

QUnit.test('is string []', assert => {
  assert.equal(utils.is_string([]), false);
});

QUnit.test('is string [ "a" ]', assert => {
  assert.equal(utils.is_string([ "a" ]), false);
});

QUnit.test('is string [ "a", "b" ]', assert => {
  assert.equal(utils.is_string([ "a", "b" ]), false);
});

QUnit.test('is string [ {} ]', assert => {
  assert.equal(utils.is_string([ {} ]), false);
});

QUnit.test('is string [ {}, {} ]', assert => {
  assert.equal(utils.is_string([ {}, {} ]), false);
});

QUnit.test('is string {}', assert => {
  assert.equal(utils.is_string({}), false);
});

QUnit.test('is string { Z1K1: Z6, ... }', assert => {
  assert.equal(utils.is_string({ "Z1K1": "Z6", "Z6K1": "a"}), false);
});

QUnit.test('is string true', assert => {
  assert.equal(utils.is_string(true), false);
});

QUnit.test('is string 1', assert => {
  assert.equal(utils.is_string(1), false);
});

QUnit.test('is string null', assert => {
  assert.equal(utils.is_string(null), false);
});

QUnit.test('is string undefined', assert => {
  assert.equal(utils.is_string(undefined), false);
});

QUnit.test('is string "test"', assert => {
  assert.equal(utils.is_string("test"), true);
});

QUnit.test('is string ""', assert => {
  assert.equal(utils.is_string(""), true);
});

QUnit.test('is string " "', assert => {
  assert.equal(utils.is_string(" "), true);
});

QUnit.test('is id Z1', assert => {
  assert.equal(utils.is_id("Z1"), true);
});

QUnit.test('is id Z123', assert => {
  assert.equal(utils.is_id("Z123"), true);
});

QUnit.test('is id Z0', assert => {
  assert.equal(utils.is_id("Z0"), false);
});

QUnit.test('is id Z1K1', assert => {
  assert.equal(utils.is_id("Z1K1"), true);
});

QUnit.test('is id Z0K1', assert => {
  assert.equal(utils.is_id("Z0K1"), false);
});

QUnit.test('is id Q1', assert => {
  assert.equal(utils.is_id("Q1"), false);
});

QUnit.test('is id ID', assert => {
  assert.equal(utils.is_id("ID"), false);
});

QUnit.test('is id Z1230', assert => {
  assert.equal(utils.is_id("Z1230"), true);
});

QUnit.test('is id Z123K', assert => {
  assert.equal(utils.is_id("Z123K"), false);
});

QUnit.test('is id Z123K1', assert => {
  assert.equal(utils.is_id("Z123K1"), true);
});

QUnit.test('is id Z123K123', assert => {
  assert.equal(utils.is_id("Z123K123"), true);
});

QUnit.test('is id Z123K0', assert => {
  assert.equal(utils.is_id("Z123K0"), false);
});

QUnit.test('is id K1', assert => {
  assert.equal(utils.is_id("K1"), true);
});

QUnit.test('is id K123', assert => {
  assert.equal(utils.is_id("K123"), true);
});

QUnit.test('is id K0', assert => {
  assert.equal(utils.is_id("K0"), false);
});

QUnit.test('is id ZK1', assert => {
  assert.equal(utils.is_id("ZK1"), false);
});

QUnit.test('is id ""', assert => {
  assert.equal(utils.is_id(""), false);
});

QUnit.test('is zid Z1', assert => {
  assert.equal(utils.is_zid("Z1"), true);
});

QUnit.test('is zid Z123', assert => {
  assert.equal(utils.is_zid("Z123"), true);
});

QUnit.test('is zid Z0', assert => {
  assert.equal(utils.is_zid("Z0"), false);
});

QUnit.test('is zid Z1K1', assert => {
  assert.equal(utils.is_zid("Z1K1"), false);
});

QUnit.test('is zid Z0K1', assert => {
  assert.equal(utils.is_zid("Z0K1"), false);
});

QUnit.test('is zid Q1', assert => {
  assert.equal(utils.is_zid("Q1"), false);
});

QUnit.test('is zid ID', assert => {
  assert.equal(utils.is_zid("ID"), false);
});

QUnit.test('is zid Z1230', assert => {
  assert.equal(utils.is_zid("Z1230"), true);
});

QUnit.test('is zid Z123K', assert => {
  assert.equal(utils.is_zid("Z123K"), false);
});

QUnit.test('is zid Z123K1', assert => {
  assert.equal(utils.is_zid("Z123K1"), false);
});

QUnit.test('is zid Z123K123', assert => {
  assert.equal(utils.is_zid("Z123K123"), false);
});

QUnit.test('is zid Z123K0', assert => {
  assert.equal(utils.is_zid("Z123K0"), false);
});

QUnit.test('is zid K1', assert => {
  assert.equal(utils.is_zid("K1"), false);
});

QUnit.test('is zid K123', assert => {
  assert.equal(utils.is_zid("K123"), false);
});

QUnit.test('is zid K0', assert => {
  assert.equal(utils.is_zid("K0"), false);
});

QUnit.test('is zid ZK1', assert => {
  assert.equal(utils.is_zid("ZK1"), false);
});

QUnit.test('is zid ""', assert => {
  assert.equal(utils.is_zid(""), false);
});

QUnit.test('is zkid Z1', assert => {
  assert.equal(utils.is_zkid("Z1"), false);
});

QUnit.test('is zkid Z123', assert => {
  assert.equal(utils.is_zkid("Z123"), false);
});

QUnit.test('is zkid Z0', assert => {
  assert.equal(utils.is_zkid("Z0"), false);
});

QUnit.test('is zkid Z1K1', assert => {
  assert.equal(utils.is_zkid("Z1K1"), true);
});

QUnit.test('is zkid Z0K1', assert => {
  assert.equal(utils.is_zkid("Z0K1"), false);
});

QUnit.test('is zkid Q1', assert => {
  assert.equal(utils.is_zkid("Q1"), false);
});

QUnit.test('is zkid ID', assert => {
  assert.equal(utils.is_zkid("ID"), false);
});

QUnit.test('is zkid Z1230', assert => {
  assert.equal(utils.is_zkid("Z1230"), false);
});

QUnit.test('is zkid Z123K', assert => {
  assert.equal(utils.is_zkid("Z123K"), false);
});

QUnit.test('is zkid Z123K1', assert => {
  assert.equal(utils.is_zkid("Z123K1"), true);
});

QUnit.test('is zkid Z123K123', assert => {
  assert.equal(utils.is_zkid("Z123K123"), true);
});

QUnit.test('is zkid Z123K0', assert => {
  assert.equal(utils.is_zkid("Z123K0"), false);
});

QUnit.test('is zkid K1', assert => {
  assert.equal(utils.is_zkid("K1"), false);
});

QUnit.test('is zkid K123', assert => {
  assert.equal(utils.is_zkid("K123"), false);
});

QUnit.test('is zkid K0', assert => {
  assert.equal(utils.is_zkid("K0"), false);
});

QUnit.test('is zkid ZK1', assert => {
  assert.equal(utils.is_zkid("ZK1"), false);
});

QUnit.test('is zkid ""', assert => {
  assert.equal(utils.is_zkid(""), false);
});

QUnit.test('is zid from zkid Z1K1', assert => {
  assert.equal(utils.zid_from_zkid("Z1K1"), "Z1");
});

QUnit.test('is zid from zkid Z123K1', assert => {
  assert.equal(utils.zid_from_zkid("Z123K1"), "Z123");
});

QUnit.test('is zid from zkid Z1230K1', assert => {
  assert.equal(utils.zid_from_zkid("Z1230K1"), "Z1230");
});

QUnit.test('sort zkid Z1 Z2', assert => {
  assert.equal(utils.sort_zkids("Z1", "Z2") < 0, true);
});

QUnit.test('sort zkid Z2 Z1', assert => {
  assert.equal(utils.sort_zkids("Z2", "Z1") > 0, true);
});

QUnit.test('sort zkid Z1 Z1', assert => {
  assert.equal(utils.sort_zkids("Z1", "Z1"), 0);
});

QUnit.test('sort zkid Z12 Z1', assert => {
  assert.equal(utils.sort_zkids("Z12", "Z1") > 0, true);
});

QUnit.test('sort zkid Z12 Z2', assert => {
  assert.equal(utils.sort_zkids("Z12", "Z2") > 0, true);
});

QUnit.test('sort zkid Z1K1 Z1K1', assert => {
  assert.equal(utils.sort_zkids("Z1K1", "Z1K1"), 0);
});

QUnit.test('sort zkid Z1K1 Z1K2', assert => {
  assert.equal(utils.sort_zkids("Z1K1", "Z1K2") < 0, true);
});

QUnit.test('sort zkid Z2K1 Z1K2', assert => {
  assert.equal(utils.sort_zkids("Z2K1", "Z1K2") > 0, true);
});

QUnit.test('sort zkid Z1K123 Z1K2', assert => {
  assert.equal(utils.sort_zkids("Z1K123", "Z1K2") > 0, true);
});

QUnit.test('get label [en: yes, de: ja], en', assert => {
  assert.equal(utils.get_label(
    {
      "Z1K1": "Z12",
      "Z12K1": [
        {
          "Z1K1": "Z11",
          "Z11K1": "Z1002",
          "Z11K2": "yes"
        },
        {
          "Z1K1": "Z11",
          "Z11K1": "Z1430",
          "Z11K2": "ja"
        }
      ]
    },
    "Z1002"
  ), "yes");
});
// TODO: more get label
// TODO: string normalize
