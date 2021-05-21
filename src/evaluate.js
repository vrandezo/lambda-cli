'use strict';

const utils = require('./utils.js');
const https = require('http');

const evalurl = 'http://127.0.0.1:6254/local/v1/evaluate/$1';

const evaluate_async = async (zobject) => {
  if (zobject.Z1K1 === 'Z5') { return zobject; }
  return new Promise((resolve, reject) => {
    const url = new URL(evalurl.replace('$1', JSON.stringify(zobject)));
    const req = https.request({
      hostname: url.hostname,
      port: url.port,
      path: url.pathname + url.search,
      headers: { 'User-Agent': 'lambda-cli/0.1' }
    }, (res) => {
      res.setEncoding('utf8');
      let body = '';

      res.on('data', (chunk) => {
        body += chunk;
      });

      res.on('end', () => {
        resolve(JSON.parse(body));
      });
    });

    req.on('error', (err) => {
      reject({
        Z1K1: 'Z5',
        Z5K1: 'HTTP error',
        Z5K2: err
      });
    });

    req.end();
  });
}

exports.evaluate_async = evaluate_async;
