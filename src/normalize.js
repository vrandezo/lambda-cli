'use strict';

const fs = require("fs");

const utils = require('./utils.js');
const config = require('./config.js');
const normalize_schemata = require('../function-schemata/javascript/src/normalize.js');

const normalize_async = async (zobject) => {
  return new Promise((resolve, reject) => {
    // TODO: if Z22K2 != Z23 reject, else
    resolve(normalize(zobject));
  });
}

// TODO: if Z22K2 != Z23 reject, else
// if ( Z5Validator.validateStatus( normalized.Z22K2 ).isValid() ) {
  // forward the error that happened in preliminary normalization
//  return normalized;
//}
const normalize = (zobject) => normalize_schemata(zobject).Z22K1;

exports.normalize = normalize;
exports.normalize_async = normalize_async;
