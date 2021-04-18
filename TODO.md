next steps:

bug:
- normalization and canonicalization are both buggy, do
> { "Z1K1": { "Z1K1": "Z9", "Z9K1": "Z6" }, "Z6K1": "test" }
{ Z1K1: { Z1K1: 'Z9', Z9K1: 'Z6' }, Z6K1: 'test' }
> .normalize
{
  Z1K1: { Z1K1: 'Z9', Z9K1: 'Z6' },
  Z6K1: { Z1K1: 'Z6', Z6K1: 'test' }
}
> .canonicalize
{ Z1K1: 'Z6', Z6K1: 'test' }
> .canonicalize
'test'

replace canonicalization and normalization with code in function-schemata

then:
- labelize in the REPL, need with input too and underscore
- normalize in the REPL, need with input too, and underscore
- canonicalize in the REPL, as above
- prettyprint in the REPL (worry about Z2 envelope)
- full underscore implementation

then:
- checking levels
-- parses (JSON)
-- Wellformedness (simple wellformedness)
-- Conforming (all inalienable truths)
-- Linked (all ZIDs exist)
-- checkable (the Type has a validator)
-- valid (the validator returns no errrors)
- evaluate

furthermore:
- write a help message for --help
- rename master to main
- move repo to gerrit
- allow --config parameter
- defineCommand timer
- tests
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
