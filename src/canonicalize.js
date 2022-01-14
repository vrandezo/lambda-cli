'use strict';

const canonicalizeSchemata = require('../function-schemata/javascript/src/canonicalize.js');

// TODO: do something in error case
const canonicalize = (zobject) => canonicalizeSchemata(zobject).Z22K1;

const canonicalizeAsync = async (zobject) => {
  if (zobject.Z1K1 === 'Z5') {
    return zobject;
  }
  return new Promise((resolve, reject) => {
    resolve(canonicalize(zobject));
  });
};

exports.canonicalize = canonicalize;
exports.canonicalizeAsync = canonicalizeAsync;
