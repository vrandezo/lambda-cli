'use strict';

const fs = require("fs");

const utils = require('./utils.js');
const config = require('./config.js');
const canonicalize = require('../function-schemata/javascript/src/canonicalize.js');

const canonicalize_async = async (zobject) => {
  if (zobject.Z1K1 === 'Z5') { return zobject; }
  return new Promise((resolve, reject) => {
    resolve(canonicalize(zobject));
  });
}

exports.canonicalize = canonicalize;
exports.canonicalize_async = canonicalize_async;
