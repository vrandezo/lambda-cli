'use strict';

const https = require('https');

const config = require('./config.js');

const cache = {};

const request = (zid) => {
  return new Promise((resolve, reject) => {
    const path = config.data_path().replace('$1', zid);
    const req = https.request({
      hostname: config.data_host(),
      path: path,
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

const load = async (zid) => {
  if (zid in cache) {
    return cache[zid];
  }
  const zobject = await request(zid);
  cache[zid] = zobject;
  return zobject;
}

exports.load = load;
