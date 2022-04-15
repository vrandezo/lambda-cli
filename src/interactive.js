'use strict';

const repl = require('repl');

const c = require('./constants.js').constants;
const answer = require('./answer.js');
const config = require('./config.js');
const delabel = require('./delabel.js');
const format = require('./format.js');
const labelize = require('./labelize.js');
const load = require('./load.js');
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
  lastcall = await answer.answerAsync(command, { last: lastcall });
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
      help: 'displays the tokens from the input',
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
    'delabel', {
      help: 'displays the delabeled tokens from the input',
      async action(input) {
        this.clearBufferedCommand();
        if (input === 'on') {
          config.setDelabel(true);
        } else if (input === 'off') {
          config.setDelabel(false);
        } else {
          let command = lastcommand;
          if (input !== '') {
            command = input;
          }
          console.log(format.formatTokens(
            await parse.delabelAsync(parse.tokenize(command))
          ));
        }
        this.displayPrompt();
      }
    }
  );

  cli.defineCommand(
    'ast', {
      help: 'displays the parse tree from the input',
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
    'meta', {
      help: 'shows the metadata in the result, or just the value',
      async action(input) {
        this.clearBufferedCommand();
        if (input === 'on') {
          config.setMeta(true);
        } else if (input === 'off') {
          config.setMeta(false);
        } else {
          let command = lastcommand;
          if (input !== '') {
            command = input;
          }
          await answer.answerAsync(input, {
            last: lastcall,
            meta: true
          });
        }
        this.displayPrompt();
      }
    }
  );

  cli.defineCommand(
    'evaluate', {
      help: 'switches evaluation on or off',
      async action(input) {
        this.clearBufferedCommand();
        if (input === 'on') {
          config.setEvaluate(true);
        } else if (input === 'off') {
          config.setEvaluate(false);
        } else if (input === '') {
          if (config.evaluate()) {
            console.log('on');
          } else {
            console.log('off');
          }
        } else {
          await answer.answerAsync(input, {
            last: lastcall,
            evaluate: true
          });
        }
        this.displayPrompt();
      }
    }
  );

  cli.defineCommand(
    'raw', {
      help: 'displays the raw answer from the evaluation',
      async action(input) {
        this.clearBufferedCommand();
        if (input === 'on') {
          config.setRaw(true);
        } else if (input === 'off') {
          config.setRaw(false);
        } else {
          console.log(await answer.answerAsync(lastcall, {
            last: lastcall,
            tokens: false,
            delabel: false,
            ast: false,
            raw: true,
            normal: false,
            canonical: false,
            prettyprint: false,
            label: false,
            format: false,
            focus: 'raw'
          }));
        }
        this.displayPrompt();
      }
    }
  );

  cli.defineCommand(
    'normalize', {
      help: 'displays the normal version of a ZObject',
      async action(input) {
        this.clearBufferedCommand();
        if (input === 'on') {
          config.setNormal(true);
        } else if (input === 'off') {
          config.setNormal(false);
        } else {
          let call = lastcall;
          if (input !== '') {
            call = input;
          }
          console.log(await answer.answerAsync(call, {
            last: lastcall,
            tokens: false,
            delabel: false,
            ast: false,
            raw: false,
            normal: true,
            canonical: false,
            prettyprint: false,
            label: false,
            format: false,
            focus: 'normal'
          }));
        }
        this.displayPrompt();
      }
    }
  );

  cli.defineCommand(
    'canonicalize', {
      help: 'displays the canonical version of a ZObject',
      async action(input) {
        this.clearBufferedCommand();
        if (input === 'on') {
          config.setCanonical(true);
        } else if (input === 'off') {
          config.setCanonical(false);
        } else {
          let call = lastcall;
          if (input !== '') {
            call = input;
          }
          console.log(await answer.answerAsync(call, {
            last: lastcall,
            tokens: false,
            delabel: false,
            ast: false,
            raw: false,
            normal: false,
            canonical: true,
            prettyprint: false,
            label: false,
            format: false,
            focus: 'canonical'
          }));
        }
        this.displayPrompt();
      }
    }
  );

  cli.defineCommand(
    'prettyprint', {
      help: 'displays the version formatted for the JSON files',
      async action(input) {
        this.clearBufferedCommand();
        if (input === 'on') {
          config.setPrettyprint(true);
        } else if (input === 'off') {
          config.setPrettyprint(false);
        } else {
          let call = lastcall;
          if (input !== '') {
            call = input;
          }
          console.log(await answer.answerAsync(call, {
            last: lastcall,
            tokens: false,
            delabel: false,
            ast: false,
            raw: false,
            prettyprint: true,
            label: false,
            format: false,
            focus: 'prettyprint'
          }));
        }
        this.displayPrompt();
      }
    }
  );

  cli.defineCommand(
    'labelize', {
      help: 'displays a version of the ZObject with ZIDs replaced with labels',
      async action(input) {
        this.clearBufferedCommand();
        if (input === 'on') {
          config.setLabel(true);
        } else if (input === 'off') {
          config.setLabel(false);
        } else {
          let call = lastcall;
          if (input !== '') {
            call = input;
          }
          console.log(await answer.answerAsync(call, {
            last: lastcall,
            tokens: false,
            delabel: false,
            ast: false,
            raw: false,
            prettyprint: false,
            label: true,
            format: false,
            focus: 'label'
          }));
        }
        this.displayPrompt();
      }
    }
  );

  cli.defineCommand(
    'format', {
      help: 'displays the formatted version for easier readability',
      async action(input) {
        this.clearBufferedCommand();
        if (input === 'on') {
          config.setFormat(true);
        } else if (input === 'off') {
          config.setFormat(false);
        } else {
          let call = lastcall;
          if (input !== '') {
            call = input;
          }
          console.log(await answer.answerAsync(call, {
            last: lastcall,
            tokens: false,
            delabel: false,
            ast: false,
            raw: false,
            prettyprint: false,
            label: false,
            format: true,
            focus: 'format'
          }));
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
