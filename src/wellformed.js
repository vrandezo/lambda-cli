'use strict';

const wellformed_object = (zobject) => {
  if (zobject.Z1K1 === 'Z2') {
    return [];
  }
  return [{
    'Z1K1': 'Z5'
  }];
}

const wellformed_array = (arr) => {
  if (arr.flatMap(wellformed).length === 0) {
    return [];
  }
  return [{
    'Z1K1': 'Z5'
  }];
}

const is_object = (zobject) => {
  return ( Object.getPrototypeOf(zobject) === Object.prototype );
}

const is_array = (zobject) => {
  return Array.isArray(zobject);
}

const is_string = (zobject) => {
  return (typeof zobject === 'string' || zobject instanceof String);
}

const wellformed = (zobject) => {
  if (is_object(zobject)) {
    return wellformed_object(zobject);
  } else if (is_array(zobject)) {
    return wellformed_array(zobject);
  } else if (is_string(zobject)) {
    return [];
  }
  return [{
    'Z1K1': 'Z5'
  }];
}

exports.wellformed = wellformed;
