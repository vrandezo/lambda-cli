'use strict';

const repl = require('repl');

const canonicalize = require('./canonicalize.js');
const config = require('./config.js');
const evaluate = require('./evaluate.js');
const labelize = require('./labelize.js');
const load = require('./load.js');
const normalize = require('./normalize.js');
const parse = require('./parse.js');
const utils = require('./utils.js');

let last = null;

const getZ2K2 = (zobject) => {
  return zobject.Z2K2;
};

const getZ22K1 = (zobject) => {
  if ((zobject.Z1K1 === 'Z22') || (zobject.Z1K1.Z9K1 === 'Z22')) {
    return zobject.Z22K1;
  } else {
    return zobject;
  }
};

const write = (input) => {
  if (input === null) {
    return '';
  }
  last = input;
  return JSON.stringify(input, null, 2);
};

const writeNoRemember = (input) => {
  if (input === null) {
    return '';
  }
  return JSON.stringify(input, null, 2);
};

const answer = (command, callback) => {
  const data = command.trim();
  const first = data[0];
  if (first === '[' || first === '{' || first === '"') {
    evaluate.evaluateAsync(JSON.parse(data)).then(callback);
  } else if (utils.isZid(data)) {
    load.load(data).then(getZ2K2).then(callback);
  } else if (data === '_') {
    callback(last);
  } else {
    parse.parseAsync(
      data
    ).then(
      evaluate.evaluateAsync
//    ).then(
//      labelize.labelize
    ).then(
      callback
    );
  }
};

const evalinput = (command, context, file, callback) => {
  answer(command, (result) => {
    callback(null, result);
  });
};

const interactive = () => {
  console.log(config.version());
  const cli = repl.start({
    prompt: 'λ→ ',
    eval: evalinput,
    writer: write
  });

  cli.setupHistory('./.history', () => null);

  cli.on('exit', () => {
    load.saveCache(config.cache());
    console.log('Have a mindful day.');
    process.exit(0);
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
          config.setLanguage(lang);
        }
        console.log(config.language());

        this.displayPrompt();
      }
    }
  );

  cli.defineCommand(
    'wiki', {
      help: 'URL of the wiki to talk to, or local directory with ZObject files',
      action(wiki) {
        this.clearBufferedCommand();
        if (wiki !== '') {
          config.setWiki(wiki);
        }
        console.log(config.wiki());

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
          config.setCache(cache);
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
          load.resetAll();
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
            console.log(writeNoRemember(canonicalize.canonicalize(x)));
            this.displayPrompt();
          });
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
            console.log(writeNoRemember(normalize.normalize(x)));
            this.displayPrompt();
          });
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
          answer(input, async (x) => {
            console.log(writeNoRemember(await labelize.labelize(x, false)));
            this.displayPrompt();
          });
        } else {
          console.log(writeNoRemember(await labelize.labelize(last, false)));
          this.displayPrompt();
        }
      }
    }
  );
};

exports.interactive = interactive;
