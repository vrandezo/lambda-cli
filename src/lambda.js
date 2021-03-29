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

console.log(version);
const cli = repl.start({
  prompt: '> ',
  eval: evaluate,
  writer: write
});

//delete cli.commands.break;
//delete cli.commands.clear;
//delete cli.commands.editor;
//delete cli.commands.load;
//delete cli.commands.save;

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
