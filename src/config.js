"use strict";

const fs = require('fs');
const utils = require('./utils.js')

const v = 'lambda v0.1';

const version = () => {
  return v;
}

let config = {};
let loaded = false;

const load = (path) => {
  config = JSON.parse(fs.readFileSync(path));
  if (utils.is_string(config.data)) {
    config.data_actually = config.data;
    config.data = {};
    config.data.default = config.data_actually;
  } else {
    config.data_actually = config.data[Object.keys(config.data)[0]];
  }
}

const language = () => {
  return config.language;
}

const set_language = (lang) => {
  config.language = lang;  // TODO check if this is a language
}

const cache = () => {
  return config.cache;
}

const set_cache = (path) => {
  config.cache = path;
}

const is_local = () => {
  return (config.data_actually.slice(0, 6) !== 'https:');
}

const data = () => {
  return config.data_actually;
}

const set_data = (data) => {
  if (Object.keys(config.data).includes(data)) {
    config.data_actually = config.data[data];
  } else {
    config.data_actually = data;
  }
}

const schemata_directory = () => {
  let schemata_dir = '';
  if (config.schemata[0] === "/") {
    schemata_dir = config.schemata;
  } else {
    schemata_dir = __dirname + "/../" + config.schemata;
  }
  if (!fs.existsSync(schemata_dir)) {
    console.log('function-schemata does not exist at the given place.');
    console.log('Please make sure function-schemata is installed and the');
    console.log('config points to the right place. Currently it points to');
    console.log(config.schemata_directory());
    process.exit(1);
  }
  return schemata_dir;
}

exports.load = load;
exports.language = language;
exports.set_language = set_language;
exports.cache = cache;
exports.set_cache = set_cache;
exports.is_local = is_local;
exports.data = data;
exports.set_data = set_data;
exports.version = version;
exports.schemata_directory = schemata_directory;
