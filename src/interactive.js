'use strict';

const https = require('https');
const repl = require('repl');
const util = require('util');

const canonicalize = require('./canonicalize.js');
const config = require('./config.js');
const evaluate = require('./evaluate.js');
const labelize = require('./labelize.js');
const load = require('./load.js');
const normalize = require('./normalize.js');
const parse = require('./parse.js');
const utils = require('./utils.js');

let last = null;

const help = () => {
  console.log("Help.");
}

const evalinput = (command, context, file, callback) => {
  answer(command, (result) => { callback(null, result); });
}

const getZ2K2 = (zobject) => {
  return zobject.Z2K2;
}

const write = (input) => {
  if (input === null) { return ''; }
  last = input;
  return util.inspect(input, false, Infinity, true);
}

const write_no_remember = (input) => {
  if (input === null) { return ''; }
  return util.inspect(input, false, Infinity, true);
}

const answer = (command, callback) => {
  const data = command.trim();
  const first = data[0];
  if (first === '[' || first === '{' || first === '"') {
    evaluate.evaluate_async(JSON.parse(data)).then(callback);
  } else if (utils.is_zid(data)) {
    load.load(data).then(getZ2K2).then(callback);
  } else if (data === '_') {
    callback(last);
  } else {
    parse.parse_async(
      data
    ).then(
      evaluate.evaluate_async
    ).then(
      canonicalize.canonicalize_async
//    ).then(
//      labelize.labelize
    ).then(
      callback
    );
  }
}

const interactive = () => {
  console.log(config.version());
  const cli = repl.start({
    prompt: '> ',
    eval: evalinput,
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

  cli.defineCommand(
    'canonicalize', {
      help: 'returns the canonical version of a ZObject',
      action(input) {
        this.clearBufferedCommand();
        if (input !== '') {
          answer(input, (x) => {
            console.log(write_no_remember(canonicalize.canonicalize(x)));
            this.displayPrompt();
          })
        } else {
          console.log(write(canonicalize.canonicalize(last)));
          this.displayPrompt();
        }
      }
    }
  );

  cli.defineCommand(
    'normalize', {
      help: 'returns the normal version of a ZObject',
      action(input) {
        this.clearBufferedCommand();
        if (input !== '') {
          answer(input, (x) => {
            console.log(write_no_remember(normalize.normalize(x)));
            this.displayPrompt();
          })
        } else {
          console.log(write(normalize.normalize(last)));
          this.displayPrompt();
        }
      }
    }
  );

  cli.defineCommand(
    'labelize', {
      help: 'prints a version of the ZObject with ZIDs replaced with labels',
      async action(input) {
        this.clearBufferedCommand();
        if (input !== '') {
          answer(input, (x) => {
            console.log(write_no_remember(normalize.normalize(x)));
            this.displayPrompt();
          })
        } else {
          console.log(write_no_remember(await labelize.labelize(last, false)));
          this.displayPrompt();
        }
      }
    }
  )
}

exports.interactive = interactive;
