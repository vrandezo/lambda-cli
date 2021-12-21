'use strict';

const canonicalize_schemata = require('../function-schemata/javascript/src/canonicalize.js');

const canonicalize_async = async (zobject) => {
  if (zobject.Z1K1 === 'Z5') { return zobject; }
  return new Promise((resolve, reject) => {
    resolve(canonicalize(zobject));
  });
}

// TODO: do something in error case
const canonicalize = (zobject) => canonicalize_schemata(zobject).Z22K1;

exports.canonicalize = canonicalize;
exports.canonicalize_async = canonicalize_async;
