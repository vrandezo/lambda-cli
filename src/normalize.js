'use strict';

const utils = require('./utils.js');

const normalize = require('../lib/function-schemata/javascript/src/normalize.js');

const normalize_async = async (zobject) => {
  return new Promise((resolve, reject) => {
    resolve(normalize(zobject));
  });
}

exports.normalize = normalize;
exports.normalize_async = normalize_async;
