"use strict";

const language = () => {
  return "en";
}

const cache = () => {
  return "./cache/";
}

const is_local = () => {
  return true;
  return false;
}

const data_host = () => {
  return "notwikilambda.toolforge.org";
}

const data_path = () => {
  return "./data/$1.json";
  return "/wiki/ZObject:$1?action=raw";
}

exports.language = language;
exports.cache = cache;
exports.is_local = is_local;
exports.data_host = data_host;
exports.data_path = data_path;
