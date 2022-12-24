'use strict';

const c = require('./constants.js').constants;
const labelize = require('./labelize.js');
const utils = require('./utils.js');

const formatForward = async (output, lang, indent) => {
  return await format(output, lang, indent); // eslint-disable-line no-use-before-define
};

const formatArray = async (output, lang, indent) => {
  if (output.length === 0) {
    return '[]';
  }
  let result = '[';
  let benjamin = true;
  for (const element of output) {
    if (benjamin) {
      benjamin = false;
      result += await formatForward(element, 0);
      continue;
    }
    result += ',\n' + '  '.repeat(indent + 1);
    result += await formatForward(element, indent + 1);
  }
  result += '\n' + '  '.repeat(indent) + ']';
  return result;
};

const formatString = async (output, lang, indent) => {
  if (utils.isZid(output)) {
    return await labelize.labelizeId(output);
  }
  return '"' + output + '"';
};

const formatStringNormal = (output, lang, indent) => {
  return '"' + output[c.StringValue] + '"';
};

/*
const formatTypeDeclaration = async (output, lang, indent) => {
  let result = await labelize.labelizeId(c.Type) + ': ';
  result += await format(output[c.TypeIdentity], indent + 1);
  let benjamin = true;
  for (const key of output[c.TypeKeys]) {
    if (benjamin) {
      benjamin = false;
      continue;
    }
    result += '\n' + '  '.repeat(indent + 1);
    result += await format(key[c.KeyType]) + ': ';
    result += utils.getLabel(key[c.KeyLabels], lang);
  }
  return result;
};
*/

const formatType = async (output, lang, indent) => {
  return await formatForward(output[c.TypeIdentity], lang, indent);
};

const formatFunction = async (output, lang, indent) => {
  let result = await formatForward(output[c.FunctionIdentity], indent + 1);
  result += ': ';
  let first = true;
  let benjamin = true;
  for (const key of output[c.FunctionArguments]) {
    if (benjamin) {
      benjamin = false;
      continue;
    }
    if (!first) {
      result += ', ';
    }
    first = false;
    result += await formatForward(key[c.ArgumentType]);
  }
  result += ' → ';
  result += await formatForward(output[c.FunctionReturntype]);
  return result;
};

const formatFunctioncall = async (output, lang, indent) => {
  let result = '';
  let first = true;
  let benjamin = true;
  for (const key in output) {
    if (benjamin) {
      benjamin = false;
      continue;
    }
    if (key === c.ObjectType) {
      continue;
    }
    if (key === c.FunctioncallFunction) {
      result += await formatForward(output[c.FunctioncallFunction]) + '(';
      continue;
    }
    if (!first) {
      result += ', ';
    }
    first = false;
    result += await formatForward(output[key]);
  }
  result += ')';
  return result;
};

const formatDefault = async (output, lang, indent) => {
  let typeid = '';
  if (utils.isZid(output[c.ObjectType])) {
    typeid = output[c.ObjectType];
  } else {
    typeid = output[c.ObjectType][c.TypeIdentity];
  }
  let result = await labelize.labelizeId(typeid) + '<';
  let first = true;
  for (const key in output) {
    if (key === c.ObjectType) {
      continue;
    }
    if (first) {
      first = false;
    } else {
      result += ', ';
    }
    // result += '\n' + '  '.repeat(indent + 1);
    // result += await labelize.labelizeId(key) + ': ';
    result += await formatForward(output[key], indent + 1);
  }
  return result + '>';
};

const format = async (output, lang, indent = 0) => {
  if (utils.isArray(output)) {
    return await formatArray(output, lang, indent);
  }
  if (utils.isString(output)) {
    return await formatString(output, lang, indent);
  }
  if (utils.isObject(output)) {
    if (output[c.ObjectType] === c.String) {
      return formatStringNormal(output, lang, indent);
    }
    if (output[c.ObjectType] === c.Type) {
      return await formatType(output, lang, indent);
    }
    if (output[c.ObjectType] === c.Function) {
      return await formatFunction(output, lang, indent);
    }
    if (output[c.ObjectType] === c.Functioncall) {
      return await formatFunctioncall(output, lang, indent);
    }
    if (output[c.ObjectType] === c.Reference) {
      return await format(output[c.ReferenceValue], lang, indent);
    }
    if (output[c.ObjectType] === c.Boolean) {
      return await format(output[c.BooleanValue], lang, indent);
    }
    // if (Object.keys(output).length === 2) {
    //   return await format(output[Object.keys(output)[1]], lang, indent);
    // }
    return formatDefault(output, lang, indent);
  }
  return output;
};

const formatTokens = (tokens, lang) => {
  let result = '';
  tokens.forEach((token, i) => {
    result += token[c.TokenType];
    if (token[c.TokenValue] !== undefined) {
      if (token[c.TokenZid] !== undefined) {
        result += '(' + token[c.TokenZid] + ')';
      } else {
        result += '(' + token[c.TokenValue] + ')';
      }
    }
    result += ' ';
  });
  return result;
};

exports.formatTokens = formatTokens;
exports.format = format;
