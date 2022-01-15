'use strict';

const config = require('../src/config.js');
const c = require('../src/constants.js').constants;

QUnit.module('config');

QUnit.test('there is a version', (assert) => {
  assert.strictEqual(config.version().slice(0, 6), 'lambda');
});

QUnit.test('there is a language', (assert) => {
  config.reset();
  assert.strictEqual(config.language().slice(0, 2), 'Z1');
});

QUnit.test('language resets', (assert) => {
  config.setLanguage('Z2000');
  config.reset();
  assert.strictEqual(config.language().slice(0, 2), 'Z1');
});

QUnit.test('there is a cache', (assert) => {
  config.reset();
  assert.strictEqual(typeof config.cache(), 'string');
});

QUnit.test('there is a wiki', (assert) => {
  config.reset();
  assert.strictEqual(typeof config.wiki(), 'string');
});

QUnit.test('set language retains', (assert) => {
  config.setLanguage(c.Arabic);
  assert.strictEqual(config.language(), c.Arabic);
  config.reset();
});

QUnit.test('load settings and choose language', (assert) => {
  config.load({
    language: {
      en: c.English,
      hr: c.Croatian
    },
    cache: './cache/',
    wiki: {
      wf: 'https://wikifunctions.org',
      beta: 'https://wikifunctions.beta.wmflabs.org',
      local: './data/'
    }
  });
  config.setLanguage('hr');
  assert.strictEqual(config.language(), c.Croatian);
  config.reset();
});

QUnit.test('load settings and get first language', (assert) => {
  config.load({
    language: {
      en: c.English,
      hr: c.Croatian
    },
    cache: './cache/',
    wiki: {
      wf: 'https://wikifunctions.org',
      beta: 'https://wikifunctions.beta.wmflabs.org',
      local: './data/'
    }
  });
  assert.strictEqual(config.language(), c.English);
  config.reset();
});

QUnit.test('load settings and get first wiki', (assert) => {
  config.load({
    language: {
      en: c.English,
      hr: c.Croatian
    },
    cache: './cache/',
    wiki: {
      wf: 'https://wikifunctions.org',
      beta: 'https://wikifunctions.beta.wmflabs.org',
      local: './data/'
    }
  });
  assert.strictEqual(config.wiki(), 'https://wikifunctions.org');
  config.reset();
});

QUnit.test('load settings and choose wiki', (assert) => {
  config.load({
    language: {
      en: c.English,
      hr: c.Croatian
    },
    cache: './cache/',
    wiki: {
      wf: 'https://wikifunctions.org',
      beta: 'https://wikifunctions.beta.wmflabs.org',
      local: './data/'
    }
  });
  config.setWiki('beta');
  assert.strictEqual(config.wiki(), 'https://wikifunctions.beta.wmflabs.org');
  config.reset();
});

QUnit.test('load settings and it is not local', (assert) => {
  config.load({
    language: {
      en: c.English,
      hr: c.Croatian
    },
    cache: './cache/',
    wiki: {
      wf: 'https://wikifunctions.org',
      beta: 'https://wikifunctions.beta.wmflabs.org',
      local: './data/'
    }
  });
  assert.false(config.isLocal());
  config.reset();
});

QUnit.test('load settings and choose local', (assert) => {
  config.load({
    language: {
      en: c.English,
      hr: c.Croatian
    },
    cache: './cache/',
    wiki: {
      wf: 'https://wikifunctions.org',
      beta: 'https://wikifunctions.beta.wmflabs.org',
      local: './data/'
    }
  });
  config.setWiki('local');
  assert.true(config.isLocal());
  config.reset();
});
