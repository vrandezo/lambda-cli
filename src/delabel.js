'use strict';

const config = require('./config.js');
const utils = require('./utils.js');

const delabel = (string, language) => {
  if (string === 'If') {
    return [{
      Z1K1: 'ZSearchResult',
      K1: 'Z802',
      K2: 'Z8',
      K3: [{
        Z1K1: 'Z11',
        Z11K1: 'en',
        Z11K2: 'If'
      }]
    }];
  }
  if (string === 'Reify') {
    return [{
      Z1K1: 'ZSearchResult',
      K1: 'Z805',
      K2: 'Z8',
      K3: [{
        Z1K1: 'Z11',
        Z11K1: 'en',
        Z11K2: 'Reify'
      }]
    }];
  }
  if (string === 'Cons') {
    return [{
      Z1K1: 'ZSearchResult',
      K1: 'Z810',
      K2: 'Z8',
      K3: [{
        Z1K1: 'Z11',
        Z11K1: 'en',
        Z11K2: 'Cons'
      }]
    }];
  }
  if (string === 'Head') {
    return [{
      Z1K1: 'ZSearchResult',
      K1: 'Z811',
      K2: 'Z8',
      K3: [{
        Z1K1: 'Z11',
        Z11K1: 'en',
        Z11K2: 'Head'
      }]
    }];
  }
  if (string === 'Tail') {
    return [{
      Z1K1: 'ZSearchResult',
      K1: 'Z812',
      K2: 'Z8',
      K3: [{
        Z1K1: 'Z11',
        Z11K1: 'en',
        Z11K2: 'Tail'
      }]
    }];
  }
  if (string === 'Empty') {
    return [{
      Z1K1: 'ZSearchResult',
      K1: 'Z813',
      K2: 'Z8',
      K3: [{
        Z1K1: 'Z11',
        Z11K1: 'en',
        Z11K2: 'Empty'
      }]
    }];
  }
  if (string === 'String_to_list') {
    return [{
      Z1K1: 'ZSearchResult',
      K1: 'Z868',
      K2: 'Z8',
      K3: [{
        Z1K1: 'Z11',
        Z11K1: 'en',
        Z11K2: 'String to list'
      }]
    }];
  }
  if (string === 'true') {
    return [{
      Z1K1: 'ZSearchResult',
      K1: 'Z41',
      K2: 'Z40',
      K3: [{
        Z1K1: 'Z11',
        Z11K1: 'en',
        Z11K2: 'true'
      }]
    }];
  }
  if (string === 'false') {
    return [{
      Z1K1: 'ZSearchResult',
      K1: 'Z42',
      K2: 'Z40',
      K3: [{
        Z1K1: 'Z11',
        Z11K1: 'en',
        Z11K2: 'false'
      }]
    }];
  }
  return [];
}

exports.delabel = delabel;
