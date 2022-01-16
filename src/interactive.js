'use strict';

const repl = require('repl');

const c = require('./constants.js').constants;
const canonicalize = require('./canonicalize.js');
const config = require('./config.js');
const delabel = require('./delabel.js');
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

// const getZ22K1 = (zobject) => {
//  if ((zobject.Z1K1 === 'Z22') || (zobject.Z1K1.Z9K1 === 'Z22')) {
//    return zobject.Z22K1;
//  } else {
//    return zobject;
//  }
// };

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

const writeTokens = (tokens) => {
  let result = '';
  tokens.forEach((token, i) => {
    result += token[c.TokenType];
    if (token[c.TokenValue] !== undefined) {
      result += '(' + token[c.TokenValue] + ')';
    }
    result += ' ';
  });
  return result;
}

const answer = async (command, callback) => {
  const data = command.trim();
  const first = data[0];
  if (first === '[' || first === '{' || first === '"') {
    evaluate.evaluateAsync(JSON.parse(data)).then(callback);
  } else if (utils.isZid(data)) {
    load.load(data).then(getZ2K2).then(callback);
  } else if (data === '_') {
    callback(last);
  } else {
    if (config.tokens()) {
      console.log('\x1b[2m' + writeTokens(parse.tokenize(data)) + '\x1b[0m');
    }
    const call = await parse.parseAsync(data);
    if (config.ast()) {
      console.log('\x1b[2m' + writeNoRemember(call) + '\x1b[0m');
    }
    const result = await evaluate.evaluateAsync(call);
    // const labelized = await labelize.labelize(result);
    callback(result);
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
    process.exit(0);  // eslint-disable-line no-process-exit
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

  cli.defineCommand(
    'label', {
      help: 'if a ZID, returns the label, else returns the ZIDs',
      async action(input) {
        this.clearBufferedCommand();
        if (input === '') {
          input = c.Nothing;
        }
        if (utils.isZid(input)) {
          const results = await load.load(input);
          if (results[c.ObjectType] === c.Error) {
            console.log(results[c.ErrorType]);
          } else {
            console.log(utils.getLabel(
              results[c.PersistentobjectLabels], config.language()
            ));
          }
        } else {
          const results = await delabel.delabel(input);
          if (results.length === 0) {
            console.log(' Nothing found');
          } else {
            results.forEach((result, i) => {
              console.log(result[c.Key1]);
            });
          }
        }
        this.displayPrompt();
      }
    }
  );

  cli.defineCommand(
    'tokens', {
      help: 'use on and off to show tokenization; any other input gets tokenized',
      async action(input) {
        this.clearBufferedCommand();
        if (input === '') {
          if (config.tokens()) {
            console.log('on');
          } else {
            console.log('off');
          }
        } else {
          if (input === 'on') {
            config.setTokens(true);
          } else if (input === 'off') {
            config.setTokens(false);
          } else {
            console.log(writeTokens(parse.tokenize(input)));
          }
        }
        this.displayPrompt();
      }
    }
  );

  cli.defineCommand(
    'ast', {
      help: 'use on and off to show the parse result; other input gets parsed',
      async action(input) {
        this.clearBufferedCommand();
        if (input === '') {
          if (config.ast()) {
            console.log('on');
          } else {
            console.log('off');
          }
        } else {
          if (input === 'on') {
            config.setAst(true);
          } else if (input === 'off') {
            config.setAst(false);
          } else {
            console.log(write(await parse.parseAsync(input)));
          }
        }
        this.displayPrompt();
      }
    }
  );
};

exports.interactive = interactive;
