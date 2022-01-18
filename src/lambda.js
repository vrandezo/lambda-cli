#!/usr/bin/env node
'use strict';

const answer = require('./answer.js');
const config = require('./config.js');
const interactive = require('./interactive.js');

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
      if (v === '--notokens') {
        config.setTokens(false);
        continue;
      }
      if (v === '--delabel') {
        config.setDelabel(true);
        continue;
      }
      if (v === '--nodelabel') {
        config.setDelabel(false);
        continue;
      }
      if (v === '--ast') {
        config.setAst(true);
        continue;
      }
      if (v === '--noast') {
        config.setAst(false);
        continue;
      }
      if ((v === '--eval') || (v === '--evaluate')) {
        config.setEvaluate(true);
        continue;
      }
      if ((v === '--noeval') || (v === '--noevaluate')) {
        config.setEvaluate(false);
        continue;
      }
      if (v === '--raw') {
        config.setRaw(true);
        continue;
      }
      if (v === '--noraw') {
        config.setRaw(false);
        continue;
      }
      if (v === '--normal') {
        config.setNormal(true);
        continue;
      }
      if (v === '--nonormal') {
        config.setNormal(false);
        continue;
      }
      if (v === '--canonical') {
        config.setCanonical(true);
        continue;
      }
      if (v === '--nocanonical') {
        config.setCanonical(false);
        continue;
      }
      if (v === '--prettyprint') {
        config.setPrettyprint(true);
        continue;
      }
      if (v === '--noprettyprint') {
        config.setPrettyprint(false);
        continue;
      }
      if (v === '--label') {
        config.setLabel(true);
        continue;
      }
      if (v === '--nolabel') {
        config.setLabel(false);
        continue;
      }
      if (v === '--format') {
        config.setFormat(true);
        continue;
      }
      if (v === '--noformat') {
        config.setFormat(false);
        continue;
      }
      if (v === '--timer') {
        config.setTimer(true);
        continue;
      }
      if (v === '--notimer') {
        config.setTimer(false);
        continue;
      }
      console.log('Unknown argument: ' + v);
      process.exit(1);  // eslint-disable-line no-process-exit
    }
    if (input === null) {
      input = v;
      continue;
    } else {
      input += ' ' + v;
    }
  }
})(process.argv);

if (input === null) {
  interactive.interactive();
} else {
  answer.answerAsync(input, {
    language: config.language(),
    tokens: config.tokens(),
    delabel: config.delabel(),
    ast: config.ast(),
    evaluate: config.evaluate(),
    raw: config.raw(),
    normal: config.normal(),
    canonical: config.canonical(),
    prettyprint: config.prettyprint(),
    label: config.label(),
    format: config.format(),
    timer: config.timer()
  });
}
