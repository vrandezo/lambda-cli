const repl = require('repl');
const util = require('util');

const answer = require('./answer.js');
const wellformed = require('./wellformed.js');

const version = 'lambda v0.1';

const evaluate = (command, context, file, callback) => {
  answer.answer(command, (result) => { callback(null, result); });
}

const write = (input) => {
  return util.inspect(input, false, Infinity, true);
}

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

cli.defineCommand(
  'wellformed', {
    help: 'Tests a ZObject for wellformedness',
    action() {
      this.clearBufferedCommand();
      const result = wellformed.wellformed({});
      if (result.length == 0) {
        console.log('OK');
      } else {
        console.log(result);
      }
      this.displayPrompt();
    }
  }
);
