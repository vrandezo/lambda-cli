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

const znumber = (zid) => {
  if (zid[0] !== 'Z') {
    return Infinity;
  }
  if (zid.indexOf('K') === -1) {
    return parseInt(zid.slice(1));
  }
  return parseInt(zid.slice(1, zid.indexOf('K')));
}

const knumber = (zid) => {
  if (zid.indexOf('K') === -1) {
    return Infinity;
  }
  return parseInt(zid.slice(zid.indexOf('K') + 1));
}

const sort_zkids = (left, right) => {
  if (znumber(left) === znumber(right)) {
    if (knumber(left) === knumber(right)) {
      return left < right;
    }
    return knumber(left) - knumber(right);
  }
  return znumber(left) - znumber(right);
}

exports.is_object = is_object;
exports.is_string = is_string;
exports.is_array = is_array;
exports.is_id = is_id;
exports.is_zid = is_zid;
exports.is_zkid = is_zkid;
exports.zid_from_zkid = zid_from_zkid;
exports.sort_zkids = sort_zkids;
