'use strict';

const canonicalize = require('./canonicalize.js');

const prettyprint = (zobject) => {
  process.stdout.write(
    JSON.stringify(canonicalize.canonicalize(zobject), null, '\t')
  );
  return null;
};

const prettyprintAsync = async (zobject) => {
  return new Promise((resolve, reject) => {
    resolve(prettyprint(zobject));
  });
};

exports.prettyprint = prettyprint;
exports.prettyprintAsync = prettyprintAsync;
