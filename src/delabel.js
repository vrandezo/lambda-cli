'use strict';

const config = require('./config.js');
const utils = require('./utils.js');
const labelize = require('./labelize.js');
const load = require('./load.js');

const normalize = (s) => s.toLowerCase().replace(' ', '_');

const delabel = async (label) => {
  const labelmap = await load.labelmap(config.language());
  const normal = normalize(label);

  if (!(normal in labelmap)) {
    return [];
  }

  const zids = labelmap[normal];

  let results = [];
  for (let zid of zids) {
    const obj = await load.load(zid);
    let result = {
      Z1K1: 'ZSearchResult',
      K1: zid,
      K2: obj.Z2K2.Z1K1,
      K3: [{
        Z1K1: 'Z11',
        Z11K1: config.language(),
        Z11K1: labelize.labelize(zid)
      }]
    }
    results.push(result);
  }
  return results;
}

exports.delabel = delabel;
