'use strict';

const normalizeSchemata = require('../function-schemata/javascript/src/normalize.js');

// TODO: if Z22K2 != Z23 reject, else
// if ( Z5Validator.validateStatus( normalized.Z22K2 ).isValid() ) {
  // forward the error that happened in preliminary normalization
//  return normalized;
// }
const normalize = (zobject) => normalizeSchemata(zobject).Z22K1;

const normalizeAsync = async (zobject) => {
  return new Promise((resolve, reject) => {
    // TODO: if Z22K2 != Z23 reject, else
    resolve(normalize(zobject));
  });
};

exports.normalize = normalize;
exports.normalizeAsync = normalizeAsync;
