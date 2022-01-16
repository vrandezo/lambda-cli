'use strict';

const canonicalize = require('./canonicalize.js');

const prettyprint = (zobject) => {
  return JSON.stringify(canonicalize.canonicalize(zobject), null, '\t');
};

const prettyprintAsync = async (zobject) => {
  return new Promise((resolve, reject) => {
    resolve(prettyprint(zobject));
  });
};

exports.prettyprint = prettyprint;
exports.prettyprintAsync = prettyprintAsync;
