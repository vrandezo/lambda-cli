#!/usr/bin/env node
'use strict';

const answer = require('./answer.js');
const canonicalize = require('./canonicalize.js');
const config = require('./config.js');
const evaluate = require('./evaluate.js');
const interactive = require('./interactive.js');
const labelize = require('./labelize.js');
const normalize = require('./normalize.js');
const prettyprint = require('./prettyprint.js');

let command = null;
let input = null;

((argv) => {
  let i = 1;

  while (++i < argv.length) {
    const v = argv[i];
    if (v[0] === '-') {
      if (v === '--language') {
        const lang = argv[i + 1];  // TODO do something in case of error
        i++;
        config.setLanguage(lang);
        continue;
      }
      if (v === '--wiki') {
        const wiki = argv[i + 1];  // TODO do something in case of error
        i++;
        config.setWiki(wiki);
        continue;
      }
      if (v === '--cache') {
        const cache = argv[i + 1];  // TODO do something in case of error
        i++;
        config.setCache(cache);
        continue;
      }
      if (v === '--tokens') {
        config.setTokens(true);
        continue;
      }
      if (v === '--ast') {
        config.setAst(true);
        continue;
      }
      if (v === '--timer') {
        config.setTimer(true);
        continue;
      }
      console.log('Unknown argument: ' + v);
      process.exit(1);  // eslint-disable-line no-process-exit
    }
    if (command === null) {
      if (v === 'labelize' || v === 'l') {
        command = labelize.labelize;
        continue;
      }
      if (v === 'normalize' || v === 'n') {
        command = normalize.normalizeAsync;
        continue;
      }
      if (v === 'canonicalize' || v === 'c') {
        command = canonicalize.canonicalizeAsync;
        continue;
      }
      if (v === 'prettyprint' || v === 'p') {
        command = prettyprint.prettyprintAsync;
        continue;
      }
      if (v === 'evaluate' || v === 'e') {
        command = evaluate.evaluateAsync;
        continue;
      }
      console.log('Unknown command: ' + v);
      process.exit(1);  // eslint-disable-line no-process-exit
    }
    if (input === null) {
      input = v;
      continue;
    }
    console.log('Unknown parameter: ' + argv[i]);
    process.exit(1);  // eslint-disable-line no-process-exit
  }
})(process.argv);

if (command !== null) {
  if (input === null) {
    console.log('No input given.');
    process.exit(1);  // eslint-disable-line no-process-exit
  }
  const call = answer.answerAsync(input, {
    tokens: config.tokens(),
    ast: config.ast(),
    timer: config.timer(),
    json: false,
    formatter: false
  });
  call.then(command).then(console.log);
} else {
  interactive.interactive();
}
