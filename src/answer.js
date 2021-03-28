const https = require('https');
const wellformed = require('./wellformed.js');

const answer = (command, callback) => {
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
          callback(result);
        } catch(e) {
          callback({
            Z1K1: 'Z5',
            Z5K1: e,
            Z5K2: body
          });
        }
      });
    } else {
      callback({
        Z1K1: 'Z5',
        Z5K1: 'HTTP error',
        Z5K2: res.statusCode
      });
    }
  });
}

exports.answer = answer;
