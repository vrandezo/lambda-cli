'use strict';

const delabel = require('./delabel.js');
const load = require('./load.js');
const utils = require('./utils.js');

const POTENTIALREFERENCE = 'ZSymbol';
const STRING = 'ZString';
const OPENSTRING = 'ZUnclosedQuote';
const OPENARG = 'ZOpenArg';
const CLOSEARG = 'ZCloseArg';
const OPENLIST = 'ZOpenList';
const CLOSELIST = 'ZCloseList';
const SEPERATOR = 'ZSeparator';
const OPENESCAPE = 'ZEscape';
const FUTURESYMBOL = 'ZFuture';

const escapeInSymbol = '"()[],_\\';
const escapeInString = '"n\\';
// a few extra symbols that are not used for now but may in the future
const escapeInSymbolFuture = '{}@!&^?#;:';

const tokenize = (input) => {
  let token = '';
  const tokens = [];
  let currentPosition = 0;
  let position = 1;
  let insideString = false;
  let insideEscape = false;

  const addPotentialReference = () => {
    token = token.trim();
    if (token) {
      tokens.push({ Z1K1: 'ZToken', K1: POTENTIALREFERENCE, K2: position.toString(), K3: token });
      position = currentPosition;
      token = '';
    }
  };

  for (let character of input) {
    currentPosition += 1;
    const pickToken = (match, symbol) => {
      if (character === match) {
        addPotentialReference();
        tokens.push({ Z1K1: 'ZToken', K1: symbol, K2: position.toString() });
        position = currentPosition + 1;
        character = '';
      }
    };

    if (insideString) {
      if (insideEscape) {
        if (character === '"') {
          token += character;
          insideEscape = false;
        } else if (character === '\\') {
          token += '\\\\';
          insideEscape = false;
        } else if (character === 'n') {
          token += '\\n';
          insideEscape = false;
        } else {
          tokens.push({ Z1K1: 'ZToken', K1: STRING, K2: position.toString(),  K3: token });
          position = currentPosition - 1;
          tokens.push({ Z1K1: 'ZToken', K1: OPENESCAPE, K2: position.toString() });
          position = currentPosition;
          token = character;
        }
      } else {
        if (character === '"') {
          tokens.push({ Z1K1: 'ZToken', K1: STRING, K2: position.toString(), K3: token });
          position = currentPosition + 1;
          token = '';
          insideString = false;
        } else if (character === '\\') {
          insideEscape = true;
        } else {
          token += character;
        }
      }
    } else {
      if (insideEscape) {
        if (escapeInSymbol.includes(character) || escapeInSymbolFuture.includes(character)) {
          token += character;
          if (character === '_') {
            token += character;
          }
          character = '';
          insideEscape = false;
        } else {
          addPotentialReference();
          position = currentPosition - 1;
          tokens.push({ Z1K1: 'ZToken', K1: OPENESCAPE, K2: position.toString() });
          position = currentPosition;
          token = character;
        }
      }
      pickToken('(', OPENARG);
      pickToken(')', CLOSEARG);
      pickToken('[', OPENLIST);
      pickToken(']', CLOSELIST);
      pickToken(',', SEPERATOR);
      if (character === '"') {
        addPotentialReference();
        insideString = true;
        // TODO: decide whether spaces are allowed in symbols
        // } else if (character === ' ') {
        //   addPotentialReference();
      } else if (character && escapeInSymbolFuture.includes(character)) {
        addPotentialReference();
        tokens.push({ Z1K1: 'ZToken', K1: FUTURESYMBOL, K2: position.toString(), K3: character });
        token = '';
        position = currentPosition + 1;
      } else if (character === '\\') {
        insideEscape = true;
      } else {
        token += character;
      }
    }
  }
  if (insideString) {
    tokens.push({ Z1K1: 'ZToken', K1: OPENSTRING, K2: position.toString(), K3: token });
    position = currentPosition;
    token = '';
  }
  if (insideEscape) {
    addPotentialReference();
    tokens.push({ Z1K1: 'ZToken', K1: OPENESCAPE, K2: position.toString() });
    position = currentPosition;
    token = '';
  }
  addPotentialReference();
  return tokens;
};

