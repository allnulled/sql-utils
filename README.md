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

## API

------



#### `const SQLUtils = require("sql-utils")`



**Type**:  Class


**Description**:  Class that contains the whole API of the package.




----

#### `SQLUtils.die(...args:any)`



**Type**:  Static method


**Description**:  Prints by console whatever you pass, and kills the process.




----

#### `SQLUtils.getPropertiesSQL(property:String|Any, table:String|Boolean)`



**Type**:  Static method


**Parameter**: 


  - `property:String|Any`. SQL column name. When it is not a string, it is returned directly.


  - `table:String|Boolean`. Optional. SQL table name. When it is a falsy value, it is omitted.


**Return**:  `sql:String`. SQL code to represent this column.


**Description**:  Splits the property by `"."`, escaped as SQL ids every part, and prefixes with the name of the table, if any.




----

#### `SQLUtils.generateToken(length:Integer, charset:Array)`



**Type**:  Static method


**Parameter**: 


  - `length:Integer`. Required. Number of characters for the token.


  - `charset:Array<String>`. Optional. Valid characters for the token.


**Return**:  `token:String`. Generated token.


**Description**:  Returns a token from the pool of characters provided.




----

#### `SQLUtils.rowsToObject(rows:Array<Object>, table:String, columnId:String)`



**Type**:  Static method


**Parameter**: 


  - `rows:Array<Object>`. Required. Data in arrays of objects, where each object property is read like: `$table.$column`.


  - `table:String`. Required. Table to extract the data from.


  - `columnId:String`. Optional. Column to index all data rows by. By default: `"id"`.


**Return**:  `formattedData:Array<Object>`. Data resulted from the operation.


**Description**:  Returns an array of objects with the properties like `${table}.*` grouped by the rows that have the same `columnId`.




----

#### `SQLUtils.whereToSQL(where:Array|Object, table:String, andPrefix:Boolean, defaultValue:String)`



**Type**:  Static method


**Parameter**: 


  - `where:Object|Array`. Required. As object, it must contain the properties (columns) and the expected values. As array, it must contain arrays of 2 or 3 items: subject and object, or subject, operator and object respectively.


  - `table:String`. Optional. Table used to prefix the properties in this `where` statement part. By default: `false`.


  - `andPrefix:Boolean`. Optional. If `true`, a ` AND ` will prefix the generated code. By default: `false`.


  - `defaultValue:String`. Required. Column to index all data rows by. By default: `"1 = 1"`.


**Return**:  `sql:String`. SQL code that represents this partial `WHERE` statement.


**Description**:  Returns SQL code to represent a specific `WHERE` statement part.





------

## License

This project is under [WTFPL](https://es.wikipedia.org/wiki/WTFPL), which means basically: *do What The Fuck you want with it*.

## Contact

Please, address issues and suggestions [here](https://github.com/allnulled/sql-utils/issues). Thank you.

