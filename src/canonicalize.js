'use strict';

const fs = require("fs");

const utils = require('./utils.js');
const config = require('./config.js');

let canonfun = undefined;

const canonicalize = (zobject) => {
  if (canonfun === undefined) {
    const schemata_dir = config.schemata_directory();
    canonfun = require(schemata_dir + '/javascript/src/canonicalize.js');
  }
  return canonfun(zobject);
}

const canonicalize_async = async (zobject) => {
  return new Promise((resolve, reject) => {
    resolve(canonicalize(zobject));
  });
}

exports.canonicalize = canonicalize;
exports.canonicalize_async = canonicalize_async;
