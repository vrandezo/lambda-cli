next steps:
- fill package.json
- tests
-- config
-- load
-- delabel
-- parse
-- canonicalize
-- evaluate
-- interactive
-- labelize
-- lambda
-- normalize
-- prettyprint
-- wellformed
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
- command for label/delabel single ZID / name / ZKID
- tests
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
- allow JSON objects in syntax
- labelmap from website
- write a help message for --help
- move repo to gerrit
- rename master to main (will happen together with all other gerrit repos)
- allow --config parameter
- defineCommand timer
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
