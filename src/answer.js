'use strict';

const c = require('./constants.js').constants;
const config = require('./config.js');
const evaluator = require('./evaluate.js');
const normalize = require('./normalize.js');
const canonicalize = require('./canonicalize.js');
const prettyprinter = require('./prettyprint.js');
const labelize = require('./labelize.js');
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
  output = null,
  last = null,
  language = null,
  tokens = null,
  delabel = null,
  ast = null,
  evaluate = null,
  raw = null,
  normal = null,
  canonical = null,
  prettyprint = null,
  label = null,
  format = null,
  timer = null
} = {}) => {
  if (output === null) {
    output = console.log;
  }
  if (language === null) {
    language = config.language();
  }
  if (tokens === null) {
    tokens = config.tokens();
  }
  if (delabel === null) {
    delabel = config.delabel();
  }
  if (ast === null) {
    ast = config.ast();
  }
  if (evaluate === null) {
    evaluate = config.evaluate();
  }
  if (raw === null) {
    raw = config.raw();
  }
  if (normal === null) {
    normal = config.normal();
  }
  if (canonical === null) {
    canonical = config.canonical();
  }
  if (prettyprint === null) {
    prettyprint = config.prettyprint();
  }
  if (label === null) {
    label = config.label();
  }
  if (format === null) {
    format = config.format();
  }
  if (timer === null) {
    timer = config.timer();
  }
  const starttime = Date.now();
  const data = input.trim();
  const first = data[0];
  let call = null;
  let result = null;
  if (first === '[' || first === '{') {
    call = JSON.parse(data);
  } else if (utils.isZid(data)) {
    call = await load.load(data).then(getPersistentobjectValue);
  } else if (data === '_') {
    if (last !== null) {
      call = last;
    }
  } else {
    if (tokens) {
      output(dim(formatter.formatTokens(parse.tokenize(data), language)));
    }
    call = await parse.parseAsync(data);
    if (ast) {
      output(dim(write(call)));
    }
  }
  if (evaluate) {
    result = await evaluator.evaluateAsync(call);
  } else {
    result = call;
  }
  if (raw) {
    output(dim(JSON.stringify(result, null, 2)));
  }
  if (canonical) {
    result = canonicalize.canonicalize(result);
    output(JSON.stringify(result, null, 2));
  }
  if (normal) {
    result = normalize.normalize(result);
    output(JSON.stringify(result, null, 2));
  }
  if (prettyprint) {
    output(prettyprinter.prettyprint(result));
  }
  if (label) {
    output(await labelize.labelize(result));
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
