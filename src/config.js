'use strict';

const utils = require('./utils.js');
const meta = require('./../package.json');

const v = 'lambda v' + meta.version;

const version = () => {
  return v;
};

let config = {
  loaded: false
};

const reset = () => {
  config = {
    loaded: false
  };
};

const load = (settings) => {
  reset();
  if (utils.isString(settings.language)) {
    config.language_actually = settings.language;
    config.language = {};
    config.language.default = config.language_actually;
  } else {
    config.language = settings.language;
    config.language_actually = settings.language[Object.keys(settings.language)[0]];
  }
  if (utils.isString(config.wiki)) {
    config.wiki_actually = settings.wiki;
    config.wiki = {};
    config.wiki.default = settings.wiki_actually;
  } else {
    config.wiki = settings.wiki;
    config.wiki_actually = settings.wiki[Object.keys(settings.wiki)[0]];
  }
  config.cache = settings.cache;
  config.loaded = true;
};

const loadLocal = () => {
  let localConfig = {};
  try {
    localConfig = require('./../config.json');
  } catch (err) {
    console.log('No config.json exists, using config.default.json instead.');
    localConfig = require('./../config.default.json');
  }
  load(localConfig);
};

const ensureLoaded = () => {
  if (!config.loaded) {
    loadLocal();
  }
};

const language = () => {
  ensureLoaded();
  return config.language_actually;
};

const setLanguage = (lang) => {
  ensureLoaded();
  // TODO: check if this is a language
  if (Object.keys(config.language).includes(lang)) {
    config.language_actually = config.language[lang];
  } else {
    config.language_actually = lang;
  }
};

const cache = () => {
  ensureLoaded();
  return config.cache;
};

const setCache = (path) => {
  ensureLoaded();
  config.cache = path;
};

const isLocal = () => {
  ensureLoaded();
  return (config.wiki_actually.slice(0, 6) !== 'https:') &&
    (config.wiki_actually.slice(0, 5) !== 'http:');
};

const wiki = () => {
  ensureLoaded();
  return config.wiki_actually;
};

const setWiki = (wiki) => {
  ensureLoaded();
  if (Object.keys(config.wiki).includes(wiki)) {
    config.wiki_actually = config.wiki[wiki];
  } else {
    config.wiki_actually = wiki;
  }
};

exports.load = load;
exports.language = language;
exports.setLanguage = setLanguage;
exports.cache = cache;
exports.setCache = setCache;
exports.isLocal = isLocal;
exports.wiki = wiki;
exports.setWiki = setWiki;
exports.version = version;
