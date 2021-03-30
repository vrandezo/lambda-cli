'use strict';

const https = require('https');

const labelize = require('./labelize.js');
const load = require('./load.js');

const answer = (command, callback) => {
  const data = command.trim();
  const first = data[0];
  if (first === '[' || first === '{' || first === '"') {
    labelize.labelize(JSON.parse(data)).then(callback);
  } else {
    load.load(data).then(labelize.labelize).then(callback);
  }
}

exports.answer = answer;
