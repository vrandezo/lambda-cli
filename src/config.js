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
  if (utils.is_string(config.language)) {
    config.language_actually = config.language;
    config.language = {};
    config.language.default = config.language_actually;
  } else {
    config.language_actually = config.language[Object.keys(config.language)[0]];
  }
  if (utils.is_string(config.data)) {
    config.data_actually = config.data;
    config.data = {};
    config.data.default = config.data_actually;
  } else {
    config.data_actually = config.data[Object.keys(config.data)[0]];
  }
}

const language = () => {
  return config.language_actually;
}

const set_language = (lang) => {
  // TODO check if this is a language
  if (Object.keys(config.language).includes(lang)) {
    config.language_actually = config.language[lang];
  } else {
    config.language_actually = lang;
  }
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

exports.load = load;
exports.language = language;
exports.set_language = set_language;
exports.cache = cache;
exports.set_cache = set_cache;
exports.is_local = is_local;
exports.data = data;
exports.set_data = set_data;
exports.version = version;
