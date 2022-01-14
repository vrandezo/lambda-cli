'use strict';

const config = require('./config.js');
const utils = require('./utils.js');
const load = require('./load.js');

const labelizeId = async (id) => {
  if (utils.is_zid(id)) {
    const zobject = await load.load(id);
    if (zobject.Z1K1 === 'Z5') {
      return id;
    }
    const label = utils.get_label(zobject.Z2K3, config.language());
    return (label === null) ? id : label;
  }
  if (utils.is_zkid(id)) {
    const zid = utils.zid_from_zkid(id);
    const zobject = await load.load(zid);
    if (zobject.Z1K1 === 'Z5') {
      return id;
    }
    if (zobject.Z2K2.Z1K1 === 'Z4') {
      for (const key of zobject.Z2K2.Z4K2) {
        if (key.Z3K2 === id) {
          const label = utils.get_label(key.Z3K3, config.language());
          return (label === null) ? id : label;
        }
      }
    }
    if (zobject.Z2K2.Z1K1 === 'Z8') {
      for (const key of zobject.Z2K2.Z8K1) {
        if (key.Z17K2 === id) {
          const label = utils.get_label(key.Z17K3, config.language());
          return (label === null) ? id : label;
        }
      }
    }
  }
  return id;
};

const labelizeObject = async (zobject) => {
  const result = {};
  for (const key in zobject) {
    // do not labelize Z6K1
    if (key === 'Z6K1' && utils.is_string(zobject[key])) {
      result[await labelizeId(key)] = zobject[key];
    } else {
      result[await labelizeId(key)] =
        await labelize(zobject[key]);  // eslint-disable-line no-use-before-define
    }
  }
  return result;
};

const labelizeString = async (zobject) => {
  if (utils.is_id(zobject)) {
    return await labelizeId(zobject);
  }
  return zobject;
};

const labelize = async (zobject) => {
  if (utils.is_array(zobject)) {
    return await Promise.all(zobject.map(labelize));
  } else if (utils.is_string(zobject)) {
    return await labelizeString(zobject);
  }
  return await labelizeObject(zobject);
};

exports.labelize = labelize;
