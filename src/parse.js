'use strict';

const c = require('./constants.js').constants;
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
const OPENLITERAL = 'ZOpenLiteral';
const CLOSELITERAL = 'ZCloseLiteral';
const SEPERATOR = 'ZSeparator';
const OPENESCAPE = 'ZEscape';
const FUTURESYMBOL = 'ZFuture';

const escapeInSymbol = '"()<>[],_\\';
// const escapeInString = '"n\\';
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
      tokens.push({
        [c.ObjectType]: c.Token,
        [c.TokenType]: POTENTIALREFERENCE,
        [c.TokenPosition]: position.toString(),
        [c.TokenValue]: token
      });
      position = currentPosition;
      token = '';
    }
  };

  for (let character of input) {
    currentPosition += 1;
    const pickToken = (match, symbol) => {  // eslint-disable-line no-loop-func
      if (character === match) {
        addPotentialReference();
        tokens.push({
          [c.ObjectType]: c.Token,
          [c.TokenType]: symbol,
          [c.TokenPosition]: position.toString()
        });
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
          tokens.push({
            [c.ObjectType]: c.Token,
            [c.TokenType]: STRING,
            [c.TokenPosition]: position.toString(),
            [c.TokenValue]: token
          });
          position = currentPosition - 1;
          tokens.push({
            [c.ObjectType]: c.Token,
            [c.TokenType]: OPENESCAPE,
            [c.TokenPosition]: position.toString()
          });
          position = currentPosition;
          token = character;
        }
      } else {
        if (character === '"') {
          tokens.push({
            [c.ObjectType]: c.Token,
            [c.TokenType]: STRING,
            [c.TokenPosition]: position.toString(),
            [c.TokenValue]: token
          });
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
          tokens.push({
            [c.ObjectType]: c.Token,
            [c.TokenType]: OPENESCAPE,
            [c.TokenPosition]: position.toString()
          });
          position = currentPosition;
          token = character;
        }
      }
      pickToken('(', OPENARG);
      pickToken(')', CLOSEARG);
      pickToken('<', OPENLITERAL);
      pickToken('>', CLOSELITERAL);
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
        tokens.push({
          [c.ObjectType]: c.Token,
          [c.TokenType]: FUTURESYMBOL,
          [c.TokenPosition]: position.toString(),
          [c.TokenValue]: character
        });
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
    tokens.push({
      [c.ObjectType]: c.Token,
      [c.TokenType]: OPENSTRING,
      [c.TokenPosition]: position.toString(),
      [c.TokenValue]: token
    });
    position = currentPosition;
    token = '';
  }
  if (insideEscape) {
    addPotentialReference();
    tokens.push({
      [c.ObjectType]: c.Token,
      [c.TokenType]: OPENESCAPE,
      [c.TokenPosition]: position.toString()
    });
    position = currentPosition;
    token = '';
  }
  addPotentialReference();
  return tokens;
};

const error = (message, tokens) => {
  return {
    value: {
      [c.ObjectType]: c.Error,
      [c.ErrorType]: message,
      [c.ErrorValue]: tokens
    },
    rest: []
  };
};

const delabelAsync = async (tokens) => {
  const result = [];
  for (const token of tokens) {
    if (token[c.TokenType] !== POTENTIALREFERENCE) {
      result.push(token);
      continue;
    }
    if (utils.isZid(token[c.TokenValue])) {
      const callZid = token[c.TokenValue];
      const callObject = await load.load(callZid);
      const callType = callObject[c.PersistentobjectValue][c.ObjectType];
      token[c.TokenZid] = callZid;
      token[c.TokenZidType] = callType;
      result.push(token);
      continue;
    }
    const delabelCallToken = await delabel.delabel(token[c.TokenValue], 'en');
    if (delabelCallToken.length !== 1) {
      result.push(token);
      continue;
    }
    const callZid = delabelCallToken[0][c.Key1];
    const callType = delabelCallToken[0][c.Key2];
    token[c.TokenZid] = callZid;
    token[c.TokenZidType] = callType;
    result.push(token);
  }
  return result;
};

