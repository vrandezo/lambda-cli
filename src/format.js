'use strict';

const c = require('./constants.js').constants;
const labelize = require('./labelize.js');
const utils = require('./utils.js');
const config = require('./config.js');

const format = async (output, indent = 0) => {
  if (utils.isArray(output)) {
    if (output.length === 0) {
      return '[]';
    }
    let result = '[';
    for (const element of output) {
      result += '\n' + '  '.repeat(indent + 1);
      result += await format(element, indent + 1);
    }
    result += '\n' + '  '.repeat(indent) + ']';
    return result;
  }
  if (utils.isString(output)) {
    if (utils.isZid(output)) {
      return await labelize.labelizeId(output);
    }
    return '"' + output + '"';
  }
  if (utils.isObject(output)) {
    if (output[c.ObjectType] === c.String) {
      return '"' + output[c.StringValue] + '"';
    }
    if (output[c.ObjectType] === c.Type) {
      let result = await labelize.labelizeId(c.Type) + ': ';
      result += await format(output[c.TypeIdentity], indent + 1);
      for (const key of output[c.TypeKeys]) {
        result += '\n' + '  '.repeat(indent + 1);
        result += await format(key[c.KeyType]) + ': ';
        result += utils.getLabel(key[c.KeyLabels], config.language());
      }
      return result;
    }
    if (Object.keys(output).length === 2) {
      return await format(output[Object.keys(output)[1]], indent);
    }
    // TODO: is a Function
    // TODO: is a function call
    let result = await labelize.labelizeId(output[c.ObjectType]);
    for (const key in output) {
      if (key === c.ObjectType) {
        continue;
      }
      result += '\n' + '  '.repeat(indent + 1);
      result += await labelize.labelizeId(key) + ': ';
      result += await format(output[key], indent + 1);
    }
    return result;
  }
  return output;
};

const formatTokens = (tokens) => {
  let result = '';
  tokens.forEach((token, i) => {
    result += token[c.TokenType];
    if (token[c.TokenValue] !== undefined) {
      result += '(' + token[c.TokenValue] + ')';
    }
    result += ' ';
  });
  return result;
};

exports.formatTokens = formatTokens;
exports.format = format;
