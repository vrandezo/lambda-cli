# lambda CLI

A command line interface to Wikifunctions (or any other WikiLambda
installation).

It currently, given a ZID, loads the ZObject with the given ZID from
notwikilambda, performs an incomplete wellformedness check, and displays the
ZObject.

## TODO: initial plan - all below is unimplemented

lambda is usable as a CLI tool in two ways: either calling it for a specific
command or in interactive mode. The command line works in the following way:

lambda <command> <input>

Examples:

lambda labelize Z4

lambda normalize '"Hello"'

lambda c '{ "Z1K1": "Z6", "Z6K1": "Hello" }'

lambda evaluate 'and(true, false)'

The input may need to be escaped from the shell, e.g. if it includes a space or
quote or other special character.

The following commands are available (the letter is a one letter shorcut,
used in the third example above):
- labelize (l): replace all keys with labels (use language from config or
  the --language parameter). Syntactically, this is the canonical version.
- normalize (n): return the fully normalized version of the input. In this
  case, the writer is being omitted.
- canonicalize (c): returns the canonicalized version of the input. In this
  case, the writer is being omitted.
- prettyprint (p): return the exact format as used for the data directory in
  the WikiLambda repository
- evaluate (e): if a literal, nothing. If a function call, the function call
  is being applied.
- parse JSON (j): assumes the input is JSON and parses it.
- parse functional syntax (f): assumes functional syntax and parses it.
- wellformed (w): checks for well-formedness.
- conforming (m): checks for all inalienable truths.
- linked (l): checks all ZIDs for existence.
- checkable (k): checks if a validator is available.
- valid (v): runs the validator.

The checking commands return a 0 if no errors have been found, otherwise
a non-zero result.

The input can be given in three different ways:
- in JSON: whenever it starts with ", {, or [
- as a path to a local filename: when it starts with . or /
- in functional syntax: otherwise (note that the language from config or
  the language parameter is assumed)

The config file can override the reader, which may change how the input is
interpreted.

You can also pipe the input in through stdin and pipe the result out
(e.g. for normalization etc.)

## Interactive

The command line interface per default runs:
- the standard parser. If parsing fails, respective errors are displayed and we
  stop.
- full validation. If validation fails, respective errors are displayed and we
  stop.
- evaluation, if it is a function call.
- the writer on what we received so far.

In the standard setting, you can start typing.
If you start with a {, " or [, the interactive shell assumes that you are
entering a JSON file.
If you type in the label or ZID of an existing ZObject that is not a type or
function, that object is loaded.
If you type in a function name or a type and press return, you will be prompted
for the respective keys, to construct a function call or an instance of the
given type.
If you type in a function name or a type followed by a the values for the keys
in a comma separated list enclosed in (), this will be understood as a function
call or an instance construction.

The interactive shell has the following magic features:
- the _ refers to the result of the previous line
- you can use autocomplete with tabbing
- you can go up and down in a history
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
- .parser: show or set the parser to use
- .writer: show or set the writer to use
- .timer: switch the timer on or off
- .data: location of the data (might be local or via http)
- .evaluator: which evaluator to run (local or via http)
- .labelize: use a writer that shows the canonical version but labelized
- .normal: use normalization instead of the standard writer
- .canonical: returns the canonicalized version instead of the standard writer
- .prettyprint: return the exact format as used for the data directory in
  the WikiLambda repository
- .parse: stops after the parsing step and shows the result.
- .wellformed: runs wellformedness and shows the result.
- .conforming: checks for inalienable truths and shows the result.
- .linked: checks all referenced ZIDs for existence.
- .checkable: checks if a validator is available.
- .valid: runs the validator.
- .label: if a ZID, returns the label, if a label, returns all matching ZIDs
  with their types.
- .alias: returns all matching ZIDs with their canonical label and their types.
- .uncache: deletes a specific ZID from cache. Without arguments, deletes all
  cache.
- .follow: connects live to the source wiki, i.e. follows the recentchanges and
  subscribes to updates as they happen on wiki.

Many of the commands take either an argument or, if none is given, assume
the result from the previous command as the argument.

## Configuration

The config.json file allows to configure the following settings:
- natural language
- parser
- writer
- timer yes or no
- where to load the data from per default (a local directory or via http)
- which evaluator to run (local one or via http)
- cache: local file with cache

The values of the configuration parameters are either a single value, or a map
from a short name to a value. In case of the latter, the first value is taken
as the default value.

The configuration can be overriden through command line arguments which have
the same name but are prefixed by a -- e.g.

lambda labelize Z4 --language ja --timer on

## TODOs
- add standard files (LICENSE, CODE OF CONDUCT, etc.)
- read ZObjects from Command line
- autocomplete (for default parser)
- result preview (for default parser)
- check abstracttext capabilities and learn
- history
- command line interface, not just interactive
- labelize
- canonicalize
- normalize
- validate
- checking levels
-- parses (JSON)
-- Wellformedness (simple wellformedness)
-- Conforming (all inalienable truths)
-- Linked (all ZIDs exist)
-- checkable (the Type has a validator)
-- valid (the validator returns no errrors)
- defineCommand language
- defineCommand timer
- defineCommand parser
- defineCommand writer
- defineCommand reload labelmap
- defineCommand set evaluator
- set where to load the data from
- what about i18n of the commands?
