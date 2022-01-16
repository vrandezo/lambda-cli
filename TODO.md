next steps:
- formatting results
- settings should be a parameter on answer, not the global config?
- prettyprint used to show the whole Persistentobject, not just the value,
  when asked for a ZID, should there be something like that?
- delabeling should happen as a distinct step, before the ast building,
  and should be called distinctively
- have a test dataset in test that is used for tests instead of the real
  data in function-schemata. Use this to also test several languages

- tests
-- normalize
-- canonicalize
-- labelize
-- evaluate
-- lambda
-- interactive
-- wellformed
-- prettyprint

- logging or just give much more options on the command line

- works a little:
-- parse / delabel / labelmap in load
-- wellformed

previous next steps:
- how to manage labelmap state in different languages and endpoints
- use search instead of labelmap for remote endpoints
- how to deal with caches against different endpoints
- what to do when more than one hit

- when switching .wiki, also delete the cache and the labelmap

then:
- replace .reload with .clear
- .language should also use language names, not just codes
- the lambda one command thing and the command line interface should behave consistently, right now completely different code
- log stuff, allow to be chattier on the command line (.details on)
- eval, search, and load all make calls to the MW API with lots of repeat code
- checking levels
-- parses (JSON)
-- parses mixed JSON into function call syntax and the other way around
-- Wellformedness (simple wellformedness)
-- Conforming (all inalienable truths)
-- Linked (all ZIDs exist)
-- checkable (the Type has a validator)
-- valid (the validator returns no errrors)
- deal with errors in many places

furthermore:
- prettyprint in the REPL (worry about Z2 envelope)
- full underscore implementation
- introduce recoverable errors when the line is not complete
- allow JSON objects in syntax
- labelmap from website
- write a help message for --help
- move repo to gerrit
- rename master to main (will happen together with all other gerrit repos)
- allow --config parameter
- have a command for ZID to name and vice versa
- autocomplete (for default parser)
-- needs labelmap or something to get all labels from .data source
- result preview (for default parser)
- check abstracttext capabilities and learn
- defineCommand parser
- defineCommand writer
- defineCommand reload labelmap
- defineCommand set evaluator
- what about i18n of the commands?
- check if FUTURE_README and README align
- tests
-- tests for aliases
-- tests for delabeling other languages but english
-- more tests for tokenizing and parsing
- have several commands in one line, the last one counts, use of _ might make that interesting and readable
