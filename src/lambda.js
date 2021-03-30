#!/usr/bin/env node
'use strict';

const repl = require('repl');
const util = require('util');

const answer = require('./answer.js');
const config = require('./config.js');
const labelize = require('./labelize.js');

const version = 'lambda v0.1';

const evaluate = (command, context, file, callback) => {
  answer.answer(command, (result) => { callback(null, result); });
}

const write = (input) => {
  return util.inspect(input, false, Infinity, true);
}

config.load('./config.json');

const help = () => {
  console.log("Help.");
}

let command = null;
let data = null;

const settings = ((argv) => {
  let i = 1;

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
    if (command === null) {
      if (v === "labelize" || v === "l") {
        command = "labelize";
        continue;
      }
      console.log("Unknown command: " + v);
    }
    if (data === null) {
      data = v;
      continue;
    }
    console.log("Unknown parameter: " + argv[i]);
  }
})(process.argv);

if (command !== null) {
  if (command === "labelize") {
    labelize.labelize(JSON.parse(data)).then(console.log)
  }
}

if (command === null) {
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
}
