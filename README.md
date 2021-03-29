# lambda CLI

A command line interface to Wikifunctions (or any other WikiLambda
installation).

The CLI currently only has an interactive mode which is started using

node src/lambda.js

Then, entering an existing ZID, it loads that ZObject from notwikilambda and
displays it with all ZIDs and key IDs replaced by the labels.

The interactive shell has the following magic features:
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

The plans of what this tool should be able to do is described in
FUTURE_README.md
