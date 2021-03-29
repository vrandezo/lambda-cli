'use strict';

const utils = require('./utils.js');

const labelize_id = (zid) => {
  return 's' + zid; // TODO
}

const labelize_object = (zobject) => {
  let result = {};
  for (let key in zobject) {
    // do not labelize Z6K1
    if ( key === 'Z6K1' && utils.is_string(zobject[key]) ) {
      result[labelize_id(key)] = zobject[key];
    } else {
      result[labelize_id(key)] = labelize(zobject[key]);
    }
  }
  return result;
}

const labelize_string = (zobject) => {
  if ( utils.is_id(zobject) ) {
    return labelize_id( zobject );
  }
  return zobject;
}

const labelize = (zobject) => {
  if ( utils.is_array(zobject) ) {
    return zobject.map(labelize);
  } else if ( utils.is_string(zobject) ) {
    return labelize_string( zobject );
  }
  return labelize_object( zobject );
}

exports.labelize = labelize;
