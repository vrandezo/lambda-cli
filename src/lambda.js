#!/usr/bin/env node
'use strict';

const repl = require('repl');
const util = require('util');

const answer = require('./answer.js');
const config = require('./config.js');

const version = 'lambda v0.1';

const evaluate = (command, context, file, callback) => {
  answer.answer(command, (result) => { callback(null, result); });
}

const write = (input) => {
  return util.inspect(input, false, Infinity, true);
}

config.load('./config.json');

const settings = ((argv) => {
  let i = 1;

  let command = null;
  let data = null;

  while (++i < argv.length) {
    const v = argv[i];
    if (v[0] === "-") {
      if (v === "--language") {
        const lang = argv[i+1];  // TODO do something in case of error
        i++;
        config.set_language(lang);
        continue;
      }
    }
    console.log(argv[i]);
  }
})(process.argv);

console.log(version);
const cli = repl.start({
  prompt: '> ',
  eval: evaluate,
  writer: write
});

cli.defineCommand(
  'version', {
    help: 'Version number of the lambda CLI',
    action() {
      this.clearBufferedCommand();
      console.log(version);
      this.displayPrompt();
    }
  }
);

cli.defineCommand(
  'language', {
    help: 'Language to use',
    action(lang) {
      this.clearBufferedCommand();
      if (lang !== '') {
        config.set_language(lang);
      }
      console.log(config.language());

      this.displayPrompt();
    }
  }
);
