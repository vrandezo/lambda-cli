'use strict';

const https = require('https');

const labelize = require('./labelize.js');
const load = require('./load.js');

const answer = (command, callback) => {
  load.load(command.trim()).then(labelize.labelize).then(callback);
}

exports.answer = answer;
