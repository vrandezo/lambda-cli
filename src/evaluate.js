'use strict';

const utils = require('./utils.js');
const http = require('http');

const evalurl = 'http://localhost:8080/w/api.php?action=wikilambda_function_call&format=json&wikilambda_function_call_zobject=';

const evaluate_async = async (zobject) => {
  if (zobject.Z1K1 === 'Z5') { return zobject; }
  return new Promise((resolve, reject) => {
    const call = { Z1K1: "Z7", Z7K1: "Z801", Z801K1: zobject };
    const url = new URL(evalurl + JSON.stringify(call));
    const req = http.request(url, {
      headers: { 'User-Agent': 'lambda-cli/0.1' }
    }, (res) => {
      res.setEncoding('utf8');
      let body = '';

      res.on('data', (chunk) => {
        body += chunk;
      });

      res.on('end', () => {
        // TODO: what if not success
        resolve(JSON.parse(
          JSON.parse(body).query.wikilambda_function_call.Orchestrated.data
        ).Z22K1);
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
