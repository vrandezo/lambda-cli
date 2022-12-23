next steps:
- the following things throw errors:
  [ Z10015, five ]
  [] (should be an error, it should be [ Z1 ])
  [ positive integer, zero, five ]
  [ Italian, "b" ] (should be an error, should be [ Z1, Italian, "b" ])
  [ Z6, "a", "b" ]

length of list([Z1, "a", "b"])
length of list([Z6, "a", "b"])

λ→ .canonicalize [Z6, "a"]
[
  {
    "Z1K1": "Z4",
    "Z4K1": "Z6",
    "Z4K2": [
      "Z3",
      {
        "Z1K1": "Z3",
        "Z3K1": "Z6",
        "Z3K2": "Z6K1",
        "Z3K3": {
          "Z1K1": "Z12",
          "Z12K1": [
            "Z11",
            {
              "Z1K1": "Z11",
              "Z11K1": "Z1002",
              "Z11K2": "value"
            }
          ]
        }
      }
    ],
    "Z4K3": "Z106"
  },
  "a"
]
658 ms
λ→ .normalize [Z6, "a"]
{
  "Z1K1": {
    "Z1K1": "Z9",
    "Z9K1": "Z10"
  },
  "Z10K1": {
    "Z1K1": {
      "Z1K1": "Z9",
      "Z9K1": "Z4"
    },
    "Z4K1": {
      "Z1K1": "Z9",
      "Z9K1": "Z6"
    },
    "Z4K2": {
      "Z1K1": {
        "Z1K1": "Z9",
        "Z9K1": "Z10"
      },
      "Z10K1": {
        "Z1K1": "Z9",
        "Z9K1": "Z3"
      },
      "Z10K2": {
        "Z1K1": {
          "Z1K1": "Z9",
          "Z9K1": "Z10"
        },
        "Z10K1": {
          "Z1K1": {
            "Z1K1": "Z9",
            "Z9K1": "Z3"
          },
          "Z3K1": {
            "Z1K1": "Z9",
            "Z9K1": "Z6"
          },
          "Z3K2": {
            "Z1K1": "Z6",
            "Z6K1": "Z6K1"
          },
          "Z3K3": {
            "Z1K1": {
              "Z1K1": "Z9",
              "Z9K1": "Z12"
            },
            "Z12K1": {
              "Z1K1": {
                "Z1K1": "Z9",
                "Z9K1": "Z10"
              },
              "Z10K1": {
                "Z1K1": "Z9",
                "Z9K1": "Z11"
              },
              "Z10K2": {
                "Z1K1": {
                  "Z1K1": "Z9",
                  "Z9K1": "Z10"
                },
                "Z10K1": {
                  "Z1K1": {
                    "Z1K1": "Z9",
                    "Z9K1": "Z11"
                  },
                  "Z11K1": {
                    "Z1K1": "Z9",
                    "Z9K1": "Z1002"
                  },
                  "Z11K2": {
                    "Z1K1": "Z6",
                    "Z6K1": "value"
                  }
                },
                "Z10K2": {
                  "Z1K1": {
                    "Z1K1": "Z9",
                    "Z9K1": "Z10"
                  }
                }
              }
            }
          }
        },
        "Z10K2": {
          "Z1K1": {
            "Z1K1": "Z9",
            "Z9K1": "Z10"
          }
        }
      }
    },
    "Z4K3": {
      "Z1K1": "Z9",
      "Z9K1": "Z106"
    }
  },
  "Z10K2": {
    "Z1K1": {
      "Z1K1": "Z9",
      "Z9K1": "Z10"
    },
    "Z10K1": {
      "Z1K1": "Z6",
      "Z6K1": "a"
    },
    "Z10K2": {
      "Z1K1": {
        "Z1K1": "Z9",
        "Z9K1": "Z10"
      }
    }
  }
}
669 ms
λ→ [Z6, "a"]
[
  Type: String
  String: null
  "a"
]
680 ms

λ→ .ast
[
  {
    "Z1K1": "Z9",
    "Z9K1": "Z6"
  },
  {
    "Z1K1": "Z6",
    "Z6K1": "a"
  }
]

That is wrong. My guess is that the parsin of lists is wrong: [Z6, "a"] is read as given directly above, but it should be

Typed list(Z6)<["a"]>

That is probably an error in the list parser in the CLI.

- formatter should be Positive integer<"2"> not Positive integer / value: "2"

  funny formatting

  string to list("abc")
  Typed list(string)


next steps:
- why is boolean equality not defined on two booleans? (bug in wikilambda)
- typed list(string) - result looks wrong (bug in Wikilambda)
- typed pair(string, boolean)<"a", true> - works! but result looks wrong
- add tests for literal notation
- add documentation for literal notation
- check if generics work, re parsing, both functions and types
- full underscore implementation
- have a test dataset in test that is used for tests instead of the real
  data in function-schemata. Use this to also test several languages

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
