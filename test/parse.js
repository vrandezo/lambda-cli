'use strict';

const c = require('./../src/constants.js').constants;
const parse = require('../src/parse.js');

QUnit.module('parse');

QUnit.test('tokenize symbol', (assert) => {
  assert.deepEqual(
    parse.tokenize('symbol'),
    [
      {
        [c.ObjectType]: c.Token,
        [c.TokenType]: 'ZSymbol',
        [c.TokenPosition]: '1',
        [c.TokenValue]: 'symbol'
      }
    ]
  );
});

QUnit.test('tokenize   symbol', (assert) => {
  assert.deepEqual(
    parse.tokenize('  symbol'),
    [
      {
        [c.ObjectType]: c.Token,
        [c.TokenType]: 'ZSymbol',
        [c.TokenPosition]: '1',  // TODO: should that be 3?
        [c.TokenValue]: 'symbol'
      }
    ]
  );
});

QUnit.test('tokenize symbol ', (assert) => {
  assert.deepEqual(
    parse.tokenize('symbol '),
    [
      {
        [c.ObjectType]: c.Token,
        [c.TokenType]: 'ZSymbol',
        [c.TokenPosition]: '1',
        [c.TokenValue]: 'symbol'
      }
    ]
  );
});

QUnit.test('tokenize "string""', (assert) => {
  assert.deepEqual(
    parse.tokenize('"string"'),
    [
      {
        [c.ObjectType]: c.Token,
        [c.TokenType]: 'ZString',
        [c.TokenPosition]: '1',
        [c.TokenValue]: 'string'
      }
    ]
  );
});

QUnit.test('tokenize "st ring""', (assert) => {
  assert.deepEqual(
    parse.tokenize('"st ring"'),
    [
      {
        [c.ObjectType]: c.Token,
        [c.TokenType]: 'ZString',
        [c.TokenPosition]: '1',
        [c.TokenValue]: 'st ring'
      }
    ]
  );
});

QUnit.test('tokenize Z4', (assert) => {
  assert.deepEqual(
    parse.tokenize('Z4'),
    [
      {
        [c.ObjectType]: c.Token,
        [c.TokenType]: 'ZSymbol',
        [c.TokenPosition]: '1',
        [c.TokenValue]: 'Z4'
      }
    ]
  );
});

QUnit.test('tokenize Z801("string")', (assert) => {
  assert.deepEqual(
    parse.tokenize('Z801("string")'),
    [
      {
        [c.ObjectType]: c.Token,
        [c.TokenType]: 'ZSymbol',
        [c.TokenPosition]: '1',
        [c.TokenValue]: 'Z801'
      },
      {
        [c.ObjectType]: c.Token,
        [c.TokenType]: 'ZOpenArg',
        [c.TokenPosition]: '5'
      },
      {
        [c.ObjectType]: c.Token,
        [c.TokenType]: 'ZString',
        [c.TokenPosition]: '6',
        [c.TokenValue]: 'string'
      },
      {
        [c.ObjectType]: c.Token,
        [c.TokenType]: 'ZCloseArg',
        [c.TokenPosition]: '14'
      }
    ]
  );
});

QUnit.test('tokenize if(true, false, true)', (assert) => {
  assert.deepEqual(
    parse.tokenize('if(true, false, true)'),
    [
      {
        [c.ObjectType]: c.Token,
        [c.TokenType]: 'ZSymbol',
        [c.TokenPosition]: '1',
        [c.TokenValue]: 'if'
      },
      {
        [c.ObjectType]: c.Token,
        [c.TokenType]: 'ZOpenArg',
        [c.TokenPosition]: '3'
      },
      {
        [c.ObjectType]: c.Token,
        [c.TokenType]: 'ZSymbol',
        [c.TokenPosition]: '4',
        [c.TokenValue]: 'true'
      },
      {
        [c.ObjectType]: c.Token,
        [c.TokenType]: 'ZSeparator',
        [c.TokenPosition]: '8'
      },
      {
        [c.ObjectType]: c.Token,
        [c.TokenType]: 'ZSymbol',
        [c.TokenPosition]: '9',
        [c.TokenValue]: 'false'
      },
      {
        [c.ObjectType]: c.Token,
        [c.TokenType]: 'ZSeparator',
        [c.TokenPosition]: '15'
      },
      {
        [c.ObjectType]: c.Token,
        [c.TokenType]: 'ZSymbol',
        [c.TokenPosition]: '16',
        [c.TokenValue]: 'true'
      },
      {
        [c.ObjectType]: c.Token,
        [c.TokenType]: 'ZCloseArg',
        [c.TokenPosition]: '21'
      }
    ]
  );
});

QUnit.test('tokenize if(true ,false, true )', (assert) => {
  assert.deepEqual(
    parse.tokenize('if(true ,false, true )'),
    [
      {
        [c.ObjectType]: c.Token,
        [c.TokenType]: 'ZSymbol',
        [c.TokenPosition]: '1',
        [c.TokenValue]: 'if'
      },
      {
        [c.ObjectType]: c.Token,
        [c.TokenType]: 'ZOpenArg',
        [c.TokenPosition]: '3'
      },
      {
        [c.ObjectType]: c.Token,
        [c.TokenType]: 'ZSymbol',
        [c.TokenPosition]: '4',
        [c.TokenValue]: 'true'
      },
      {
        [c.ObjectType]: c.Token,
        [c.TokenType]: 'ZSeparator',
        [c.TokenPosition]: '9'
      },
      {
        [c.ObjectType]: c.Token,
        [c.TokenType]: 'ZSymbol',
        [c.TokenPosition]: '10',
        [c.TokenValue]: 'false'
      },
      {
        [c.ObjectType]: c.Token,
        [c.TokenType]: 'ZSeparator',
        [c.TokenPosition]: '15'
      },
      {
        [c.ObjectType]: c.Token,
        [c.TokenType]: 'ZSymbol',
        [c.TokenPosition]: '16',
        [c.TokenValue]: 'true'
      },
      {
        [c.ObjectType]: c.Token,
        [c.TokenType]: 'ZCloseArg',
        [c.TokenPosition]: '22'
      }
    ]
  );
});

