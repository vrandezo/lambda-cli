# lambda CLI

A command line interface to Wikifunctions (or any other WikiLambda
installation).

lambda is usable as a CLI tool in two ways: either calling it for a specific
command or in interactive mode.

## installation

Clone the lambda CLI and set up the dependencies:
```
git clone https://github.com/vrandezo/lambda.git
git submodule init
git submodule update
npm init
```

## Batch

The command line works in the following way:

```src/lambda.js <command> <input>```

Examples:

lambda --language fr l Z6
lambda canonicalize '{ "Z1K1": "Z6", "Z6K1": "Hello" }'

The input may need to be escaped from the shell, e.g. if it includes a space or
quote or other special character.

The following commands are available (the letter is a one letter shorcut,
used in the third example above):
- labelize (l): replace all keys with labels (use language from config or
  the --language parameter).
- normalize (n): return the fully normalized version of the input. In this
  case, the writer is being omitted.
- canonicalize (c): returns the canonicalized version of the input. In this
  case, the writer is being omitted.
- prettyprint (p): return the exact format as used for the data directory in
  the WikiLambda repository

The input can be given in the following ways:
- in JSON: whenever it starts with ", {, or [
- as a ZID, and then it will be loaded from the configured data path

## Interactive

You can call the interactive mode by starting lambda without a command or
input data. You can still use command line arguments, e.g.

```src/lambda.js --language en```

The command line interface per default runs the labelizer.

In the standard setting, you can start typing.
If you start with a {, " or [, the interactive shell assumes that you are
entering a JSON file.
If you type in the label or ZID of an existing ZObject that object will be
displayed.

The interactive shell has the following magic features:
- you can go up and down in a history, also across sessions
- you can type a . and then use any of the following commands
- .help: List all commands
- .break: Sometimes you get stuck, this gets you out
- .clear: Break, and also clear the local context
- .editor: Enter editor mode
- .exit: Exit the REPL
- .load: Load a local file as if you were inputting it
- .save: Save all evaluated commands in this REPL session to a file
- .version: Version number of the lambda CLI
- .language: show or set the natural language
- .data: location of the data (might be local or via http)
- .cache: location of the local directory with the cache
- .reload: reloads a specific ZID. Without arguments, deletes all cache.

## Configuration

The config.json file allows to configure the following settings:
- natural language (key "language", value MediaWiki language code)
- where to load the data from (key "data", value either the URL or the path to
  a local directory, the ZID is replaced by $1)
- cache: path to a local directory for storing the cached files (key "cache")

The values of the configuration parameters are either a single value, or a map
from a short name to a value. In case of the latter, the first value is taken
as the default value.

The configuration can be overriden through command line arguments which have
the same name but are prefixed by a --.

The plans of what this tool should be able to do is described in
FUTURE_README.md
