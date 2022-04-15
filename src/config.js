'use strict';

const utils = require('./utils.js');
const packagedata = require('./../package.json');

const v = 'lambda v' + packagedata.version;

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
  settings.tokens = false;
  if ('tokens' in settings) {
    config.tokens = settings.tokens;
  }
  config.delabel = false;
  if ('delabel' in settings) {
    config.delabel = settings.delabel;
  }
  config.ast = false;
  if ('ast' in settings) {
    config.ast = settings.ast;
  }
  config.meta = false;
  if ('meta' in settings) {
    config.meta = settings.meta;
  }
  config.evaluate = true;
  if ('evaluate' in settings) {
    config.evaluate = settings.evaluate;
  }
  config.raw = false;
  if ('raw' in settings) {
    config.raw = settings.raw;
  }
  config.canonical = false;
  if ('canonical' in settings) {
    config.canonical = settings.canonical;
  }
  config.normal = false;
  if ('normal' in settings) {
    config.normal = settings.normal;
  }
  config.prettyprint = false;
  if ('prettyprint' in settings) {
    config.prettyprint = settings.prettyprint;
  }
  config.label = false;
  if ('label' in settings) {
    config.label = settings.label;
  }
  config.format = true;
  if ('format' in settings) {
    config.format = settings.format;
  }
  config.timer = false;
  if ('timer' in settings) {
    config.timer = settings.timer;
  }
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

const tokens = () => {
  ensureLoaded();
  return config.tokens;
};

const setTokens = (b) => {
  ensureLoaded();
  config.tokens = b;
};

const delabel = () => {
  ensureLoaded();
  return config.delabel;
};

const setDelabel = (b) => {
  ensureLoaded();
  config.delabel = b;
};

const ast = () => {
  ensureLoaded();
  return config.ast;
};

const setAst = (b) => {
  ensureLoaded();
  config.ast = b;
};

const meta = () => {
  ensureLoaded();
  return config.meta;
};

const setMeta = (b) => {
  ensureLoaded();
  config.meta = b;
};

const evaluate = () => {
  ensureLoaded();
  return config.evaluate;
};

const setEvaluate = (b) => {
  ensureLoaded();
  config.evaluate = b;
};

const raw = () => {
  ensureLoaded();
  return config.raw;
};

const setRaw = (b) => {
  ensureLoaded();
  config.raw = b;
};

const normal = () => {
  ensureLoaded();
  return config.normal;
};

const setNormal = (b) => {
  ensureLoaded();
  config.normal = b;
};

const canonical = () => {
  ensureLoaded();
  return config.canonical;
};

const setCanonical = (b) => {
  ensureLoaded();
  config.canonical = b;
};

const prettyprint = () => {
  ensureLoaded();
  return config.prettyprint;
};

const setPrettyprint = (b) => {
  ensureLoaded();
  config.prettyprint = b;
};

const format = () => {
  ensureLoaded();
  return config.format;
};

const setFormat = (b) => {
  ensureLoaded();
  config.format = b;
};

const label = () => {
  ensureLoaded();
  return config.label;
};

const setLabel = (b) => {
  ensureLoaded();
  config.label = b;
};

const timer = () => {
  ensureLoaded();
  return config.timer;
};

const setTimer = (b) => {
  ensureLoaded();
  config.timer = b;
};

exports.load = load;
exports.reset = reset;
exports.language = language;
exports.setLanguage = setLanguage;
exports.cache = cache;
exports.setCache = setCache;
exports.isLocal = isLocal;
exports.wiki = wiki;
exports.setWiki = setWiki;
exports.tokens = tokens;
exports.setTokens = setTokens;
exports.delabel = delabel;
exports.setDelabel = setDelabel;
exports.ast = ast;
exports.setAst = setAst;
exports.meta = meta;
exports.setMeta = setMeta;
exports.evaluate = evaluate;
exports.setEvaluate = setEvaluate;
exports.raw = raw;
exports.setRaw = setRaw;
exports.normal = normal;
exports.setNormal = setNormal;
exports.canonical = canonical;
exports.setCanonical = setCanonical;
exports.prettyprint = prettyprint;
exports.setPrettyprint = setPrettyprint;
exports.label = label;
exports.setLabel = setLabel;
exports.format = format;
exports.setFormat = setFormat;
exports.timer = timer;
exports.setTimer = setTimer;
exports.version = version;
