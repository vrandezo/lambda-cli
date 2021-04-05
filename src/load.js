'use strict';

const fs = require('fs');
const https = require('https');
const util = require('util');

const config = require('./config.js');

let cache = {};

let cache_loaded = null;

const request_web = (zid) => {
  return new Promise((resolve, reject) => {
    const url = new URL(config.data().replace('$1', zid));
    const req = https.request({
      hostname: url.host,
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

const request_local = (zid) => {
  return new Promise((resolve, reject) => {
    const path = config.data().replace('$1', zid);
    fs.readFile(path, (err, data) => {
      if (err) {
        resolve({
          Z1K1: 'Z5',
          Z5K1: 'Could not load file',
          Z5K2: path,
          Z5K3: err
        });
      } else {
        resolve(JSON.parse(data));
      }
    })
  });
}

const load_cache = () => {
  return new Promise((resolve, reject) => {
    fs.readFile(config.cache() + 'cache.json', (err, data) => {
      cache_loaded = config.cache();
      if (err) {
        resolve({});
      } else {
        resolve(JSON.parse(data));
      }
    })
  });
}

const save_cache = (path) => {
  fs.writeFileSync(path + 'cache.json', JSON.stringify(cache));
}

const load = async (zid) => {
  if (cache_loaded !== config.cache()) {
    cache = await load_cache();
  }
  if (zid in cache) {
    return cache[zid];
  }
  if (config.is_local()) {
    const zobject = await request_local(zid);
    cache[zid] = zobject;
    return zobject;
  } else {
    const zobject = await request_web(zid);
    cache[zid] = zobject;
    return zobject;
  }
}

exports.load = load;
exports.load_cache = load_cache;
exports.save_cache = save_cache;
