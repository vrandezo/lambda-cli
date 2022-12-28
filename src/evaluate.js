'use strict';

const config = require('./config.js');
const http = require('http');
const https = require('https');

const evaluateAsync = async (zobject) => {
  const evalpath = '/w/api.php?' +
    'action=wikilambda_function_call&' +
    'format=json&wikilambda_function_call_zobject=';
  if (zobject.Z1K1 === 'Z5') {
    return zobject;
  }
  return new Promise((resolve, reject) => {
    const call = { Z1K1: 'Z7', Z7K1: 'Z801', Z801K1: zobject };
    const url = new URL(config.wiki() + evalpath + JSON.stringify(call));
    const protocol = (url.protocol === 'https:') ? https : http;
    const req = protocol.request(url, {
      headers: { 'User-Agent': 'lambda-cli/0.1' }
    }, (res) => {
      res.setEncoding('utf8');
      let body = '';

      res.on('data', (chunk) => {
        body += chunk;
      });

      res.on('end', () => {
        // TODO: what if not success
        const obj = JSON.parse(body)
        if ('query' in obj) {
          resolve(JSON.parse(obj.query.wikilambda_function_call.data));
        } else {
          reject({
            Z1K1: 'Z5',
            Z5K1: 'API error',
            Z5K2: obj
          });
        }
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
};

exports.evaluateAsync = evaluateAsync;
