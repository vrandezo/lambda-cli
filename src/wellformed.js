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
  if (arr.flatMap(wellformed).length === 0) {  // eslint-disable-line no-use-before-define
    return []; // TODO
  }
  return [{
    Z1K1: 'Z5' // TODO
  }];
};

const wellformed = (zobject) => {
  if (utils.is_object(zobject)) {
    return wellformedObject(zobject);
  } else if (utils.is_array(zobject)) {
    return wellformedArray(zobject);
  } else if (utils.is_string(zobject)) {
    return [];
  }
  return [{
    Z1K1: 'Z5' // TODO
  }];
};

exports.wellformed = wellformed;
