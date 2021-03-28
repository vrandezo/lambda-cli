const repl = require('repl');
const https = require('https');
const util = require('util');

const wellformed = require('./wellformed.js');

const version = 'lambda v0.1';

const answer = (command, context, file, callback) => {
  const path = '/wiki/ZObject:' + command.trim() + '?action=raw';
  https.get({
    hostname: 'notwikilambda.toolforge.org',
    path: path,
    headers: { 'User-Agent': 'lambda-cli/0.1' }
  }, res => {
    if (res.statusCode == 200) {
      var body = '';
      res.on('data', chunk => {
        body += chunk;
      });
      res.on('end', () => {
        try {
          const zobject = JSON.parse(body);
          const check = wellformed.wellformed( zobject );
          const result = check.length === 0 ? zobject : check;
          callback(null, result);
        } catch(e) {
          console.log('Error');
          console.log(e);
          console.log(body);
          cli.displayPrompt();
        }
      });
    } else {
      console.log('Error');
      console.log(`HTTP ${res.statusCode}`);
      cli.displayPrompt();
    }
  });
}

const write = (input) => {
  return util.inspect(input, false, Infinity, true);
}

console.log(version);
const cli = repl.start({
  prompt: '> ',
  eval: answer,
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