QUnit.test('tokenize []', (assert) => {
  assert.deepEqual(
    parse.tokenize('[]'),
    [
      {
        [c.ObjectType]: c.Token,
        [c.TokenType]: 'ZOpenList',
        [c.TokenPosition]: '1'
      },
      {
        [c.ObjectType]: c.Token,
        [c.TokenType]: 'ZCloseList',
        [c.TokenPosition]: '2'
      }
    ]
  );
});

QUnit.test('tokenize [one]', (assert) => {
  assert.deepEqual(
    parse.tokenize('[one]'),
    [
      {
        [c.ObjectType]: c.Token,
        [c.TokenType]: 'ZOpenList',
        [c.TokenPosition]: '1'
      },
      {
        [c.ObjectType]: c.Token,
        [c.TokenType]: 'ZSymbol',
        [c.TokenPosition]: '2',
        [c.TokenValue]: 'one'
      },
      {
        [c.ObjectType]: c.Token,
        [c.TokenType]: 'ZCloseList',
        [c.TokenPosition]: '5'
      }
    ]
  );
});

QUnit.test('tokenize [one, two]', (assert) => {
  assert.deepEqual(
    parse.tokenize('[one, two]'),
    [
      {
        [c.ObjectType]: c.Token,
        [c.TokenType]: 'ZOpenList',
        [c.TokenPosition]: '1'
      },
      {
        [c.ObjectType]: c.Token,
        [c.TokenType]: 'ZSymbol',
        [c.TokenPosition]: '2',
        [c.TokenValue]: 'one'
      },
      {
        [c.ObjectType]: c.Token,
        [c.TokenType]: 'ZSeparator',
        [c.TokenPosition]: '5'
      },
      {
        [c.ObjectType]: c.Token,
        [c.TokenType]: 'ZSymbol',
        [c.TokenPosition]: '6',
        [c.TokenValue]: 'two'
      },
      {
        [c.ObjectType]: c.Token,
        [c.TokenType]: 'ZCloseList',
        [c.TokenPosition]: '10'
      }
    ]
  );
});

QUnit.test('tokenize Z801(one, [two, "string"], f(Z42))', (assert) => {
  assert.deepEqual(
    parse.tokenize('Z801(one, [two, "string"], f(Z42))'),
    [
      {
        [c.ObjectType]: c.Token,
        [c.TokenType]: 'ZSymbol',
        [c.TokenPosition]: '1',
        [c.TokenValue]: 'Z801'
      },
      {
        [c.ObjectType]: c.Token,
        [c.TokenType]: 'ZOpenArg',
        [c.TokenPosition]: '5'
      },
      {
        [c.ObjectType]: c.Token,
        [c.TokenType]: 'ZSymbol',
        [c.TokenPosition]: '6',
        [c.TokenValue]: 'one'
      },
      {
        [c.ObjectType]: c.Token,
        [c.TokenType]: 'ZSeparator',
        [c.TokenPosition]: '9'
      },
      {
        [c.ObjectType]: c.Token,
        [c.TokenType]: 'ZOpenList',
        [c.TokenPosition]: '10'
      },
      {
        [c.ObjectType]: c.Token,
        [c.TokenType]: 'ZSymbol',
        [c.TokenPosition]: '12',
        [c.TokenValue]: 'two'
      },
      {
        [c.ObjectType]: c.Token,
        [c.TokenType]: 'ZSeparator',
        [c.TokenPosition]: '15'
      },
      {
        [c.ObjectType]: c.Token,
        [c.TokenType]: 'ZString',
        [c.TokenPosition]: '16',
        [c.TokenValue]: 'string'
      },
      {
        [c.ObjectType]: c.Token,
        [c.TokenType]: 'ZCloseList',
        [c.TokenPosition]: '25'
      },
      {
        [c.ObjectType]: c.Token,
        [c.TokenType]: 'ZSeparator',
        [c.TokenPosition]: '26'
      },
      {
        [c.ObjectType]: c.Token,
        [c.TokenType]: 'ZSymbol',
        [c.TokenPosition]: '27',
        [c.TokenValue]: 'f'
      },
      {
        [c.ObjectType]: c.Token,
        [c.TokenType]: 'ZOpenArg',
        [c.TokenPosition]: '29'
      },
      {
        [c.ObjectType]: c.Token,
        [c.TokenType]: 'ZSymbol',
        [c.TokenPosition]: '30',
        [c.TokenValue]: 'Z42'
      },
      {
        [c.ObjectType]: c.Token,
        [c.TokenType]: 'ZCloseArg',
        [c.TokenPosition]: '33'
      },
      {
        [c.ObjectType]: c.Token,
        [c.TokenType]: 'ZCloseArg',
        [c.TokenPosition]: '34'
      }
    ]
  );
});

QUnit.test('parse "test"', async (assert) => {
  assert.deepEqual(
    await parse.parseAsync('"test"'),
    {
      [c.ObjectType]: c.String,
      [c.StringValue]: 'test'
    }
  );
});

QUnit.test('parse "Z4"', async (assert) => {
  assert.deepEqual(
    await parse.parseAsync('"Z4"'),
    {
      [c.ObjectType]: c.String,
      [c.StringValue]: 'Z4'
    }
  );
});
