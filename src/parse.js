'use strict';

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
      tokens.push({ Z1K1: 'ZToken', K1: POTENTIALREFERENCE, K2: position, K3: token });
      position = current_position;
      token = '';
    }
  }

  for (let character of input) {
    current_position += 1;
    const pick_token = (match, symbol) => {
      if (character === match) {
        add_potential_reference();
        tokens.push({ Z1K1: 'ZToken', K1: symbol, K2: position });
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
          tokens.push({ Z1K1: 'ZToken', K1: STRING, K2: position,  K3: token });
          position = current_position - 1;
          tokens.push({ Z1K1: 'ZToken', K1: OPENESCAPE, K2: position });
          position = current_position;
          token = character;
        }
      } else {
        if (character === '"') {
          tokens.push({ Z1K1: 'ZToken', K1: STRING, K2: position, K3: token });
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
          tokens.push({ Z1K1: 'ZToken', K1: OPENESCAPE, K2: position });
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
        tokens.push({ Z1K1: 'ZToken', K1: FUTURESYMBOL, K2: position, K3: character });
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
    tokens.push({ Z1K1: 'ZToken', K1: OPENSTRING, K2: position, K3: token });
    position = current_position;
    token = '';
  }
  if (insideEscape) {
    add_potential_reference();
    tokens.push({ Z1K1: 'ZToken', K1: OPENESCAPE, K2: position });
    position = current_position;
    token = '';
  }
  add_potential_reference();
  return tokens;
}

const check_tokens = (tokens) => {
  for (let token of tokens) {
    const bad_tokens = [ OPENSTRING, OPENESCAPE, FUTURESYMBOL ];
    if ( bad_tokens.includes( token.K1 ) ) {
      return {
        Z1K1: 'Z5',
        Z5K1: 'ZSyntaxError',
        Z5K2: tokens
      }
    }
  }
  return undefined;
}

const parse = (input) => {
  const tokens = tokenize(input);
  const checktokens = check_tokens(tokens);
  if (checktokens) { return checktokens; }
  return tokens;
}

const parse_async = async (zobject) => {
  return new Promise((resolve, reject) => {
    resolve(parse(zobject));
  });
}

exports.parse = parse;
exports.parse_async = parse_async;
