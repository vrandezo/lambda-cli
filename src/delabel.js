'use strict';

const https = require('https');
const http = require('http');

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
        resolve(JSON.parse(body).query.wikilambdasearch_labels);
      });
    });

    req.on('error', (err) => {
      reject({
        Z1K1: 'Z5',
        Z5K1: 'HTTP error',
        Z5K2: err
      });
    });

    req.end();
  });
};

const delabel = async (label) => {
  const labelmap = await load.labelmap(config.language());
  const normal = utils.stringNormalize(label);

  if (!(normal in labelmap)) {
    const hits = await searchlabel(label);
    const results = [];
    for (const hit of hits) {
      if (utils.stringNormalize(label) !== utils.stringNormalize(hit.label)) {
        continue;
      }
      const result = {
        Z1K1: 'ZSearchResult',
        K1: hit.page_title,
        K2: hit.page_type,
        K3: [{
          Z1K1: 'Z11',
          Z11K1: config.language(),
          Z11K2: hit.label
        }]
      };
      results.push(result);
    }
    return results;
  }

  const hits = labelmap[normal];

  const results = [];
  for (const hit of hits) {
    const result = {
      Z1K1: 'ZSearchResult',
      K1: hit[0],
      K2: hit[1],
      K3: [{
        Z1K1: 'Z11',
        Z11K1: config.language(),
        Z11K2: hit[3]
      }]
    };
    results.push(result);
  }
  return results;
};

exports.delabel = delabel;
