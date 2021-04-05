'use strict';

const canonicalize = require('./canonicalize.js');
const utils = require('./utils.js');

const prettyprint = (zobject) => {
  process.stdout.write(
    JSON.stringify(canonicalize.canonicalize(zobject), null, '\t')
  );
  return null;
}

const prettyprint_async = async (zobject) => {
  return new Promise((resolve, reject) => {
    resolve(prettyprint(zobject));
  });
}

exports.prettyprint = prettyprint;
exports.prettyprint_async = prettyprint_async;
