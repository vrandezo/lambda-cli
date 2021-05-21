'use strict';

const delabel = require('./delabel.js');
const utils = require('./utils.js');
const config = require('./config.js');

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
  let current_position = 0;
  let position = 1;
  let insideString = false;
  let insideEscape = false;

  const add_potential_reference = () => {
    token = token.trim();
    if (token) {
      tokens.push({ Z1K1: 'ZToken', K1: POTENTIALREFERENCE, K2: position.toString(), K3: token });
      position = current_position;
      token = '';
    }
  }

  for (let character of input) {
    current_position += 1;
    const pick_token = (match, symbol) => {
      if (character === match) {
        add_potential_reference();
        tokens.push({ Z1K1: 'ZToken', K1: symbol, K2: position.toString() });
        position = current_position + 1;
        character = '';
      }
    }

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
          position = current_position - 1;
          tokens.push({ Z1K1: 'ZToken', K1: OPENESCAPE, K2: position.toString() });
          position = current_position;
          token = character;
        }
      } else {
        if (character === '"') {
          tokens.push({ Z1K1: 'ZToken', K1: STRING, K2: position.toString(), K3: token });
          position = current_position + 1;
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
        if ( escapeInSymbol.includes(character) || escapeInSymbolFuture.includes(character) ) {
          token += character;
          if (character === '_') { token += character; }
          character = '';
          insideEscape = false;
        } else {
          add_potential_reference();
          position = current_position - 1;
          tokens.push({ Z1K1: 'ZToken', K1: OPENESCAPE, K2: position.toString() });
          position = current_position;
          token = character;
        }
      }
      pick_token('(', OPENARG);
      pick_token(')', CLOSEARG);
      pick_token('[', OPENLIST);
      pick_token(']', CLOSELIST);
      pick_token(',', SEPERATOR);
      if (character === '"') {
        add_potential_reference();
        insideString = true;
      } else if (character === ' ') {
        add_potential_reference();
      } else if (character && escapeInSymbolFuture.includes(character)) {
        add_potential_reference();
        tokens.push({ Z1K1: 'ZToken', K1: FUTURESYMBOL, K2: position.toString(), K3: character });
        token = '';
        position = current_position + 1;
      } else if (character === '\\') {
        insideEscape = true;
      } else {
        token += character;
      }
    }
  }
  if (insideString) {
    tokens.push({ Z1K1: 'ZToken', K1: OPENSTRING, K2: position.toString(), K3: token });
    position = current_position;
    token = '';
  }
  if (insideEscape) {
    add_potential_reference();
    tokens.push({ Z1K1: 'ZToken', K1: OPENESCAPE, K2: position.toString() });
    position = current_position;
    token = '';
  }
  add_potential_reference();
  return tokens;
}

const error = (message, tokens) => {
  return {
    value: {
      Z1K1: 'Z5',
      Z5K1: message,
      Z5K2: tokens
    },
    rest: []
  }
}

const build_csv = (tokens, open, close) => {
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
    }
  }
  let values = [];
  while (true) {
    let { value, rest } = build_value(tokens.slice(1));
    values.push(value);
    if (rest.length === 0) {
      return error('expected closing', tokens);
    }
    if (rest[0].K1 === close) {
      return {
        value: values,
        rest: rest.slice(1)
      }
    }
    if (rest[0].K1 === SEPERATOR) {
      tokens = rest;
      continue;
    }
    return error('expected comma', rest);
  }
}

const build_args = (tokens) => {
  return build_csv(tokens, OPENARG, CLOSEARG);
}

const build_symbol = (tokens) => {
  if (tokens[0].K1 !== POTENTIALREFERENCE) {
    return error('expected reference', tokens);
  }
  const delabel_call_token = delabel.delabel(tokens[0].K3);
  if (delabel_call_token.length !== 1) {
    return error('could not delabel reference', tokens[0]);
  }
  const call_zid = delabel_call_token[0].K1;
  const call_type = delabel_call_token[0].K2;
  const is_type = call_type === 'Z4';
  const is_function = call_type === 'Z8';
  if (tokens.length === 1 || tokens[1].K1 !== OPENARG || !(is_type || is_function)) {
    return {
      value: {
        Z1K1: 'Z9',
        Z9K1: call_zid
      },
      rest: tokens.slice(1)
    }
  }
  let call = {}
  if (is_type) {
    call.Z1K1 = call_zid;
  }
  if (is_function) {
    call.Z1K1 = 'Z7';
    call.Z7K1 = call_zid;
  }
  let { value, rest } = build_args(tokens.slice(1));
  if (value.Z1K1 === 'Z5') { return { value: value, rest: rest }; }
  for (let v in value) {
    call[call_zid + 'K' + (parseInt(v) + 1).toString()] = value[v];
  }
  return {
    value: call,
    rest: rest
  }
}

const build_list = (tokens) => {
  return build_csv(tokens, OPENLIST, CLOSELIST);
}

const build_string = (tokens) => {
  if (tokens[0].K1 !== STRING) {
    return error('expected string', tokens);
  }
  return {
    value: {
      Z1K1: 'Z6',
      Z6K1: tokens[0].K3
    },
    rest: tokens.slice(1)
  }
}

const build_value = (tokens) => {
  if (tokens[0].K1 === POTENTIALREFERENCE) {
    return build_symbol(tokens);
  }
  if (tokens[0].K1 === OPENLIST) {
    return build_list(tokens);
  }
  if (tokens[0].K1 === STRING) {
    return build_string(tokens);
  }
  return error('must be a reference, function call, list, or string', tokens);
}

const build_single_value = (tokens) => {
  let { value, rest } = build_value(tokens);
  if (rest.length > 0) {
    return error('rest after parsing a value', rest);
  }
  return value;
}

const parse = (input) => {
  const tokens = tokenize(input);
  const call = build_single_value(tokens);
  return call;
}

const parse_async = async (zobject) => {
  return new Promise((resolve, reject) => {
    resolve(parse(zobject));
  });
}

exports.parse = parse;
exports.parse_async = parse_async;
