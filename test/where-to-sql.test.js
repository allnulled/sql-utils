const { expect } = require("chai");
const pkg = require(__dirname + "/../package.json");
const SQLUtils = require(__dirname + "/../" + pkg.main);

describe("SQLUtils.whereToSQL(...)", function() {
	
	this.timeout(1000 * 2);

	it("can work with empty objects", function() {
		const out = SQLUtils.whereToSQL({});
		expect(out).to.equal("1 = 1");
	});

	it("can work with empty arrays", function() {
		const out = SQLUtils.whereToSQL([]);
		expect(out).to.equal("1 = 1");
	});

	it("can work with objects", function() {
		const out = SQLUtils.whereToSQL({
			name: "my name",
			age: 30
		});
		expect(out).to.equal("`name` = 'my name'\nAND `age` = 30");
	});

	it("can work with arrays", function() {
		const out = SQLUtils.whereToSQL([
			["name", "=", "my name"],
			["age", "=", 30]
		]);
		expect(out).to.equal("`name` = 'my name'\nAND `age` = 30");
		const out2 = SQLUtils.whereToSQL([
			["name", "my name"],
			["age", 30]
		]);
		expect(out).to.equal("`name` = 'my name'\nAND `age` = 30");
	});

	it("can work with a prefixed table name", function() {
		const out = SQLUtils.whereToSQL([
			["name", "=", "my name"],
			["age", "=", 30]
		], "mytable");
		expect(out).to.equal("`mytable`.`name` = 'my name'\nAND `mytable`.`age` = 30");
	});

	it("can work prefixing an AND", function() {
		const out = SQLUtils.whereToSQL([
			["name", "=", "my name"],
			["age", "=", 30]
		], "mytable", true);
		expect(out).to.equal(" AND `mytable`.`name` = 'my name'\nAND `mytable`.`age` = 30");
	});

	it("can work with IN and NOT IN operators", function() {
		const out = SQLUtils.whereToSQL([
			["name", "in", ["my name", "your name"]],
			["age", "not in", ["my name", "your name"]]
		], "mytable", true);
		expect(out).to.equal(" AND `mytable`.`name` IN ('my name', 'your name')\nAND `mytable`.`age` NOT IN ('my name', 'your name')");
	});

	it("can format standard sql output", function() {
		const out = SQLUtils.rowsToObject([
			{"user.name": "name 1", "user.data": "data 1"},
			{"user.name": "name 2", "user.data": "data 2"},
			{"user.name": "name 3", "user.data": "data 3"},
			{"user.name": "name 4", "user.data": "data 4"},
			{"user.name": "name 5", "user.data": "data 5"},
		], "user", "name");
		expect(out).to.deep.equal([
			{ name: "name 1", data: "data 1" },
			{ name: "name 2", data: "data 2" },
			{ name: "name 3", data: "data 3" },
			{ name: "name 4", data: "data 4" },
			{ name: "name 5", data: "data 5" }
		]);
	});

	it("can generate random tokens", function() {
		const token = SQLUtils.generateToken(10);
		expect(token.length).to.equal(10);
	})

});