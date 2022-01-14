'use strict';

const c = require('./constants.js').constants;

const isObject = (zobject) => {
  if (zobject === null) {
    return false;
  }
  if (zobject === undefined) {
    return false;
  }
  return (Object.getPrototypeOf(zobject) === Object.prototype);
};

const isArray = (zobject) => {
  return Array.isArray(zobject);
};

const isString = (zobject) => {
  return (typeof zobject === 'string' || zobject instanceof String);
};

const isId = (zid) => {
  return (/^Z[1-9][0-9]*(K[1-9][0-9]*)?$/.test(zid) || /^K[1-9][0-9]*$/.test(zid));
};

const isZid = (zid) => {
  return /^Z[1-9][0-9]*$/.test(zid);
};

const isZkid = (zid) => {
  return /^Z[1-9][0-9]*K[1-9][0-9]*$/.test(zid);
};

const zidFromZkid = (zkid) => {
  return zkid.split('K')[0];
};

const znumber = (zid) => {
  if (zid[0] !== 'Z') {
    return Infinity;
  }
  if (!zid.includes('K')) {
    return parseInt(zid.slice(1));
  }
  return parseInt(zid.slice(1, zid.indexOf('K')));
};

const knumber = (zid) => {
  if (!zid.includes('K')) {
    return Infinity;
  }
  return parseInt(zid.slice(zid.indexOf('K') + 1));
};

const sortZkids = (left, right) => {
  if (znumber(left) === znumber(right)) {
    if (knumber(left) === knumber(right)) {
      return left < right;
    }
    return knumber(left) - knumber(right);
  }
  return znumber(left) - znumber(right);
};

const getLabel = (multitext, language) => {
  for (const monotext of multitext[c.MultilingualtextTexts]) {
    if (monotext[c.MonolingualtextLanguage] === language) {
      return monotext[c.MonolingualtextText];
    }
  }
  return null;
};

const stringNormalize = (s) => s.toLowerCase().replaceAll(/[\s\-_.()]/g, '');

exports.isObject = isObject;
exports.isString = isString;
exports.isArray = isArray;
exports.isId = isId;
exports.isZid = isZid;
exports.isZkid = isZkid;
exports.zidFromZkid = zidFromZkid;
exports.sortZkids = sortZkids;
exports.getLabel = getLabel;
exports.stringNormalize = stringNormalize;
