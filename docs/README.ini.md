# sql-utils

Various SQL utilities for Node.js

## Installation

`$ npm i -s @allnulled/sql-utils`

## Usage

```js
const SQLUtils = require("sql-utils");
const whereSQL = SQLUtils.whereToSQL({
	name: "somename",
	password: "somepassword"
});
const query = `SELECT * FROM user WHERE ${whereSQL}`;
```

### `whereToSQL` function

`SQLUtils.whereToSQL(...)` allows to obtain SQL `WHERE` expressions from:

   - `Object`: where each property is a column, and each value, a `SQL` (escaped) value.
   - `Array`: where each item represents:
       - *2 values*: SQL column and value, bound by `=`
       - *3 values*: SQL column, SQL logic operators, and value
   - `String`: inline `SQL` injections are allowed by the framework, to fully customize what is going on `WHERE` SQL expressions.

This function also allows you to use `in` and `not in` operators with `Arrays` of values (that will be safely escaped).

## API

------

