# lambda cli

This document is the README file that I wish this tool had. It basically
lists all the capabilities it should feature.

lambda is usable as a CLI tool in two ways: either calling it for a specific
command or in interactive mode.

## Batch

The command line works in the following way:

lambda <parameters> <input>

Examples:

lambda --label Z4

lambda --normal '"Hello"'

lambda --canonical '{ "Z1K1": "Z6", "Z6K1": "Hello" }'

lambda --evaluate 'and(true, false)'

lambda --noevaluate 'head(string to list("abc"))'

The input may need to be escaped from the shell, e.g. if it includes
parentheses or quotes or other special character.

The following parameters are available:
--[no]tokens: shows the results of the tokenizer
--[no]delabel: shows the results of the delabeler
--[no]ast: shows the results of the parser
--[no]wellformed: checks the input for well-formedness
--[no]conforming: checks for inalienable truths
--[no]linked: checks whether all ZIDs exist
--[no]checkable: checks whether a validator is available and implemented
--[no]validat[ion]: validates the input or not
--[no]eval[uate]: performs an evaluation or not. The evaluation is
  done on the wiki, not locally
--[no]raw: displays the raw result from the evaluation call
--[no]normal: normalizes the result
--[no]canonical: canonicalizes the result
--[no]prettyprint: prints the result in the format used in the data directory
--[no]label: replaces all ZIDs with labels
--[no]format: uses a formatter to show the result in an easier to read way
--[no]timer: displays how much time the call took
--[no]meta: displays other information from the evaluation or call
--file: followed by a path to a file to be loaded by the tool
--config: followed by a path to a config file (see below)
--language: followed by the language to use. Can be a ZID or a language code
--wiki: URL to a wiki, or a path to a local directory
--cache: path to a local directory
--parser: ZID for the parser
--writer: ZID for the writer

The command returns a 0 if no errors are detected thrown, otherwise a
non-zero answer is returned.

The syntax of the input can be given either as functional syntax or as
JSON or a mix of both.

The config file can override the reader, which may change how the input is
interpreted.

You can also pipe the input in through stdin and pipe the result out
(e.g. for normalization etc.)

## Interactive

You can call the interactive mode by starting lambda without input data.
You can use the parameters given above, and they overwrite whatever is in
the config file.

The command line interface per default runs:
- the standard parser. If parsing fails, respective errors are displayed and
  we stop.
- full validation. If validation fails, respective errors are displayed and
  we stop.
- evaluation, if it is a function call.
- the writer on what we received so far.

In the standard setting, you can start typing.
Your commands can mix functional syntax and JSON syntax.
If you type in the label or ZID of an existing ZObject that is not a type or
function, that object is loaded and shown.
If you type in a function name or a type and press return, you will be
prompted for the respective keys, to construct a function call or an
instance of the given type.
If you type in a function name or a type followed by a the values for the
keys in a comma separated list enclosed in (), this will be understood as
a function call or an instance construction.

The interactive shell has the following features:
- _ refers to the result of the previous command
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
- .tokens: tokenizes the input
- .delabel: turns the input labels into ZIDs
- .ast: shows the parsed call
- .parser: show or set the parser to use
- .wellformed: runs wellformedness and shows the result.
- .conforming: checks for inalienable truths and shows the result.
- .linked: checks all referenced ZIDs for existence.
- .checkable: checks if a validator is available.
- .valid: runs the validator.
- .evaluate: switches the evaluator on or off
- .raw: displays the raw result from the evaluator
- .normal: shows the normalizad version
- .canonical: shows the canonicalized version
- .prettyprint: return the exact format as used for the data directory in
  the WikiLambda repository
- .labelize: use a writer that shows the canonical version but labelized
- .writer: show or set the writer to use
- .timer: switch the timer on or off
- .wiki: URL of the wiki, or a local path to the data
- .label: if a ZID, returns the label, if a label, returns all matching ZIDs
  with their types.
- .search: performs a search and returns matching objects with their
  canonical label and their types.
- .reload: reloads a specific ZID. Without arguments, deletes all cache.
- .follow: connects live to the source wiki, i.e. follows the recentchanges
  and subscribes to updates as they happen on wiki.

Many of the commands take either an argument or, if none is given, assume
the result from the previous command as the argument.

## Configuration

The config.json file allows to configure all the settings given above.
- language: natural language
- parser
- writer
- wiki: where to load the data from (a local directory or via http)
- which evaluator to run (local one or via http)
- cache: local file with cache

The values of the configuration parameters are either a single value, or a map
from a short name to a value. In case of the latter, the first value is taken
as the default value.

The following configuration keys are just booleans, either true or false.
- tokens: shows the results of the tokenizer
- delabel: shows the results of the delabeler
- ast: shows the results of the parser
- wellformed: checks the input for well-formedness
- conforming: checks for inalienable truths
- linked: checks whether all ZIDs exist
- checkable: checks whether a validator is available and implemented
- validate: validates the input or not
- evaluate: performs an evaluation or not. The evaluation is
  done on the wiki, not locally
- raw: displays the raw result from the evaluation call
- normal: normalizes the result
- canonical: canonicalizes the result
- prettyprint: prints the result in the format used in the data directory
- label: replaces all ZIDs with labels
- format: uses a formatter to show the result in an easier to read way
- timer: displays how much time the call took
- meta: displays other information from the evaluation or call

The configuration can be overriden through command line arguments which have
the same name but are prefixed by a -- and preceded by a "no" if meant
to be switched off.

lambda --labelize --language ja --timer Z4

You can also load an alternative configuration by using the --config argument.
