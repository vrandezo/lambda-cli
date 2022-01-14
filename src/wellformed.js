'use strict';

const utils = require('./utils.js');

const wellformedObject = (zobject) => {
  if (zobject.Z1K1 === 'Z2') { // TODO
    return [];
  }
  return [{
    Z1K1: 'Z5' // TODO
  }];
};

const wellformedArray = (arr) => {
  if (arr.flatMap(wellformed).length === 0) {  // eslint-disable-line no-use-before-define, no-restricted-properties, max-len
    return []; // TODO
  }
  return [{
    Z1K1: 'Z5' // TODO
  }];
};

const wellformed = (zobject) => {
  if (utils.isObject(zobject)) {
    return wellformedObject(zobject);
  } else if (utils.isArray(zobject)) {
    return wellformedArray(zobject);
  } else if (utils.isString(zobject)) {
    return [];
  }
  return [{
    Z1K1: 'Z5' // TODO
  }];
};

exports.wellformed = wellformed;