const buildCsv = async (tokens, open, close) => {
  if (tokens[0][c.TokenType] !== open) {
    return error('expected opener', tokens);
  }
  if (tokens.length < 2) {
    return error('unclosed', tokens);
  }
  if (tokens[1][c.TokenType] === close) {
    return {
      value: [],
      rest: tokens.slice(2)
    };
  }
  const values = [];
  while (true) {
    const { value, rest } =
      await buildValue(tokens.slice(1));  // eslint-disable-line no-use-before-define
    values.push(value);
    if (rest.length === 0) {
      return error('expected closing', tokens);
    }
    if (rest[0][c.TokenType] === close) {
      return {
        value: values,
        rest: rest.slice(1)
      };
    }
    if (rest[0][c.TokenType] === SEPERATOR) {
      tokens = rest;
      continue;
    }
    return error('expected comma', rest);
  }
};

const buildArgs = async (tokens) => {
  return await buildCsv(tokens, OPENARG, CLOSEARG);
};

const buildLiteral = async (tokens) => {
  return await buildCsv(tokens, OPENLITERAL, CLOSELITERAL);
};

const buildSymbol = async (tokens) => {
  if (tokens[0][c.TokenType] !== POTENTIALREFERENCE) {
    return error('expected reference', tokens);
  }
  if (tokens[0][c.TokenZid] === undefined) {
    return error('could not delabel reference', tokens[0]);
  }
  const callZid = tokens[0][c.TokenZid];
  let head = {
    [c.ObjectType]: c.Reference,
    [c.ReferenceValue]: callZid
  };
  let rest = tokens.slice(1);
  if ((rest.length === 0) || (
    rest[0][c.TokenType] !== OPENARG) && (
      rest[0][c.TokenType] !== OPENLITERAL)) {
    return {
      value: head,
      rest: rest
    };
  }
  let value = null;
  while (true) {
    const call = {};
    if (rest[0][c.TokenType] === OPENARG) {
      const x = await buildArgs(rest);
      value = x.value;
      rest = x.rest;
      call[c.ObjectType] = c.Functioncall;
      call[c.FunctioncallFunction] = head;
    } else if (rest[0][c.TokenType] === OPENLITERAL) {
      const x = await buildLiteral(rest);
      value = x.value;
      rest = x.rest;
      call[c.ObjectType] = head;
    } else {
      return {
        value: head,
        rest: rest
      };
    }
    if (value[c.ObjectType] === c.Error) {
      return { value: value, rest: rest };
    }
    let k = 'K';
    if (head[c.ObjectType] === c.Reference) {
      k = head[c.ReferenceValue] + k;
    }
    for (const v in value) {
      call[k + (parseInt(v) + 1).toString()] = value[v];
    }
    if (rest.length === 0) {
      return {
        value: call,
        rest: rest
      };
    }
    if ((rest.length === 0) || (
      rest[0][c.TokenType] !== OPENARG) && (
        rest[0][c.TokenType] !== OPENLITERAL)) {
      return {
        value: call,
        rest: rest
      };
    }
    head = call;
  }
};

const buildList = async (tokens) => {
  return await buildCsv(tokens, OPENLIST, CLOSELIST);
};

const buildString = (tokens) => {
  if (tokens[0][c.TokenType] !== STRING) {
    return error('expected string', tokens);
  }
  return {
    value: {
      [c.ObjectType]: c.String,
      [c.StringValue]: tokens[0][c.TokenValue]
    },
    rest: tokens.slice(1)
  };
};

const buildValue = async (tokens) => {
  if (tokens[0][c.TokenType] === POTENTIALREFERENCE) {
    return await buildSymbol(tokens);
  }
  if (tokens[0][c.TokenType] === OPENLIST) {
    return await buildList(tokens);
  }
  if (tokens[0][c.TokenType] === STRING) {
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
  const delabeled = await delabelAsync(tokens);
  const call = await buildSingleValue(delabeled);
  return call;
};

exports.tokenize = tokenize;
exports.delabelAsync = delabelAsync;
exports.parseAsync = parseAsync;
