'use strict';

const is_object = (zobject) => {
  return ( Object.getPrototypeOf(zobject) === Object.prototype );
}

const is_array = (zobject) => {
  return Array.isArray(zobject);
}

const is_string = (zobject) => {
  return (typeof zobject === 'string' || zobject instanceof String);
}

const is_id = (zid) => {
  return /^Z[1-9][0-9]*(K[1-9][0-9]*)?$/.test(zid);
}

const is_zid = (zid) => {
  return /^Z[1-9][0-9]*$/.test(zid);
}

const is_zkid = (zid) => {
  return /^Z[1-9][0-9]*K[1-9][0-9]*$/.test(zid);
}

const zid_from_zkid = (zkid) => {
  return zkid.split('K')[0];
}

exports.is_object = is_object;
exports.is_string = is_string;
exports.is_array = is_array;
exports.is_id = is_id;
exports.is_zid = is_zid;
exports.is_zkid = is_zkid;
exports.zid_from_zkid = zid_from_zkid;
