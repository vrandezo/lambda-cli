'use strict';

const c = require('./constants.js').constants;
const config = require('./config.js');
const evaluate = require('./evaluate.js');
const labelize = require('./labelize.js');
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

const format = (output) => {
  if (utils.isArray(output)) {
    return output.map(format);
  }
  if (utils.isString(output)) {
    return output;
  }
  if (utils.isObject(output)) {
    if (2 === Object.keys(output).length) {
      return output[Object.keys(output)[1]];
    }
  }
  return output;
};

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

const dim = (s) => '\x1b[2m' + s + '\x1b[0m';

const answerAsync = async (input, {
  output = console.log,
  last = null,
  tokens = false,
  ast = false,
  json = false,
  formatter = true,
  timer = false
} = {}) => {
  const starttime = Date.now();
  const data = input.trim();
  const first = data[0];
  let result = null;
  if (first === '[' || first === '{' || first === '"') {
    result = await evaluate.evaluateAsync(JSON.parse(data));
  } else if (utils.isZid(data)) {
    result = await load.load(data).then(getPersistentobjectValue);
  } else if (data === '_') {
    if (last !== null) {
      result = last;
    }
  } else {
    if (tokens) {
      output(dim(formatTokens(parse.tokenize(data))));
    }
    const call = await parse.parseAsync(data);
    if (ast) {
      output(dim(writeNoRemember(call)));
    }
    result = await evaluate.evaluateAsync(call);
  }
  if (json) {
    output(dim(JSON.stringify(result, null, 2)));
  }
  if (formatter) {
    const formatted = await labelize.labelize(format(result));
    output(formatted);
  }
  if (config.timer()) {
    output(dim(`${Date.now() - starttime} ms`));
  }
  return result;
};

exports.formatTokens = formatTokens;
exports.answerAsync = answerAsync;
