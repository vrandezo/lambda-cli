- the following things throw errors:
  [ Z10015, five ]
  [ positive integer, five ]
  [ positive integer, zero, five ]
  [ positive integer, add( positive integer<"2">, positive integer<"2"> ) ]
this works, though:
  [ positive integer, positive integer<"5"> ]

length of list([Z1, "a", "b"])
length of list([Z6, "a", "b"])

- the following should have been a "cannot delabel reference 'one'"
λ→ Z10058(zero, one)
Error
  error type: "expected closing"
  error value: [
  undefined
  K1: "ZSeparator"
  K2: "12"
  undefined
  K1: "ZSymbol"
  K2: "13"
  K3: "one"
  undefined
  K1: "ZCloseArg"
  K2: "17"
]
330 ms

next steps:
- typed list(string) - result looks wrong (bug in Wikilambda)
- typed pair(string, boolean)<"a", true> - works! but result looks wrong
- add tests for literal notation
- add documentation for literal notation
- check if generics work, re parsing, both functions and types
- full underscore implementation
- have a test dataset in test that is used for tests instead of the real
  data in function-schemata. Use this to also test several languages
- some way to show type declaration?

- tests
-- normalize
-- canonicalize
-- labelize
-- answer
-- format
-- evaluate
-- lambda
-- interactive
-- wellformed
-- prettyprint

- works a little:
-- wellformed

previous next steps:
-- parse / delabel / labelmap in load
- how to manage labelmap state in different languages and endpoints
- use search instead of labelmap for remote endpoints
- how to deal with caches against different endpoints
- what to do when more than one hit
- when switching .wiki, also delete the cache and the labelmap

then:
- prettyprint used to show the whole Persistentobject, not just the value,
  when asked for a ZID, should there be something like that?
- lambda from other directories has issues, check config.json starting with ./
- replace .reload with .clear
- .language should also use language codes, not just ZIDs
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
- introduce recoverable errors when the line is not complete
- allow JSON objects in syntax
- labelmap from website
- write a help message for --help
- move repo to gerrit
- rename master to main (will happen together with all other gerrit repos)
- allow --config parameter
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
- have several commands in one line, the last one counts,
  use of _ might make that interesting and readable
- tests
-- tests for aliases
-- tests for delabeling other languages but english
-- more tests for tokenizing and parsing
- dont show timer on command line usage
- extra empty line on normal evaluation
