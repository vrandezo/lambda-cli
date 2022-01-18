'use strict';

const c = require('./constants.js').constants;
const config = require('./config.js');
const evaluator = require('./evaluate.js');
const formatter = require('./format.js');
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

const getPersistentobjectValue = (zobject) => {
  return zobject[c.PersistentobjectValue];
};

const write = (input) => {
  if (input === null) {
    return '';
  }
  return JSON.stringify(input, null, 2);
};

const dim = (s) => '\x1b[2m' + s + '\x1b[0m';

const answerAsync = async (input, {
  output = console.log,
  last = null,
  language = config.language(),
  tokens = false,
  delabel = false,
  ast = false,
  evaluate = true,
  raw = false,
  canonical = false,
  normal = false,
  prettyprint = false,
  label = false,
  format = true,
  timer = false
} = {}) => {
  const starttime = Date.now();
  const data = input.trim();
  const first = data[0];
  let result = null;
  if (first === '[' || first === '{') {
    result = await evaluate.evaluateAsync(JSON.parse(data));
  } else if (utils.isZid(data)) {
    result = await load.load(data).then(getPersistentobjectValue);
  } else if (data === '_') {
    if (last !== null) {
      result = last;
    }
  } else {
    if (tokens) {
      output(dim(formatter.formatTokens(parse.tokenize(data), language)));
    }
    const call = await parse.parseAsync(data);
    if (ast) {
      output(dim(write(call)));
    }
    result = await evaluator.evaluateAsync(call);
  }
  if (raw) {
    output(dim(JSON.stringify(result, null, 2)));
  }
  if (format) {
    const formatted = await formatter.format(result, language);
    output(formatted);
  }
  if (config.timer()) {
    output(dim(`${Date.now() - starttime} ms`));
  }
  return result;
};

exports.answerAsync = answerAsync;