const error = (message, tokens) => {
  return {
    value: {
      Z1K1: 'Z5',
      Z5K1: message,
      Z5K2: tokens
    },
    rest: []
  };
};

const buildCsv = async (tokens, open, close) => {
  if (tokens[0].K1 !== open) {
    return error('expected opener', tokens);
  }
  if (tokens.length < 2) {
    return error('unclosed', tokens);
  }
  if (tokens[1].K1 === close) {
    return {
      value: [],
      rest: tokens.slice(2)
    };
  }
  const values = [];
  while (true) {
    const { value, rest } = await buildValue(tokens.slice(1));
    values.push(value);
    if (rest.length === 0) {
      return error('expected closing', tokens);
    }
    if (rest[0].K1 === close) {
      return {
        value: values,
        rest: rest.slice(1)
      };
    }
    if (rest[0].K1 === SEPERATOR) {
      tokens = rest;
      continue;
    }
    return error('expected comma', rest);
  }
};

const buildArgs = async (tokens) => {
  return await buildCsv(tokens, OPENARG, CLOSEARG);
};

const buildSymbol = async (tokens) => {
  if (tokens[0].K1 !== POTENTIALREFERENCE) {
    return error('expected reference', tokens);
  }
  let callZid = '';
  let callType = '';
  if (utils.isZid(tokens[0].K3)) {
    callZid = tokens[0].K3;
    const callObject = await load.load(callZid);
    callType = callObject.Z2K2.Z1K1;
  } else {
    const delabelCallToken = await delabel.delabel(tokens[0].K3, 'en');
    if (delabelCallToken.length !== 1) {
      return error('could not delabel reference', tokens[0]);
    }
    callZid = delabelCallToken[0].K1;
    callType = delabelCallToken[0].K2;
  }
  const isType = callType === 'Z4';
  const isFunction = callType === 'Z8';
  if (tokens.length === 1 || tokens[1].K1 !== OPENARG || !(isType || isFunction)) {
    return {
      value: {
        Z1K1: 'Z9',
        Z9K1: callZid
      },
      rest: tokens.slice(1)
    };
  }
  const call = {};
  if (isType) {
    call.Z1K1 = callZid;
  }
  if (isFunction) {
    call.Z1K1 = 'Z7';
    call.Z7K1 = callZid;
  }
  const { value, rest } = await buildArgs(tokens.slice(1));
  if (value.Z1K1 === 'Z5') {
    return { value: value, rest: rest };
  }
  for (const v in value) {
    call[callZid + 'K' + (parseInt(v) + 1).toString()] = value[v];
  }
  return {
    value: call,
    rest: rest
  };
};

const buildList = async (tokens) => {
  return await buildCsv(tokens, OPENLIST, CLOSELIST);
};

const buildString = (tokens) => {
  if (tokens[0].K1 !== STRING) {
    return error('expected string', tokens);
  }
  return {
    value: {
      Z1K1: 'Z6',
      Z6K1: tokens[0].K3
    },
    rest: tokens.slice(1)
  };
};

const buildValue = async (tokens) => {
  if (tokens[0].K1 === POTENTIALREFERENCE) {
    return await buildSymbol(tokens);
  }
  if (tokens[0].K1 === OPENLIST) {
    return await buildList(tokens);
  }
  if (tokens[0].K1 === STRING) {
    return buildString(tokens);
  }
  return error('must be a reference, function call, list, or string', tokens);
};

const buildSingleValue = async (tokens) => {
  const { value, rest } = await buildValue(tokens);
  if (rest.length > 0) {
    return error('rest after parsing a value', rest);
  }
  return value;
};

const parseAsync = async (input) => {
  const tokens = tokenize(input);
  const call = await buildSingleValue(tokens);
  return call;
};

exports.parseAsync = parseAsync;
