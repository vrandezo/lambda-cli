'use strict';

const fs = require('fs');
const https = require('https');
const http = require('http');

const c = require('./constants.js').constants;
const config = require('./config.js');
const utils = require('./utils.js');

let cache = {};
let labelmap = {};

let cacheLoaded = null;
let labelmapLoaded = null;

const requestWeb = (zid) => {
  return new Promise((resolve, reject) => {
    const path = '/w/api.php?action=wikilambda_fetch&' +
      'format=json&zids=$1'.replace('$1', zid);
    const url = new URL(config.wiki() + path);
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
        resolve(JSON.parse(JSON.parse(body)[zid].wikilambda_fetch));
      });
    });

    req.on('error', (err) => {
      reject({
        [c.ObjectType]: c.Error,
        [c.ErrorType]: 'HTTP error',
        [c.ErrorValue]: err
      });
    });

    req.end();
  });
};

const requestLocal = (zid) => {
  return new Promise((resolve, reject) => {
    const path = config.wiki().replace('$1', zid);
    fs.readFile(path, (err, data) => {
      if (err) {
        resolve({
          [c.ObjectType]: c.Error,
          [c.ErrorType]: 'Could not load file',
          [c.ErrorValue]: path + ' ' + err
        });
      } else {
        resolve(JSON.parse(data));
      }
    });
  });
};

const loadJsonFromCache = (filename) => {
  return new Promise((resolve, reject) => {
    fs.readFile(config.cache() + filename + '.json', (err, data) => {
      cacheLoaded = config.cache();
      if (err) {
        resolve({});
      } else {
        resolve(JSON.parse(data));
      }
    });
  });
};

const loadCache = () => loadJsonFromCache('cache');

const saveCache = (path) => {
  fs.writeFileSync(path + 'cache.json', JSON.stringify(cache));
};

const load = async (zid) => {
  if (cacheLoaded !== config.cache()) {
    cache = await loadCache();
  }
  if (zid in cache) {
    return cache[zid];
  }
  if (config.isLocal()) {
    const zobject = await requestLocal(zid);
    cache[zid] = zobject;
    return zobject;
  } else {
    const zobject = await requestWeb(zid);
    cache[zid] = zobject;
    return zobject;
  }
};

const reset = (zid) => {
  if (zid in cache) {
    delete cache[zid];
  }
};

const createNewLabelmapLocal = async () => {
  const directory = config.wiki().slice(0, Math.max(0, config.wiki().lastIndexOf('/')));
  const files = await fs.promises.readdir(directory);
  const labelmap = { _: {
    language: config.language,
    source: directory,
    timestamp: (new Date()).toJSON()
  } };
  for (const f of files) {
    const zid = f.slice(0, Math.max(0, f.indexOf('.')));
    if (!utils.isZid(zid)) {
      continue;
    }
    const obj = await load(zid);
    let label = utils.getLabel(obj.Z2K3, config.language());
    label = (label === null) ? zid : label;
    const type = obj.Z2K2.Z1K1;
    const normal = utils.stringNormalize(label);
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
};

const getLabelmap = async (language) => {
  if (config.isLocal()) {
    if (labelmapLoaded === null) {
      labelmap = await loadJsonFromCache('labelmap.' + language);
      if (!('_' in labelmap)) {
        labelmap = await createNewLabelmapLocal();
      }
      labelmapLoaded = true;
    }
    return labelmap;
  } else {
    if (labelmapLoaded === null) {
      labelmap = await loadJsonFromCache('labelmap.' + language);
      if (!('_' in labelmap)) {
        labelmap = { _: {
          language: config.language,
          source: config.wiki(),
          timestamp: (new Date()).toJSON()
        } };
      }
      labelmapLoaded = true;
    }
    return labelmap;
  }
};

const resetAll = () => {
  cache = {};
};

exports.labelmap = getLabelmap;
exports.load = load;
exports.loadCache = loadCache;
exports.saveCache = saveCache;
exports.reset = reset;
exports.resetAll = resetAll;
