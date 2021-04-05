'use strict';

const utils = require('./utils.js');

const canonicalize = (zobject) => {
  if (utils.is_array(zobject)) {
    return zobject.map(canonicalize);
  }
  if (utils.is_string(zobject)) {
    return zobject;
  }
  const keys = Object.keys(zobject).sort(utils.sortzkids);
  const result = {};
  for (let key of keys) {
    result[key] = canonicalize(zobject[key]);
  }
  if (keys.includes('Z1K1')) {
    if (zobject.Z1K1 === 'Z6') {
      if (keys.includes('Z6K1') && keys.length === 2) {
        if (!utils.is_zid(zobject.Z6K1)) {
          return zobject.Z6K1;
        }
      }
    }
    if (zobject.Z1K1 === 'Z9') {
      if (keys.includes('Z9K1') && keys.length === 2) {
        if (utils.is_zid(zobject.Z9K1)) {
          return zobject.Z9K1;
        }
      }
    }
    if (zobject.Z1K1 === 'Z10') {
      if (keys.length === 1) {
        return [];
      }
      if (keys.includes('Z10K1') && keys.includes('Z10K2') && keys.length === 3) {
        return [canonicalize(zobject.Z10K1)].concat(canonicalize(zobject.Z10K2));
      }
    }
  }
  return result;
}

const canonicalize_async = async (zobject) => {
  return new Promise((resolve, reject) => {
    resolve(canonicalize(zobject));
  });
}

exports.canonicalize = canonicalize;
exports.canonicalize_async = canonicalize_async;
