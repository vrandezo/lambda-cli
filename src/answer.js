'use strict';

const https = require('https');

const labelize = require('./labelize.js');
const load = require('./load.js');
const utils = require('./utils.js');

const answer = (command, callback) => {
  const data = command.trim();
  const first = data[0];
  if (first === '[' || first === '{' || first === '"') {
    labelize.labelize(JSON.parse(data)).then(callback);
  } else if (utils.is_zid(data)) {
    load.load(data).then(labelize.labelize).then(callback);
  } else {
    console.log('Did not understand input.');
    callback(data);
  }
}

exports.answer = answer;
