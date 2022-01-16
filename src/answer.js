'use strict';

const c = require('./constants.js').constants;
const config = require('./config.js');
const evaluate = require('./evaluate.js');
const load = require('./load.js');
const parse = require('./parse.js');
const utils = require('./utils.js');

const getPersistentobjectValue = (zobject) => {
  return zobject[c.PersistentobjectValue];
};

const writeTokens = (tokens) => {
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

const answerAsync = async (input, output, last) => {
  const starttime = Date.now();
  const data = input.trim();
  const first = data[0];
  if (first === '[' || first === '{' || first === '"') {
    return await evaluate.evaluateAsync(JSON.parse(data));
  } else if (utils.isZid(data)) {
    return await load.load(data).then(getPersistentobjectValue);
  } else if (data === '_') {
    return last;
  } else {
    if (config.tokens()) {
      output('\x1b[2m' + writeTokens(parse.tokenize(data)) + '\x1b[0m');
    }
    const call = await parse.parseAsync(data);
    if (config.ast()) {
      output('\x1b[2m' + writeNoRemember(call) + '\x1b[0m');
    }
    const result = await evaluate.evaluateAsync(call);
    if (config.timer()) {
      output(`\x1b[2m${Date.now() - starttime} ms\x1b[0m`);
    }
    return result;
  }
};

exports.answerAsync = answerAsync;