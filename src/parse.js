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

const check_grammar = (tokens) => {
  // TODO: this is all wrong
  // once we allow for nested calls, first check for imbalanced quotes
  // then make a stack that you push and pop as opening args and arrays
  // then check arrays and strings are only in places literals should be, i.e. args
  // then check that symbols are either standalone args or starting a function call
  if (tokens.length < 4) {
    return {
      Z1K1: 'Z5',
      Z5K1: 'Function call must be of the form f(x, y)',
      Z5K2: tokens
    }
  }
  if (tokens[0].K1 !== POTENTIALREFERENCE) {
    return {
      Z1K1: 'Z5',
      Z5K1: 'Function call must start with a function reference',
      Z5K2: tokens
    }
  }
  if (tokens[1].K1 !== OPENARG) {
    return {
      Z1K1: 'Z5',
      Z5K1: 'Function call must have an ( after function reference',
      Z5K2: tokens
    }
  }
  if (tokens[tokens.length-1].K1 !== CLOSEARG) {
    return {
      Z1K1: 'Z5',
      Z5K1: 'Function call must end with an )',
      Z5K2: tokens
    }
  }
  let arg = true;
  for (let token of tokens.slice(2, -1)) {
    if (arg) {
      if (token.K1 === POTENTIALREFERENCE || token.K1 === STRING) {
        arg = false;
        continue;
      }
      return {
        Z1K1: 'Z5',
        Z5K1: 'Function call be of the form f(x, y)',
        Z5K2: tokens
      }
    } else {
      if (token.K1 !== SEPERATOR) {
        return {
          Z1K1: 'Z5',
          Z5K1: 'Function call be of the form f(x, y)',
          Z5K2: tokens
        }
      }
      arg = true;
    }
  }
  return undefined;
}

const get_simple_function_call = (tokens) => {
  let call = {
    Z1K1: 'Z7'
  }
  const call_token = tokens[0];
  const delabel_call_token = delabel.delabel(call_token.K3);
  if (delabel_call_token.length !== 1) {
    return {
      Z1K1: 'Z5',
      Z5K1: 'Could not delabel symbol',
      Z5K2: call_token
    }
  }
  const call_zid = delabel_call_token[0].K1;
  call.Z7K1 = call_zid;
  let argpos = 0;
  let arg = true;
  for (let token of tokens.slice(2, -1)) {
    if (arg) {
      argpos += 1;
      const argkey = call_zid + 'K' + argpos.toString();
      arg = false;
      if (token.K1 === POTENTIALREFERENCE) {
        const delabel_argument_token = delabel.delabel(token.K3);
        if (delabel_argument_token.length !== 1) {
          return {
            Z1K1: 'Z5',
            Z5K1: 'Could not delabel symbol',
            Z5K2: token
          }
        }
        call[argkey] = {
          Z1K1: 'Z9',
          Z9K1: delabel_argument_token[0].K1
        }
      } else if (token.K1 === STRING) {
        call[argkey] = {
          Z1K1: 'Z6',
          Z6K1: token.K3
        }
      }
    } else {
      arg = true;
    }
  }
  return call;
}

const parse = (input) => {
  const tokens = tokenize(input);
  const checktokens = check_tokens(tokens);
  if (checktokens) { return checktokens; }
  const checkgrammar = check_grammar(tokens);
  if (checkgrammar) { return checkgrammar; }
  const call = get_simple_function_call(tokens);
  return call;
}

const parse_async = async (zobject) => {
  return new Promise((resolve, reject) => {
    resolve(parse(zobject));
  });
}

exports.parse = parse;
exports.parse_async = parse_async;
