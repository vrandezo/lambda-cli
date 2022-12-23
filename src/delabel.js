'use strict';

const https = require('https');
const http = require('http');

const c = require('./constants.js').constants;
const config = require('./config.js');
const utils = require('./utils.js');
const load = require('./load.js');

const searchlabel = async (label) => {
  return new Promise((resolve, reject) => {
    const searchpath = '/w/api.php?action=query&format=json&' +
      'list=wikilambdasearch_labels&wikilambdasearch_language=en' +
      '&wikilambdasearch_limit=100&wikilambdasearch_search=';
    const url = new URL(config.wiki() + searchpath + label);
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
        // TODO: what if not success
        const answer = JSON.parse(body);
        if ('query' in answer) {
          resolve(answer.query.wikilambdasearch_labels);
        } else {
          resolve([]);
        }
      });
    });

    req.on('error', (err) => {
      resolve({
        [c.ObjectType]: c.Error,
        [c.ErrorType]: 'HTTP error',
        [c.ErrorValue]: err
      });
    });

    req.end();
  });
};

const delabel = async (label) => {
  const labelmap = await load.labelmap(config.language());
  const normal = utils.stringNormalize(label);

  if (!(normal in labelmap)) {
    const results = [ 'ZSearchResult' ];
    if (config.isLocal()) {
      return results;
    }
    const hits = await searchlabel(label);
    const zids = [];
    for (const hit of hits) {
      if (utils.stringNormalize(label) !== utils.stringNormalize(hit.label)) {
        continue;
      }
      if (zids.includes(hit.page_title)) continue;
      zids.push(hit.page_title);
      const result = {
        [c.ObjectType]: 'ZSearchResult',
        [c.Key1]: hit.page_title,
        [c.Key2]: hit.page_type,
        [c.Key3]: [
          c.Monolingualtext,
          {
            [c.ObjectType]: c.Monolingualtext,
            [c.MonolingualtextLanguage]: config.language(),
            [c.MonolingualtextText]: hit.label
          }
        ]
      };
      results.push(result);
    }
    return results;
  }

  const hits = labelmap[normal];

  const results = [ 'ZSearchResult' ];
  for (const hit of hits) {
    const result = {
      [c.ObjectType]: 'ZSearchResult',
      [c.Key1]: hit[0],
      [c.Key2]: hit[1],
      [c.Key3]: [
        c.Monolingualtext,
        {
          [c.ObjectType]: c.Monolingualtext,
          [c.MonolingualtextLanguage]: config.language(),
          [c.MonolingualtextText]: hit[3]
        }
      ]
    };
    results.push(result);
  }
  return results;
};

exports.delabel = delabel;
