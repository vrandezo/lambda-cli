'use strict';

const fs = require("fs");

const utils = require('./utils.js');
const config = require('./config.js');
const canonicalize_schemata = require('../function-schemata/javascript/src/canonicalize.js');

const canonicalize_async = async (zobject) => {
  if (zobject.Z1K1 === 'Z5') { return zobject; }
  return new Promise((resolve, reject) => {
    resolve(canonicalize(zobject));
  });
}

const canonicalize = (zobject) => canonicalize_schemata(zobject);

exports.canonicalize = canonicalize;
exports.canonicalize_async = canonicalize_async;
