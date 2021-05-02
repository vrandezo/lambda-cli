'use strict';

const utils = require('./utils.js');

const canonicalize = require('../lib/function-schemata/javascript/src/canonicalize.js');

const canonicalize_async = async (zobject) => {
  return new Promise((resolve, reject) => {
    resolve(canonicalize(zobject));
  });
}

exports.canonicalize = canonicalize;
exports.canonicalize_async = canonicalize_async;
