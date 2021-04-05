'use strict';

const canonicalize = require('./canonicalize.js');
const utils = require('./utils.js');

const out = (s) => {
  process.stdout.write(s);
}

const nl = () => {
  console.log('');
}

const spaces = (x) => {
  out(' '.repeat(x*2));
}

const prettyprint_object = (o, indent) => {
  console.log('{');
  let first = true;
  for (let key of Object.keys(o)) {
    if (!first) {
      out(',');
      nl();
    }
    first = false;
    spaces(indent+1);
    out('"');
    out(key);
    out('": ');
    prettyprint_internal(o[key], indent+1);
  }
  nl();
  spaces(indent);
  out('}');
}

const prettyprint_string = (s, indent) => {
  out('"' + s + '"');
}

const prettyprint_array = (a, indent) => {
  if (a.length === 0) {
    out('[]');
    return;
  }
  out('[');
  nl();
  let first = true;
  for (let item of a) {
    if (!first) {
      out(',');
      nl();
    }
    first = false;
    spaces(indent+1);
    prettyprint_internal(item, indent+1);
  }
  nl();
  spaces(indent);
  out(']');
}

const prettyprint_internal = (zobject, indent) => {
  if (utils.is_object(zobject)) {
    prettyprint_object(zobject, indent);
  } else if (utils.is_string(zobject)) {
    prettyprint_string(zobject, indent);
  } else if (utils.is_array(zobject)) {
    prettyprint_array(zobject, indent);
  }
}

const prettyprint = (zobject) => {
  const result = canonicalize.canonicalize(zobject);
  prettyprint_internal(result, 0);
  return null;
}

const prettyprint_async = async (zobject) => {
  return new Promise((resolve, reject) => {
    resolve(prettyprint(zobject));
  });
}

exports.prettyprint = prettyprint;
exports.prettyprint_async = prettyprint_async;
