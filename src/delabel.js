'use strict';

const config = require('./config.js');
const utils = require('./utils.js');
const labelize = require('./labelize.js');
const load = require('./load.js');

const delabel = async (label) => {
  const labelmap = await load.labelmap(config.language());
  const normal = utils.string_normalize(label);

  if (!(normal in labelmap)) {
    return [];
  }

  const hits = labelmap[normal];

  let results = [];
  for (let hit of hits) {
    let result = {
      Z1K1: 'ZSearchResult',
      K1: hit[0],
      K2: hit[1],
      K3: [{
        Z1K1: 'Z11',
        Z11K1: config.language(),
        Z11K1: hit[3]
      }]
    }
    results.push(result);
  }
  return results;
}

exports.delabel = delabel;
