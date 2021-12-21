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
  if (utils.is_string(config.wiki)) {
    config.wiki_actually = config.wiki;
    config.wiki = {};
    config.wiki.default = config.wiki_actually;
  } else {
    config.wiki_actually = config.wiki[Object.keys(config.wiki)[0]];
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
  return (config.wiki_actually.slice(0, 6) !== 'https:') &&
    (config.wiki_actually.slice(0, 5) !== 'http:');
}

const wiki = () => {
  return config.wiki_actually;
}

const set_wiki = (wiki) => {
  if (Object.keys(config.wiki).includes(wiki)) {
    config.wiki_actually = config.wiki[wiki];
  } else {
    config.wiki_actually = wiki;
  }
}

exports.load = load;
exports.language = language;
exports.set_language = set_language;
exports.cache = cache;
exports.set_cache = set_cache;
exports.is_local = is_local;
exports.wiki = wiki;
exports.set_wiki = set_wiki;
exports.version = version;
