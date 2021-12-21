#!/usr/bin/env node
'use strict';

const canonicalize = require('./canonicalize.js');
const config = require('./config.js');
const evaluate = require('./evaluate.js');
const interactive = require('./interactive.js');
const labelize = require('./labelize.js');
const load = require('./load.js');
const normalize = require('./normalize.js');
const prettyprint = require('./prettyprint.js');
const utils = require('./utils.js');

try {
  config.load('./config.json');
} catch (err) {
  console.log('No config.json exists, using config.default.json instead.');
  config.load('./config.default.json');
}

const write = (input) => {
  if (input === null) { return ''; }
  return JSON.stringify(input, null, 2);
}

const getZ2K2 = (zobject) => {
  return zobject.Z2K2;
}

let command = null;
let input = null;
let meta = false;

const settings = ((argv) => {
  let i = 1;

  while (++i < argv.length) {
    const v = argv[i];
    if (v[0] === "-") {
      if (v === "--language") {
        const lang = argv[i+1];  // TODO do something in case of error
        i++;
        config.set_language(lang);
        continue;
      }
      if (v === "--data") {
        const data = argv[i+1];  // TODO do something in case of error
        i++;
        config.set_data(data);
        continue;
      }
      if (v === "--cache") {
        const cache = argv[i+1];  // TODO do something in case of error
        i++;
        config.set_cache(cache);
        continue;
      }
      console.log("Unknown argument: " + v);
      process.exit(1);
    }
    if (command === null) {
      if (v === "labelize" || v === "l") {
        command = labelize.labelize;
        continue;
      }
      if (v === "normalize" || v === "n") {
        command = normalize.normalize_async;
        continue;
      }
      if (v === "canonicalize" || v === "c") {
        command = canonicalize.canonicalize_async;
        continue;
      }
      if (v === "prettyprint" || v === "p") {
        command = prettyprint.prettyprint_async;
        meta = true;
        continue;
      }
      if (v === "evaluate" || v === "e") {
        command = evaluate.evaluate_async;
        continue;
      }
      console.log("Unknown command: " + v);
      process.exit(1);
    }
    if (input === null) {
      input = v;
      continue;
    }
    console.log("Unknown parameter: " + argv[i]);
    process.exit(1);
  }
})(process.argv);

if (command !== null) {
  if (input === null) {
    console.log("No input given.");
    process.exit(1);
  }
  if ('{"['.includes(input[0])) {
    command(JSON.parse(input)).then(write).then(console.log);
  } else if (utils.is_zid(input)) {
    if (meta) {
      load.load(input).then(command).then(write).then(console.log);
    } else {
      load.load(input).then(getZ2K2).then(command).then(write).then(console.log);
    }
  } else {
    console.log("Input not understood.");
    process.exit(1);
  }
}

if (command === null) {
  interactive.interactive();
}
