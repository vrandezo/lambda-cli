'use strict';

const https = require('https');
const repl = require('repl');
const util = require('util');

const config = require('./config.js');
const load = require('./load.js');
const utils = require('./utils.js');

const help = () => {
  console.log("Help.");
}

const evaluate = (command, context, file, callback) => {
  answer(command, (result) => { callback(null, result); });
}

const getZ2K2 = (zobject) => {
  return zobject.Z2K2;
}

const write = (input) => {
  return util.inspect(input, false, Infinity, true);
}

const answer = (command, callback) => {
  const data = command.trim();
  const first = data[0];
  if (first === '[' || first === '{' || first === '"') {
    callback(JSON.parse(data));
  } else if (utils.is_zid(data)) {
    load.load(data).then(getZ2K2).then(callback);
  } else {
    console.log('Did not understand input.');
    callback(data);
  }
}

const interactive = () => {
  console.log(config.version());
  const cli = repl.start({
    prompt: '> ',
    eval: evaluate,
    writer: write
  });

  cli.setupHistory('./.history', () => null);

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
        console.log(config.version());
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

exports.interactive = interactive;
