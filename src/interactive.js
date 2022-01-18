'use strict';

const repl = require('repl');

const c = require('./constants.js').constants;
const answer = require('./answer.js');
const canonicalize = require('./canonicalize.js');
const config = require('./config.js');
const delabel = require('./delabel.js');
const format = require('./format.js');
const labelize = require('./labelize.js');
const load = require('./load.js');
const normalize = require('./normalize.js');
const parse = require('./parse.js');
const utils = require('./utils.js');

let lastcall = null;
let lastcommand = null;

const write = (input) => {
  if (input === null) {
    return '';
  }
  return JSON.stringify(input, null, 2);
};

const evalinput = async (command, context, file, callback) => {
  lastcommand = command;
  lastcall = await answer.answerAsync(command, {
    last: lastcall,
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
  callback(null, lastcall);
};

const interactive = () => {
  console.log(config.version());
  const cli = repl.start({
    prompt: 'λ→ ',
    eval: evalinput,
    writer: (x) => ''
  });

  cli.setupHistory('./.history', () => null);

  cli.on('exit', () => {
    load.saveCache(config.cache());
    console.log('Have a mindful day.');
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
    'normalize', {
      help: 'returns the normal version of a ZObject',
      async action(input) {
        this.clearBufferedCommand();
        let call = lastcall;
        if (input !== '') {
          call = await answer.answerAsync(input, (x) => null, lastcall);
        }
        console.log(write(normalize.normalize(call)));
        this.displayPrompt();
      }
    }
  );

  cli.defineCommand(
    'canonicalize', {
      help: 'returns the canonical version of a ZObject',
      async action(input) {
        this.clearBufferedCommand();
        let call = lastcall;
        if (input !== '') {
          call = await answer.answerAsync(input, (x) => null, lastcall);
        }
        console.log(write(canonicalize.canonicalize(call)));
        this.displayPrompt();
      }
    }
  );

  cli.defineCommand(
    'labelize', {
      help: 'prints a version of the ZObject with ZIDs replaced with labels',
      async action(input) {
        this.clearBufferedCommand();
        let call = lastcall;
        if (input !== '') {
          call = await answer.answerAsync(input, (x) => null, lastcall);
        }
        console.log(write(await labelize.labelize(call)));
        this.displayPrompt();
      }
    }
  );

  cli.defineCommand(
    'label', {
      help: 'if a ZID, returns the label, else returns the ZIDs',
      async action(input) {
        this.clearBufferedCommand();
        if (input === '') {
          console.log(write(await labelize.labelize(lastcall)));
        } else {
          if (utils.isZid(input) || utils.isZkid(input)) {
            console.log(await labelize.labelizeId(input));
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
        }
        this.displayPrompt();
      }
    }
  );

  cli.defineCommand(
    'tokens', {
      help: 'use on and off to show tokenization; other input gets tokenized',
      action(input) {
        this.clearBufferedCommand();
        if (input === 'on') {
          config.setTokens(true);
        } else if (input === 'off') {
          config.setTokens(false);
        } else {
          let command = lastcommand;
          if (input !== '') {
            command = input;
          }
          console.log(format.formatTokens(parse.tokenize(command)));
        }
        this.displayPrompt();
      }
    }
  );

  cli.defineCommand(
    'ast', {
      help: 'use on and off to show the parse; other input gets parsed',
      async action(input) {
        this.clearBufferedCommand();
        if (input === 'on') {
          config.setAst(true);
        } else if (input === 'off') {
          config.setAst(false);
        } else {
          let command = lastcommand;
          if (input !== '') {
            command = input;
          }
          console.log(write(await parse.parseAsync(command)));
        }
        this.displayPrompt();
      }
    }
  );

  cli.defineCommand(
    'timer', {
      help: 'displays how much time passed after each command; set on or off',
      action(input) {
        this.clearBufferedCommand();
        if (input === '') {
          if (config.timer()) {
            console.log('on');
          } else {
            console.log('off');
          }
        } else {
          if (input === 'on') {
            config.setTimer(true);
          } else if (input === 'off') {
            config.setTimer(false);
          } else {
            console.log('unknown value, can only be on or off');
          }
        }
        this.displayPrompt();
      }
    }
  );
};

exports.interactive = interactive;
