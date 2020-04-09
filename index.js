const SQL = require("sqlstring");

/**
 * 
 * #### `const SQLUtils = require("sql-utils")`
 * 
 * @type Class
 * @description Class that contains the whole API of the package.
 * 
 */
class SQLUtils {

	static get OPERATORS_SQL() {
		return [
			"=",
			"<",
			"<=",
			">",
			">=",
			"<>",
			"in",
			"not in",
			"like",
			"not like",
		];
	}

	/**
	 * 
	 * ----
	 * 
	 * #### `SQLUtils.die(...args:any)`
	 * 
	 * @type Static method
	 * @description Prints by console whatever you pass, and kills the process.
	 * 
	 */
	static die(...args) {
		console.log(...args);
		console.log("********** program died *************");
		process.exit(0);
	}

	/**
	 * 
	 * ----
	 * 
	 * #### `SQLUtils.getPropertiesSQL(property:String|Any, table:String|Boolean)`
	 * 
	 * @type Static method
	 * @parameter
	 * @parameter  - `property:String|Any`. SQL column name. When it is not a string, it is returned directly.
	 * @parameter  - `table:String|Boolean`. Optional. SQL table name. When it is a falsy value, it is omitted.
	 * @return `sql:String`. SQL code to represent this column.
	 * @description Splits the property by `"."`, escaped as SQL ids every part, and prefixes with the name of the table, if any.
	 * 
	 */
	static getPropertiesSQL(prop, tableName = false) {
		if(typeof prop !== "string") {
			return prop;
		}
		const propParts = prop.split(".");
		return (propParts.length < 2 && tableName ? (SQL.escapeId(tableName) + ".") : "") + propParts.map(property => SQL.escapeId(property)).join(".")
	}

	/**
	 * 
	 * ----
	 * 
	 * #### `SQLUtils.generateToken(length:Integer, charset:Array)`
	 * 
	 * @type Static method
	 * @parameter
	 * @parameter  - `length:Integer`. Required. Number of characters for the token.
	 * @parameter  - `charset:Array<String>`. Optional. Valid characters for the token.
	 * @return `token:String`. Generated token.
	 * @description Returns a token from the pool of characters provided.
	 * 
	 */
	static generateToken(length = 255, charset = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789".split("")) {
		let index = 0, token = "";
		while(index < length) {
			index++;
			token += charset[Math.floor(Math.random() * charset.length)];
		}
		return token;
	}

	/**
	 * 
	 * ----
	 * 
	 * #### `SQLUtils.rowsToObject(rows:Array<Object>, table:String, columnId:String)`
	 * 
	 * @type Static method
	 * @parameter
	 * @parameter  - `rows:Array<Object>`. Required. Data in arrays of objects, where each object property is read like: `$table.$column`.
	 * @parameter  - `table:String`. Required. Table to extract the data from.
	 * @parameter  - `columnId:String`. Optional. Column to index all data rows by. By default: `"id"`.
	 * @return `formattedData:Array<Object>`. Data resulted from the operation.
	 * @description Returns an array of objects with the properties like `${table}.*` grouped by the rows that have the same `columnId`.
	 * 
	 */
	static rowsToObject(rows, table, columnId = "id") {
		const ids = [];
		const objs = []
		const column = table + "." + columnId;
		let otherColumns = null;
		rows.forEach(row => {
			if (ids.indexOf(row[column]) === -1) {
				ids.push(row[column]);
				if (otherColumns === null) {
					otherColumns = Object.keys(row).filter(aColumn => aColumn.startsWith(table + "."));
				}
				const product = otherColumns.reduce((output = {}, otherColumn) => {
					output[otherColumn.replace(table + ".", "")] = row[otherColumn];
					return output;
				}, {});
				if(product.id !== null) {
					objs.push(product);
				}
			}
		});
		return objs;
	}

	/**
	 * 
	 * ----
	 * 
	 * #### `SQLUtils.whereToSQL(where:Array|Object, table:String, andPrefix:Boolean, defaultValue:String)`
	 * 
	 * @type Static method
	 * @parameter
	 * @parameter  - `where:Object|Array`. Required. As object, it must contain the properties (columns) and the expected values. As array, it must contain arrays of 2 or 3 items: subject and object, or subject, operator and object respectively.
	 * @parameter  - `table:String`. Optional. Table used to prefix the properties in this `where` statement part. By default: `false`.
	 * @parameter  - `andPrefix:Boolean`. Optional. If `true`, a ` AND ` will prefix the generated code. By default: `false`.
	 * @parameter  - `defaultValue:String`. Required. Column to index all data rows by. By default: `"1 = 1"`.
	 * @return `sql:String`. SQL code that represents this partial `WHERE` statement.
	 * @description Returns SQL code to represent a specific `WHERE` statement part.
	 * 
	 */
	static whereToSQL(whereConditionsParameter = [], tableName = false, prefixAnd = false, defaultValueWhenNoConditions = "1 = 1") {
		let sql = "";
		let whereConditions = [];
		// 1. Flat array or expulse:
		if(Array.isArray(whereConditionsParameter)) {
			// @OK
			whereConditions = whereConditionsParameter;
		} else if(typeof whereConditionsParameter === "object") {
			const properties = Object.keys(whereConditionsParameter);
			if(properties.length !== 0) {
				properties.forEach(prop => {
					const value = whereConditionsParameter[prop];
					whereConditions.push([prop, "=", value]);
				});
			}
		} else {
			throw new Error("Argument 1 must be an object or an array to <whereToSQL>");
		}
		whereConditions.forEach((whereCondition, whereIndex) => {
			if(whereIndex !== 0) {
				sql += "\nAND ";
			}
			let condition = [];
			if(typeof whereCondition === "string") {
				sql += whereCondition;
				return;
			} else if(!Array.isArray(whereCondition)) {
				throw new Error("Required <whereRule> to be an array");
			} else if(whereCondition.length === 2) {
				condition = [ whereCondition[0], "=", whereCondition[1] ];
			} else if(whereCondition.length === 3) {
				condition = whereCondition;
			} else {
				throw new Error("Required <whereRule> to be an array of 2-3 items");
			}
			if(typeof condition[0] !== "string") {
				throw new Error("Argument 1 (subject) in <whereRule> must be a string");
			}
			if(typeof condition[1] !== "string") {
				throw new Error("Argument 2 (operator) in <whereRule> must be a string");
			}
			const subject = this.getPropertiesSQL(condition[0], tableName);
			const operator = condition[1];
			const object = condition[2];
			if(this.OPERATORS_SQL.indexOf(operator) === -1) {
				throw new Error("Argument 2 of a <whereCondition> must be one of: " + this.OPERATORS_SQL.join(" | ") + " but <" + operator + "> was found to <whereToSQL>");
			}
			sql += subject + " " + operator.toUpperCase() + " ";
			if((operator === "in" || operator === "not in") && Array.isArray(object)) {
				sql += "(";
				object.forEach((subobject, index) => {
					if(index !== 0) {
						sql += ", " + SQL.escape(subobject);
					} else {
						sql += SQL.escape(subobject);
					}
				}); 
				sql += ")";
			} else {
				sql += SQL.escape(object);
			}
		});
		if(sql === "") {
			sql = defaultValueWhenNoConditions;
		}
		if(prefixAnd) {
			sql = " AND " + sql;
		}
		return sql;
	}

};

module.exports = SQLUtils;