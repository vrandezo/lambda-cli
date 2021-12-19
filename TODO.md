next steps:
- figure out what works what doesn't
- all from scratch
- works: config, lambda, interactive
- does not work:
-- labelize??
-- canonicalize
-- normalize
-- prettyprint

-- parse
-- delabel
-- evaluate
-- wellformed
-- labelmap in load

previous next steps:
- how to manage labelmap state in different languages and endpoints
- use search instead of labelmap for remote endpoints
- how to deal with caches against different endpoints
- what to do when more than one hit

- evaluation
-- cannot choose the orchestrator endpoint yet
-- uses http only. should choose depending on protocol.
-- same for loading data, should switch

then:
- command for label/delabel single ZID / name / ZKID
- checking levels
-- parses (JSON)
-- Wellformedness (simple wellformedness)
-- Conforming (all inalienable truths)
-- Linked (all ZIDs exist)
-- checkable (the Type has a validator)
-- valid (the validator returns no errrors)

bug:
> { "Z1K1": "Z7", "Z7K1": "Hello" }
{ Z1K1: 'Z7', Z7K1: 'Hello' }
- should be an errormessage

bug:
> { "Z1K1": "Z7", "Z7K1": "Z802" }
{
  Z1K1: 'Z5',
  Z5K1: {
    Z1K1: 'Z416',
    Z416K1: 'No value for supplied for declared argument Z802K1'
  }
}
- the ZID is wrong and the errortype is wrongly used

bug:
> { "Z1K1": "Z7", "Z7K1": "Z802", "Z802K1": "Z41", "Z802K2": "this", "Z802K3": "that" }
{
  Z1K1: 'Z7',
  Z7K1: 'Z802',
  Z802K1: 'Z41',
  Z802K2: 'this',
  Z802K3: 'that'
}
- should return "this", see the following:

> { "Z1K1": "Z7", "Z7K1": "Z802", "Z802K1": { "Z1K1": "Z40", "Z40K1": "Z41" }, "Z802K2": "this", "Z802K3": "that" }
{ Z1K1: 'Z6', Z6K1: 'this' }

bug:
- normalization and canonicalization are both buggy, do
> { "Z1K1": { "Z1K1": "Z9", "Z9K1": "Z6" }, "Z6K1": "test" }
> .canonicalize
throws error
(probably because the input is not wellformed, and we yet don't check for
wellformedness, so let's check if that still happens once the checking levels
are implemented)

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
