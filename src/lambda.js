#!/usr/bin/env node
'use strict';

const repl = require('repl');
const util = require('util');

const answer = require('./answer.js');
const config = require('./config.js');
const labelize = require('./labelize.js');
const load = require('./load.js');

const version = 'lambda v0.1';

const evaluate = (command, context, file, callback) => {
  answer.answer(command, (result) => { callback(null, result); });
}

const write = (input) => {
  return util.inspect(input, false, Infinity, true);
}

try {
  config.load('./config.json');
} catch (err) {
  config.load('./config.default.json');
}

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
      if (v === "--data") {
        const data = argv[i+1];  // TODO do something in case of error
        i++;
        config.set_data(data);
        continue;
      }
      if (v === "--cache") {
        const data = argv[i+1];  // TODO do something in case of error
        i++;
        config.set_cache(data);
        continue;
      }
      console.log("Unknown argument: " + v);
      process.exit(1);
    }
    if (command === null) {
      if (v === "labelize" || v === "l") {
        command = "labelize";
        continue;
      }
      console.log("Unknown command: " + v);
      process.exit(1);
    }
    if (data === null) {
      data = v;
      continue;
    }
    console.log("Unknown parameter: " + argv[i]);
    process.exit(1);
  }
})(process.argv);

if (command !== null) {
  if (data === null) {
    console.log("No input given.");
    process.exit(1);
  }
  if (command === "labelize") {
    if ('{"['.includes(data[0])) {
      labelize.labelize(JSON.parse(data)).then(write).then(console.log);
    } else {
      load.load(data).then(labelize.labelize).then(write).then(console.log);
    }
  }
}

if (command === null) {
  console.log(version);
  const cli = repl.start({
    prompt: '> ',
    eval: evaluate,
    writer: write
  });

  cli.on('exit', () => {
    load.save_cache(config.cache());
    console.log('Have a mindful day.');
    process.exit();
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

  cli.defineCommand(
    'data', {
      help: 'Local directory or web URL to get data from',
      action(data) {
        this.clearBufferedCommand();
        if (data !== '') {
          config.set_data(data);
        }
        console.log(config.data());

        this.displayPrompt();
      }
    }
  );

  cli.defineCommand(
    'cache', {
      help: 'path to the cache',
      action(cache) {
        this.clearBufferedCommand();
        if (cache !== '') {
          config.set_cache(cache);
        }
        console.log(config.cache());

        this.displayPrompt();
      }
    }
  );

  cli.defineCommand(
    'reload', {
      help: 'deletes a ZID or the whole local cache, if no argument',
      action(zid) {
        this.clearBufferedCommand();
        if (zid !== '') {
          load.reset(zid);
        } else {
          load.reset_all();
        }
        this.displayPrompt();
      }
    }
  );
}
