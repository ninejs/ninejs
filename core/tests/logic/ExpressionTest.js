'use strict';

var Expression = require('../../logic/Expression'),
	objUtils = require('../../objUtils'),
	expect = require('chai').expect;
function check(done, f) {
	try {
		f();
		done();
	} catch(e) {
		done(e);
	}
}

/* global describe, it */
describe('core/logic/Expression', function () {
	describe('-> defining expressions', function () {
		it('should define a simple expression', function (done) {
			var e = new Expression();
			e.fromJson({
				sourceField: 'name',
				operator: 'equals',
				target: 'Amanda'
			});
			check(done, function() {
				expect(e.toString()).to.equal('[name] Equals \'Amanda\'');
			});
		});
		it('should define a composite expression', function (done) {
			var e = new Expression();
			e.fromJson({
				operator: 'and',
				expressionList:[
					{
						sourceField: 'name',
						operator: 'equals',
						target: 'Amanda'
					},
					{
						sourceField: 'lastName',
						operator: 'equals',
						target: 'Burgos'
					},
					{
						sourceField: 'age',
						operator: 'greaterThan',
						target: 1
					}
				]
			});
			check(done, function() {
				expect(e.toString()).to.equal('([name] Equals \'Amanda\') AND ([lastName] Equals \'Burgos\') AND ([age] Greater than 1)');
			});
		});
		it('should output involved sources', function (done) {
			var e = new Expression();
			e.fromJson({
				operator: 'and',
				expressionList:[
					{
						sourceField: 'name',
						operator: 'equals',
						target: 'Amanda'
					},
					{
						sourceField: 'lastName',
						operator: 'equals',
						target: 'Burgos'
					},
					{
						sourceField: 'age',
						operator: 'greaterThan',
						target: 1
					}
				]
			});
			check(done, function() {
				expect(e.get('involvedSources')).to.deep.equal(['name', 'lastName', 'age']);
			});
		});
	});
	describe('-> evaluation', function () {
		it('should evaluate a simple expression', function (done) {
			var e = new Expression();
			e.fromJson({
				sourceField: 'name',
				operator: 'equals',
				target: 'Amanda'
			});
			var data = {
				name: 'Amanda'
			};
			check(done, function() {
				expect(e.evaluate(data)).to.equal(true);
			});
		});
		it('should evaluate equals operator', function (done) {
			var e = new Expression();
			e.fromJson({
				sourceField: 'name',
				operator: 'equals',
				target: 'Amanda'
			});
			var data = {
				name: 'Amanda'
			};
			check(done, function() {
				expect(e.evaluate(data)).to.equal(true);
			});
		});
		it('should evaluate false equals operator', function (done) {
			var e = new Expression();
			e.fromJson({
				sourceField: 'name',
				operator: 'equals',
				target: 'Amandax'
			});
			var data = {
				name: 'Amanda'
			};
			check(done, function() {
				expect(e.evaluate(data)).to.equal(false);
			});
		});
		it('should evaluate notEquals operator', function (done) {
			var e = new Expression();
			e.fromJson({
				sourceField: 'name',
				operator: 'notEquals',
				target: 'Eduardo'
			});
			var data = {
				name: 'Amanda'
			};
			check(done, function() {
				expect(e.evaluate(data)).to.equal(true);
			});
		});
		it('should evaluate false notEquals operator', function (done) {
			var e = new Expression();
			e.fromJson({
				sourceField: 'name',
				operator: 'notEquals',
				target: 'Eduardo'
			});
			var data = {
				name: 'Eduardo'
			};
			check(done, function() {
				expect(e.evaluate(data)).to.equal(false);
			});
		});
		it('should evaluate greaterThan operator', function (done) {
			var e = new Expression();
			e.fromJson({
				sourceField: 'age',
				operator: 'greaterThan',
				target: 1
			});
			var data = {
				age: 2
			};
			check(done, function() {
				expect(e.evaluate(data)).to.equal(true);
			});
		});
		it('should evaluate false greaterThan operator', function (done) {
			var e = new Expression();
			e.fromJson({
				sourceField: 'age',
				operator: 'greaterThan',
				target: 1
			});
			var data = {
				age: 0
			};
			check(done, function() {
				expect(e.evaluate(data)).to.equal(false);
			});
		});
		it('should evaluate false greaterThan operator 2', function (done) {
			var e = new Expression();
			e.fromJson({
				sourceField: 'age',
				operator: 'greaterThan',
				target: 1
			});
			var data = {
				age: 1
			};
			check(done, function() {
				expect(e.evaluate(data)).to.equal(false);
			});
		});
		it('should evaluate greaterThanOrEquals operator', function (done) {
			var e = new Expression();
			e.fromJson({
				sourceField: 'age',
				operator: 'greaterThanOrEquals',
				target: 2
			});
			var data = {
				age: 2
			};
			check(done, function() {
				expect(e.evaluate(data)).to.equal(true);
			});
		});
		it('should evaluate greaterThanOrEquals operator 2', function (done) {
			var e = new Expression();
			e.fromJson({
				sourceField: 'age',
				operator: 'greaterThanOrEquals',
				target: 2
			});
			var data = {
				age: 3
			};
			check(done, function() {
				expect(e.evaluate(data)).to.equal(true);
			});
		});
		it('should evaluate false greaterThanOrEquals operator', function (done) {
			var e = new Expression();
			e.fromJson({
				sourceField: 'age',
				operator: 'greaterThanOrEquals',
				target: 2
			});
			var data = {
				age: 1
			};
			check(done, function() {
				expect(e.evaluate(data)).to.equal(false);
			});
		});
		it('should evaluate lessThan operator', function (done) {
			var e = new Expression();
			e.fromJson({
				sourceField: 'age',
				operator: 'lessThan',
				target: 2
			});
			var data = {
				age: 1
			};
			check(done, function() {
				expect(e.evaluate(data)).to.equal(true);
			});
		});
		it('should evaluate false lessThan operator', function (done) {
			var e = new Expression();
			e.fromJson({
				sourceField: 'age',
				operator: 'lessThan',
				target: 2
			});
			var data = {
				age: 3
			};
			check(done, function() {
				expect(e.evaluate(data)).to.equal(false);
			});
		});
		it('should evaluate false lessThan operator 2', function (done) {
			var e = new Expression();
			e.fromJson({
				sourceField: 'age',
				operator: 'lessThan',
				target: 2
			});
			var data = {
				age: 2
			};
			check(done, function() {
				expect(e.evaluate(data)).to.equal(false);
			});
		});
		it('should evaluate lessThanOrEquals operator', function (done) {
			var e = new Expression();
			e.fromJson({
				sourceField: 'age',
				operator: 'lessThanOrEquals',
				target: 2
			});
			var data = {
				age: 2
			};
			check(done, function() {
				expect(e.evaluate(data)).to.equal(true);
			});
		});
		it('should evaluate lessThanOrEquals operator 2', function (done) {
			var e = new Expression();
			e.fromJson({
				sourceField: 'age',
				operator: 'lessThanOrEquals',
				target: 2
			});
			var data = {
				age: 1
			};
			check(done, function() {
				expect(e.evaluate(data)).to.equal(true);
			});
		});
		it('should evaluate false lessThanOrEquals operator', function (done) {
			var e = new Expression();
			e.fromJson({
				sourceField: 'age',
				operator: 'lessThanOrEquals',
				target: 2
			});
			var data = {
				age: 3
			};
			check(done, function() {
				expect(e.evaluate(data)).to.equal(false);
			});
		});
		it('should evaluate contains operator', function (done) {
			var e = new Expression();
			e.fromJson({
				sourceField: 'name',
				operator: 'contains',
				target: 'Valentina'
			});
			var data = {
				name: 'Amanda Valentina Burgos'
			};
			check(done, function() {
				expect(e.evaluate(data)).to.equal(true);
			});
		});
		it('should evaluate false contains operator', function (done) {
			var e = new Expression();
			e.fromJson({
				sourceField: 'name',
				operator: 'contains',
				target: 'Valentinax'
			});
			var data = {
				name: 'Amanda Valentina Burgos'
			};
			check(done, function() {
				expect(e.evaluate(data)).to.equal(false);
			});
		});
		it('should evaluate startsWith operator', function (done) {
			var e = new Expression();
			e.fromJson({
				sourceField: 'name',
				operator: 'startsWith',
				target: 'Amanda'
			});
			var data = {
				name: 'Amanda Valentina Burgos'
			};
			check(done, function() {
				expect(e.evaluate(data)).to.equal(true);
			});
		});
		it('should evaluate false startsWith operator', function (done) {
			var e = new Expression();
			e.fromJson({
				sourceField: 'name',
				operator: 'startsWith',
				target: 'Amanda'
			});
			var data = {
				name: ' Amanda Valentina Burgos'
			};
			check(done, function() {
				expect(e.evaluate(data)).to.equal(false);
			});
		});
		it('should evaluate false startsWith operator given null string', function (done) {
			var e = new Expression();
			e.fromJson({
				sourceField: 'name',
				operator: 'startsWith',
				target: 'Amanda'
			});
			var data = {
				name: null
			};
			check(done, function() {
				expect(e.evaluate(data)).to.equal(false);
			});
		});
		it('should evaluate endsWith operator', function (done) {
			var e = new Expression();
			e.fromJson({
				sourceField: 'name',
				operator: 'endsWith',
				target: 'Burgos'
			});
			var data = {
				name: 'Amanda Valentina Burgos'
			};
			check(done, function() {
				expect(e.evaluate(data)).to.equal(true);
			});
		});
		it('should evaluate false endsWith operator', function (done) {
			var e = new Expression();
			e.fromJson({
				sourceField: 'name',
				operator: 'endsWith',
				target: 'Burgos'
			});
			var data = {
				name: 'Amanda Valentina Burgosx'
			};
			check(done, function() {
				expect(e.evaluate(data)).to.equal(false);
			});
		});
		it('should evaluate false endsWith operator given null string', function (done) {
			var e = new Expression();
			e.fromJson({
				sourceField: 'name',
				operator: 'endsWith',
				target: 'Burgos'
			});
			var data = {
				name: null
			};
			check(done, function() {
				expect(e.evaluate(data)).to.equal(false);
			});
		});
		describe('-> summarizing', function() {
			it('should summarize countOf', function (done) {
				var e = new Expression();
				e.fromJson({
					sourceSummary: 'countOf',
					sourceField: 'name',
					operator: 'equals',
					target: 2
				});
				var data = {
					name: [
						'Amanda',
						'Valentina'
					]
				};
				check(done, function() {
					expect(e.evaluate(data)).to.equal(true);
				});
			});
			it('should summarize false countOf', function (done) {
				var e = new Expression();
				e.fromJson({
					sourceSummary: 'countOf',
					sourceField: 'name',
					operator: 'equals',
					target: 2
				});
				var data = {
					name: [
						'Amanda'
					]
				};
				check(done, function() {
					expect(e.evaluate(data)).to.equal(false);
				});
			});
			it('should summarize countOf of records', function (done) {
				var e = new Expression();
				e.fromJson({
					sourceSummary: 'countOf',
					sourceField: 'articles',
					operator: 'equals',
					target: 2
				});
				var data = {
					name: 'Amanda',
					articles: [
						{
							name: 'Laptop'
						},
						{
							name: 'Car'
						}
					]
				};
				check(done, function() {
					expect(e.evaluate(data)).to.equal(true);
				});
			});
			it('should summarize false countOf of records', function (done) {
				var e = new Expression();
				e.fromJson({
					sourceSummary: 'countOf',
					sourceField: 'articles',
					operator: 'equals',
					target: 1
				});
				var data = {
					name: 'Amanda',
					articles: [
						{
							name: 'Laptop'
						},
						{
							name: 'Car'
						}
					]
				};
				check(done, function() {
					expect(e.evaluate(data)).to.equal(false);
				});
			});
			it('should summarize countOf of nested records', function (done) {
				var e = new Expression();
				e.fromJson({
					sourceSummary: 'countOf',
					sourceField: 'people/articles',
					operator: 'equals',
					target: 4
				});
				var data = {
					people: [
						{
							name: 'Amanda',
							articles: [
								{
									name: 'Laptop'
								},
								{
									name: 'Car'
								}
							]
						},
						{
							name: 'Eduardo',
							articles: [
								{
									name: 'Tablet'
								},
								{
									name: 'Cat'
								}
							]
						}
					]
				};
				check(done, function() {
					expect(e.evaluate(data)).to.equal(true);
				});
			});
			it('should summarize sumOf', function (done) {
				var e = new Expression();
				e.fromJson({
					sourceSummary: 'sumOf',
					sourceField: 'age',
					operator: 'equals',
					target: 32
				});
				var data = {
					name: 'Burgos',
					age: [31,1]
				};
				check(done, function() {
					expect(e.evaluate(data)).to.equal(true);
				});
			});
			it('should summarize false sumOf', function (done) {
				var e = new Expression();
				e.fromJson({
					sourceSummary: 'sumOf',
					sourceField: 'age',
					operator: 'equals',
					target: 32
				});
				var data = {
					name: 'Burgos',
					age: [31,2]
				};
				check(done, function() {
					expect(e.evaluate(data)).to.equal(false);
				});
			});
			it('should summarize sumOf nested records', function (done) {
				var e = new Expression();
				e.fromJson({
					sourceSummary: 'sumOf',
					sourceField: 'people/bills/value',
					operator: 'equals',
					target: 10
				});
				var data = {
					people: [
						{
							name: 'Amanda',
							bills: [
								{
									value: 1
								},
								{
									value: 2
								}
							]
						},
						{
							name: 'Eduardo',
							bills: [
								{
									value: 3
								},
								{
									value: 4
								}
							]
						}
					]
				};
				check(done, function() {
					expect(e.evaluate(data)).to.equal(true);
				});
			});
			it('should summarize false sumOf nested records', function (done) {
				var e = new Expression();
				e.fromJson({
					sourceSummary: 'sumOf',
					sourceField: 'people/bills/value',
					operator: 'equals',
					target: 11
				});
				var data = {
					people: [
						{
							name: 'Amanda',
							bills: [
								{
									value: 1
								},
								{
									value: 2
								}
							]
						},
						{
							name: 'Eduardo',
							bills: [
								{
									value: 3
								},
								{
									value: 4
								}
							]
						}
					]
				};
				check(done, function() {
					expect(e.evaluate(data)).to.equal(false);
				});
			});
			it('should summarize averageOf', function (done) {
				var e = new Expression();
				e.fromJson({
					sourceSummary: 'averageOf',
					sourceField: 'age',
					operator: 'equals',
					target: 31
				});
				var data = {
					name: 'Burgos',
					age: [32,30]
				};
				check(done, function() {
					expect(e.evaluate(data)).to.equal(true);
				});
			});
			it('should summarize averageOf 2', function (done) {
				var e = new Expression();
				e.fromJson({
					sourceSummary: 'averageOf',
					sourceField: 'age',
					operator: 'equals',
					target: 31.5
				});
				var data = {
					name: 'Burgos',
					age: [32,31]
				};
				check(done, function() {
					expect(e.evaluate(data)).to.equal(true);
				});
			});
			it('should summarize averageOf empty set', function (done) {
				var e = new Expression();
				e.fromJson({
					sourceSummary: 'averageOf',
					sourceField: 'age',
					operator: 'equals',
					target: 0
				});
				var data = {
					name: 'Burgos',
					age: []
				};
				check(done, function() {
					expect(e.evaluate(data)).to.equal(true);
				});
			});
			it('should summarize some', function (done) {
				var e = new Expression();
				e.fromJson({
					sourceSummary: 'some',
					sourceField: 'age',
					operator: 'equals',
					target: 30
				});
				var data = {
					name: 'Burgos',
					age: [32,30]
				};
				check(done, function() {
					expect(e.evaluate(data)).to.equal(true);
				});
			});
			it('should summarize false some', function (done) {
				var e = new Expression();
				e.fromJson({
					sourceSummary: 'some',
					sourceField: 'age',
					operator: 'equals',
					target: 31
				});
				var data = {
					name: 'Burgos',
					age: [32,30]
				};
				check(done, function() {
					expect(e.evaluate(data)).to.equal(false);
				});
			});
			it('should summarize every', function (done) {
				var e = new Expression();
				e.fromJson({
					sourceSummary: 'every',
					sourceField: 'age',
					operator: 'lessThan',
					target: 33
				});
				var data = {
					name: 'Burgos',
					age: [32,30]
				};
				check(done, function() {
					expect(e.evaluate(data)).to.equal(true);
				});
			});
			it('should summarize false every', function (done) {
				var e = new Expression();
				e.fromJson({
					sourceSummary: 'every',
					sourceField: 'age',
					operator: 'lessThan',
					target: 33
				});
				var data = {
					name: 'Burgos',
					age: [32,33]
				};
				check(done, function() {
					expect(e.evaluate(data)).to.equal(false);
				});
			});
			it('should summarize some with a where clause'/*, function (done) {
				var e = new Expression();
				e.fromJson({
					sourceSummary: 'some',
					sourceField: 'people/age',
					operator: 'equals',
					target: 30,
					where: {
						sourceField: 'people/name',
						operator: 'equals',
						target: 'Eduardo'
					}
				});
				var data = {
					people: [
						{
							name: 'Amanda',
							age: 1
						},
						{
							name: 'Eduardo',
							age: 30
						},
						{
							name: 'Julio',
							age: 32
						}
					]
				};
				check(done, function() {
					expect(e.evaluate(data)).to.equal(true);
				});
			}*/);
		});
		it('should accept a custom operator', function (done) {
			var e = new Expression();
			e.set('operatorList', objUtils.protoClone(e.get('operatorList')));
			e.get('operatorList')['divides'] = {
				name: 'divides',
				'dataTypeList': [
					'Number'
				],
				'operator': function(a,b) { /* jshint -W016 */ return (b % a) === 0; }
			};
			e.fromJson({
				sourceField: 'age',
				operator: 'divides',
				target: 20
			});
			var data = {
				age: 5
			};
			check(done, function() {
				expect(e.evaluate(data)).to.equal(true);
			});
		});
		it('should accept a custom combination operator', function (done) {
			var e = new Expression();
			e.set('operatorList', objUtils.protoClone(e.get('operatorList')));
			e.get('operatorList')['xor'] = {
				name: 'xor',
				reductor: function(a,b) { /* jshint -W016 */ return !!(a ^ b); }
			};
			e.fromJson({
				operator: 'xor',
				expressionList: [
					{
						sourceField: 'name',
						operator: 'equals',
						target: 'Amanda'
					},
					{
						sourceField: 'lastName',
						operator: 'notEquals',
						target: 'Burgos'
					}
				]
			});
			var data = {
				name: 'Amanda',
				lastName: 'Burgos'
			};
			check(done, function() {
				expect(e.evaluate(data)).to.equal(true);
			});
		});
	});
	describe('-> with RequireJS AMD Loader in Node.js', function () {
		var requirejs;
		requirejs = require('requirejs');

		requirejs.config({
			//Pass the top-level main.js/index.js require
			//function to requirejs so that node modules
			//are loaded relative to the top-level JS file.
			nodeRequire: require,
			paths: {
				'ninejs': __dirname + '/../../'
			}
		});
	
		it('should load and evaluate', function (done) {
			requirejs(['ninejs/core/logic/Expression'], function (Expression) {
				var e = new Expression();
				e.fromJson({
					sourceSummary: 'countOf',
					sourceField: 'name',
					operator: 'equals',
					target: 2
				});
				var data = {
					name: [
						'Amanda'
					]
				};
				check(done, function() {
					expect(e.evaluate(data)).to.equal(false);
				});
			});
		});
	});
});