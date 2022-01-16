'use strict';

const c = require('./constants.js').constants;
const config = require('./config.js');
const evaluate = require('./evaluate.js');
const load = require('./load.js');
const parse = require('./parse.js');
const utils = require('./utils.js');

// const getZ22K1 = (zobject) => {
//  if ((zobject.Z1K1 === 'Z22') || (zobject.Z1K1.Z9K1 === 'Z22')) {
//    return zobject.Z22K1;
//  } else {
//    return zobject;
//  }
// };

// const format = (output) => {
//  if (utils.isArray(output)) {
//    return output.map(format);
//  }
//  if (utils.isString(output)) {
//    return output;
//  }
//  if (utils.isObject(output)) {
//    if (c.Boolean === output[c.ObjectType]) {
//      return output[c.BooleanValue];
//    }
//  }
//  return output;
// };

const getPersistentobjectValue = (zobject) => {
  return zobject[c.PersistentobjectValue];
};

const formatTokens = (tokens) => {
  let result = '';
  tokens.forEach((token, i) => {
    result += token[c.TokenType];
    if (token[c.TokenValue] !== undefined) {
      result += '(' + token[c.TokenValue] + ')';
    }
    result += ' ';
  });
  return result;
};

const writeNoRemember = (input) => {
  if (input === null) {
    return '';
  }
  return JSON.stringify(input, null, 2);
};

const answerAsync = async (input, {
  output = console.log,
  last = null
} = {}) => {
  const starttime = Date.now();
  const data = input.trim();
  const first = data[0];
  if (first === '[' || first === '{' || first === '"') {
    return await evaluate.evaluateAsync(JSON.parse(data));
  } else if (utils.isZid(data)) {
    return await load.load(data).then(getPersistentobjectValue);
  } else if (data === '_') {
    if (last !== null) {
      output(JSON.stringify(last, null, 2));
    }
    return last;
  } else {
    if (config.tokens()) {
      output('\x1b[2m' + formatTokens(parse.tokenize(data)) + '\x1b[0m');
    }
    const call = await parse.parseAsync(data);
    if (config.ast()) {
      output('\x1b[2m' + writeNoRemember(call) + '\x1b[0m');
    }
    const result = await evaluate.evaluateAsync(call);
    output(JSON.stringify(result, null, 2));
    if (config.timer()) {
      output(`\x1b[2m${Date.now() - starttime} ms\x1b[0m`);
    }
    return result;
  }
};

exports.formatTokens = formatTokens;
exports.answerAsync = answerAsync;
