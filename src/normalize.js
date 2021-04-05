'use strict';

const utils = require('./utils.js');

const normalize = (zobject) => {
  if (utils.is_array(zobject)) {
    if (zobject.length === 0) {
      return { Z1K1: "Z10" };
    }
    return {
      Z1K1: "Z10",
      Z10K1: normalize(zobject[0]),
      Z10K2: normalize(zobject.slice(1))
    }
  }
  if (utils.is_string(zobject)) {
    if (utils.is_zid(zobject)) {
      return {
        Z1K1: "Z9",
        Z9K1: zobject
      }
    }
    return {
      Z1K1: "Z6",
      Z6K1: zobject
    }
  }
  const keys = Object.keys(zobject).sort(utils.sort_zkids);
  const result = {};
  for (let key of keys) {
    if (["Z6K1", "Z9K1"].includes(key)) {
      result[key] = zobject[key];
    } else {
      result[key] = normalize(zobject[key]);
    }
  }
  return result;
}

const normalize_async = async (zobject) => {
  return new Promise((resolve, reject) => {
    resolve(normalize(zobject));
  });
}

exports.normalize = normalize;
exports.normalize_async = normalize_async;
