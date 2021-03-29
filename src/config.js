"use strict";

const fs = require('fs');

let config = {};

const load = (path) => {
  config = JSON.parse(fs.readFileSync(path));
  config.data_index = 'notwikilambda';  // TODO should be the first
}

const language = () => {
  return config.language;
}

const cache = () => {
  return config.cache;
}

const is_local = () => {
  return (config.data[config.data_index].host === undefined);
}

const data_host = () => {
  return config.data[config.data_index].host;
}

const data_path = () => {
  return config.data[config.data_index].path;
}

exports.load = load;
exports.language = language;
exports.cache = cache;
exports.is_local = is_local;
exports.data_host = data_host;
exports.data_path = data_path;
