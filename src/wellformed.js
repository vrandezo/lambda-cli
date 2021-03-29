'use strict';

const utils = require('./utils.js');

const wellformed_object = (zobject) => {
  if (zobject.Z1K1 === 'Z2') { // TODO
    return [];
  }
  return [{
    'Z1K1': 'Z5' // TODO
  }];
}

const wellformed_array = (arr) => {
  if (arr.flatMap(wellformed).length === 0) {
    return []; // TODO
  }
  return [{
    'Z1K1': 'Z5' // TODO
  }];
}

const wellformed = (zobject) => {
  if (utils.is_object(zobject)) {
    return wellformed_object(zobject);
  } else if (utils.is_array(zobject)) {
    return wellformed_array(zobject);
  } else if (utils.is_string(zobject)) {
    return [];
  }
  return [{
    'Z1K1': 'Z5' // TODO
  }];
}

exports.wellformed = wellformed;
