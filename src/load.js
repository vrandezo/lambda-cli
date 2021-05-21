'use strict';

const fs = require('fs');
const https = require('https');
const util = require('util');

const config = require('./config.js');
const utils = require('./utils.js');

let cache = {};
let labelmap = {};

let cache_loaded = null;
let labelmap_loaded = null;

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

const load_json_from_cache = (filename) => {
  return new Promise((resolve, reject) => {
    fs.readFile(config.cache() + filename + '.json', (err, data) => {
      cache_loaded = config.cache();
      if (err) {
        resolve({});
      } else {
        resolve(JSON.parse(data));
      }
    })
  });
}

const load_cache = () => load_json_from_cache('cache');

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

const reset = (zid) => {
  if (zid in cache) {
    delete cache[zid];
  }
}

const create_new_labelmap = async () => {
  // if local
  const directory = config.data().substring(0, config.data().lastIndexOf('/'));
  const files = await fs.promises.readdir( directory );
  let labelmap = { '_': {
    language: config.language,
    source: directory,
    timestamp: (new Date()).toJSON()
  }};
  for (let f of files) {
    const zid = f.substring(0, f.indexOf('.'));
    const obj = await load(zid);
    let label = utils.get_label(obj.Z2K3, config.language());
    label = (label === null) ? zid : label;
    const type = obj.Z2K2.Z1K1;
    const normal = utils.string_normalize(label);
    if (!(normal in labelmap)) {
      labelmap[normal] = [];
    }
    labelmap[normal].push([zid, type, label, label]);
  }
  fs.writeFileSync(
    config.cache() + 'labelmap.' + config.language() + '.json',
    JSON.stringify(labelmap)
  );
  return labelmap;
  // if website, download it (needs a labelmap api)
}

const get_labelmap = async (language) => {
  if (labelmap_loaded === null) {
    labelmap = await load_json_from_cache('labelmap.' + language);
    if (!('_' in labelmap)) {
      labelmap = await create_new_labelmap();
    }
    labelmap_loaded = true;
  }
  return labelmap;
}

const reset_all = () => {
  cache = {};
}

exports.labelmap = get_labelmap;

exports.load = load;
exports.load_cache = load_cache;
exports.save_cache = save_cache;
exports.reset = reset;
exports.reset_all = reset_all;
