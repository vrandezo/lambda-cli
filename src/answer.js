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

const id = (s) => s;

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
  focus = null,
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

  if (focus === null) {
    if (format) {
      focus = 'format';
    } else {
      if (label) {
        focus = 'label';
      } else {
        if (prettyprint) {
          focus = 'prettyprint';
        } else {
          if (canonical) {
            focus = 'canonical';
          } else {
            if (normal) {
              focus = 'normal';
            } else {
              if (raw) {
                focus = 'raw';
              } else {
                if (ast) {
                  focus = 'ast';
                } else {
                  if (delabel) {
                    focus = 'delabel';
                  } else {
                    if (tokens) {
                      focus = 'tokens';
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  }

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
      const f = (focus === 'tokens') ? id : dim;
      output(f(formatter.formatTokens(parse.tokenize(data), language)));
    }
    if (delabel) {
      const f = (focus === 'delabel') ? id : dim;
      output(f(formatter.formatTokens(
        await parse.delabelAsync(parse.tokenize(data)),
        language
      )));
    }
    call = await parse.parseAsync(data);
    if (ast) {
      const f = (focus === 'ast') ? id : dim;
      output(f(write(call)));
    }
  }
  if (evaluate) {
    result = await evaluator.evaluateAsync(call);
  } else {
    result = call;
  }
  if (raw) {
    const f = (focus === 'raw') ? id : dim;
    output(f(JSON.stringify(result, null, 2)));
  }
  if (canonical) {
    result = canonicalize.canonicalize(result);
    const f = (focus === 'canonical') ? id : dim;
    output(f(JSON.stringify(result, null, 2)));
  }
  if (normal) {
    result = normalize.normalize(result);
    const f = (focus === 'normal') ? id : dim;
    output(f(JSON.stringify(result, null, 2)));
  }
  if (prettyprint) {
    const f = (focus === 'prettyprint') ? id : dim;
    output(f(prettyprinter.prettyprint(result)));
  }
  if (label) {
    const f = (focus === 'label') ? id : dim;
    output(f(await labelize.labelize(result)));
  }
  if (format) {
    const formatted = await formatter.format(result, language);
    const f = (focus === 'format') ? id : dim;
    output(f(formatted));
  }
  if (config.timer()) {
    output(dim(`${Date.now() - starttime} ms`));
  }
  return result;
};

exports.answerAsync = answerAsync;
