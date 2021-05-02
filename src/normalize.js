'use strict';

const fs = require("fs");

const utils = require('./utils.js');
const config = require('./config.js');

let normalfun = undefined;

const normalize = (zobject) => {
  if (normalfun === undefined) {
    const schemata_dir = config.schemata_directory();
    normalfun = require(schemata_dir + '/javascript/src/normalize.js');
  }
  return normalfun(zobject);
}

const normalize_async = async (zobject) => {
  return new Promise((resolve, reject) => {
    resolve(normalize(zobject));
  });
}

exports.normalize = normalize;
exports.normalize_async = normalize_async;
