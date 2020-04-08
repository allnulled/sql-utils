# sql-utils

Various SQL utilities for Node.js

## Installation

`$ npm i -s sql-utils`

## Usage

```js
const SQLUtils = require("sql-utils");
const whereSQL = SQLUtils.whereToSQL({
	name: "somename",
	password: "somepassword"
});
const query = `SELECT * FROM user WHERE ${whereSQL}`;
```

## API

------

