"use strict";

const fs = require('fs');

let config = {};

const load = (path) => {
  config = JSON.parse(fs.readFileSync(path));
  config.data_actually = config.data['notwikilambda'];  // TODO should be first
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

const is_local = () => {
  return (config.data_actually.slice(0, 6) !== 'https:');
}

const data = () => {
  return config.data_actually;
}

const set_data = (data) => {
  config.data_actually = data;
}

exports.load = load;
exports.language = language;
exports.set_language = set_language;
exports.cache = cache;
exports.is_local = is_local;
exports.data = data;
exports.set_data = set_data;
