'use strict';

/* global describe, it */
describe('nineplate :: Nineplate', function () {
	describe('-> With Dojo Toolkit in Node.js', function () {
		it('should render a simple template', function (done) {
			//bootstrapping
			// Configuration Object for Dojo Loader:
			// jshint unused: false
			global.dojoConfig = {
				baseUrl : __dirname + '/../../node_modules/', // Where we will put our packages
				async: 0, // We want to make sure we are using the "modern" loader
				has: {
					'host-node': 1, // Ensure we "force" the loader into Node.js mode
					'dom': 0 // Ensure that none of the code assumes we have a DOM
				},
				// While it is possible to use config-tlmSiblingOfDojo to tell the
				// loader that your packages share the same root path as the loader,
				// this really isn't always a good idea and it is better to be
				// explicit about our package map.
				packages: [{
						name: 'dojo',
						location: __dirname + '/../../node_modules/dojo'
					},{
						name: 'ninejs',
						location: __dirname + '/../..'
					}]
				};


			try {
				// Now load the Dojo loader
				if (require.cache[require.resolve('dojo/dojo.js')]) {
					delete require.cache[require.resolve('dojo/dojo.js')];
				}
				var res = require('dojo/dojo.js');
				var dojorequire = global.require;
				dojorequire(['ninejs/nineplate!ninejs/nineplate/tests/template.html', 'dojo/node!assert'], function (template, assert) {
					var result = template.renderText({
						title: 'The title',
						'class': 'container',
						anObject: {
							aNumber: 5
						},
						number: 8,
						fn: function(arg) {
							return '#' + arg + '#';
						},
						doubleFunction: function(arg) {
							var x = arg + ' ==> ';
							return function(arg2) {
								return x + arg2;
							};
						},
						liveChanges: {
							val: 0
						}
					});
					assert(typeof(result) === 'string');
				});

				done();
			}
			catch (err) {
				done(err);
			}
			finally {
				delete global.dojoConfig;
				delete global.require;
				delete global.define;
			}
		});
	});


	describe('-> Plain Nineplate in Node.js', function() {
		var nineplate, assert, Q, fs;
		nineplate = require('../../nineplate');
		assert = require('assert');
		Q = require('q');
		fs = require('fs');
		describe('-> Template Rendering', function() {
			it('should render a simple template', function(done) {
				// returns true
				nineplate.getTemplate(__dirname + '/template.html', function(template){
					var result = template.renderText({
						title: 'The title',
						'class': 'container',
						number: 8,
						anObject: {
							aNumber: 5
						},
						fn: function(arg) {
							return '#' + arg + '#';
						},
						doubleFunction: function(arg) {
							var x = arg + ' ==> ';
							return function(arg2) {
								return x + arg2;
							};
						},
						liveChanges: {
							val: 0
						}
					});
					assert(typeof(result) === 'string');
					done();
				});
			});
			it('should compile a simple template', function(done) {
				nineplate.getTemplate(__dirname + '/template.html', function(template){
					var r = template.compileDom();
					Q.when(r, function(value) {
						assert(typeof(value) === 'function');
						done();
					}, function(error) {
						console.log(error);
					});
				});
			});
		});
	});


	describe('-> Nineplate with RequireJS AMD Loader in Node.js', function () {
		var requirejs, assert, nineplate, Q, fs;
		requirejs = require('requirejs');
		assert = require('assert');
		nineplate = require('../../nineplate');
		Q = require('q');
		fs = require('fs');

		requirejs.config({
			//Pass the top-level main.js/index.js require
			//function to requirejs so that node modules
			//are loaded relative to the top-level JS file.
			nodeRequire: require,
			paths: {
				'ninejs': __dirname + '/../../'
			}
		});
		describe('-> Template Rendering', function () {
			var expect = require('chai').expect;
			it('should render a simple template', function (done) {

				requirejs(['ninejs/nineplate!ninejs/nineplate/tests/template.html'], function (template) {
					var result = template.renderText({
						title: 'The title',
						'class': 'container',
						number: 8,
						anObject: {
							aNumber: 5
						},
						fn: function(arg) {
							return '#' + arg + '#';
						},
						doubleFunction: function(arg) {
							var x = arg + ' ==> ';
							return function(arg2) {
								return x + arg2;
							};
						},
						liveChanges: {
							val: 0
						}
					});
					assert(typeof(result) === 'string');
					done();
				});


			});
			it('should render with a numeric dataType in an object', function (done) {
				requirejs(['ninejs/nineplate!ninejs/nineplate/tests/template.html'], function (template) {
					var result = template.renderText({
						title: 'The title',
						'class': 'container',
						number: 8,
						anObject: {
							aNumber: 5
						},
						fn: function(arg) {
							return '#' + arg + '#';
						},
						doubleFunction: function(arg) {
							var x = arg + ' ==> ';
							return function(arg2) {
								return x + arg2;
							};
						},
						liveChanges: {
							val: 0
						}
					});
					expect(result).to.match(/<div class=\'testANumberInAnObject\'>5<\/div>/);
					done();
				});
			});
			it('should compile a simple AMD template', function(done) {
				nineplate.getTemplate(__dirname + '/template.html', function(template){
					Q.when(template.toAmd(), function(value){
						fs.writeFileSync(__dirname + '/template-generated.js', value);
						requirejs(['ninejs/nineplate/tests/template-generated'], function(template) {
							assert(typeof(template) === 'function');
							done();
						});
					});
				});
			});
		});
	});

	describe('-> Parser :: Nineplate Template Parser', function() {
		var parser, assert;

		parser = require('../utils/parser/commonjs');
		assert = require('assert');
	/*	describe('Simple Parsing', function() {
			it('should parse an empty tag', function(done) {
				assert(parser.parse('<data></data>'));
				done();
			});
			it('should parse a single tag', function(done) {
				assert(parser.parse('<data />'));
				done();
			});
			it('should parse nested tags', function(done) {
				assert(parser.parse('<data><span></span></data>'));
				done();
			});
			it('should parse more nested tags', function(done) {
				assert(parser.parse('<data><span>Text</span><span>Nested</span><span>More Text</span></data>'));
				done();
			});
			it('should ignore non-important whitespace', function(done) {
				var r = parser.parse('<data>\n<span>\nText\n</span>\n<span>Nested</span><span>More Text</span></data>');
				assert(r);
				done();
			});
			it('should parse an empty tag with attributes', function(done) {
				assert(parser.parse('<data id="myId" key=\'myKey\' otherKey=\'otherKey\' value="myValue" singleQuotes=\'Hi "double quotes"\' doubleQuotes = "Hi \'single quotes\'"></data>'));
				done();
			});
			it('should parse a single tag with attributes', function(done) {
				assert(parser.parse('<data id="myId" key=\'myKey\' value="myValue" />'));
				done();
			});
		});
	*/
		describe('-> Variable Parsing', function() {
			it('should parse variables as text nodes', function(done) {
				//assert(parser.parse('<data>${value}</data>'));
				var r = parser.parse('${value}');
				assert(r.type === 'expressionToken');
				done();
			});
			it('should parse variables as part of text nodes', function(done) {
				var r = parser.parse('<data>This is the value: ${value} that returned</data>');
				assert(r);
				done();
			});
			it('should parse variables as attributes', function(done) {
				var r = parser.parse('<data id="${id}" key=\'myKey\' value="myValue" />');
				assert(r);
				r = parser.parse('<data id=\'${id}\' key=\'myKey\' value="myValue" />');
				assert(r);
				done();
			});
			it('should parse variables as part of attribute value', function(done) {
				assert(parser.parse('<data id="_${id}Context" key=\'myKey\' value="myValue" />'));
				assert(parser.parse('<data id=\'_${id}Context\' key=\'myKey\' value="myValue" />'));
				done();
			});
			it('should parse composed variable names', function(done) {
				assert(parser.parse('<data>${config.data.value}</data>'));
				done();
			});
			it('should parse array indexed expressions', function(done) {
				assert(parser.parse('<data>${config.data[0].value}</data>'));
				done();
			});
			it('should parse array indexed expressions with names', function(done) {
				assert(parser.parse('<data>${config.data[\'key\'].value}</data>'));
				assert(parser.parse('<data>${config.data["key"].value}</data>'));
				done();
			});
			it('should parse function call expressions', function(done) {
				assert(parser.parse('<data>${config.data[\'key\'].i18n.get()}</data>'));
				done();
			});
			it('should parse function call expressions 2', function(done) {
				assert(parser.parse('<data>${config.data[\'key\'].i18n.get(\'i18nKey\')}</data>'));
				done();
			});
			it('should parse function call expressions 3', function(done) {
				assert(parser.parse('<data>${config.data[\'key\'].i18n.get("i18nKey", 5, \'6\',func())}</data>'));
				done();
			});
			it('should parse content ending with percent', function(done) {
				assert(parser.parse('100%'));
				done();
			});
			it('should parse content ending with dollar', function(done) {
				assert(parser.parse('100$'));
				done();
			});
		});
		describe('-> Loops Parsing', function() {
			it('should parse loops defining an inline template', function(done) {
				assert(parser.parse('<data><persons>${@for persons person}<item name="${person.name}" />${@/for}</persons></data>'));
				done();
			});
		});
		describe('-> Optimized Templates', function() {
			it('should parse a Text optimized template', function(done) {
				assert(parser.parse('<data><persons>${@for persons person}<item name="${person.name|String}" />${@/for}</persons></data>'));
				done();
			});
			it('should parse a DOM optimized template', function(done) {
				assert(parser.parse('<data><persons>${@for persons person}<item name="${person.name|DOM}" />${@/for}</persons></data>'));
				done();
			});
			it('should parse a Dijit optimized template', function(done) {
				assert(parser.parse('<data><persons>${@for persons person}<item name="${person.name|Dijit}" />${@/for}</persons></data>'));
				done();
			});
			it('should parse a 9js optimized template', function(done) {
				assert(parser.parse('<data><persons>${@for persons person}<item name="${person.name()|9js}" />${@/for}</persons></data>'));
				done();
			});
			it('should parse a Mixed optimized templates', function(done) {
				assert(parser.parse('<data><persons>${@for persons person}<item name="${person.name|String,DOM}" />${@/for}</persons></data>'));
				assert(parser.parse('<data><persons>${@for persons person}<item name="${person.name|String,Dijit}" />${@/for}</persons></data>'));
				assert(parser.parse('<data><persons>${@for persons person}<item name="${person.name|String,9js}" />${@/for}</persons></data>'));
				assert(parser.parse('<data><persons>${@for persons person}<item name="${person.name|DOM,Dijit}" />${@/for}</persons></data>'));
				assert(parser.parse('<data><persons>${@for persons person}<item name="${person.name|DOM,9js}" />${@/for}</persons></data>'));
				assert(parser.parse('<data><persons>${@for persons person}<item name="${person.name|Dijit,9js}" />${@/for}</persons></data>'));
				assert(parser.parse('<data><persons>${@for persons person}<item name="${person.name|String,DOM,Dijit}" />${@/for}</persons></data>'));
				assert(parser.parse('<data><persons>${@for persons person}<item name="${person.name|String,DOM,9js}" />${@/for}</persons></data>'));
				assert(parser.parse('<data><persons>${@for persons person}<item name="${person.name|String,Dijit,9js}" />${@/for}</persons></data>'));
				assert(parser.parse('<data><persons>${@for persons person}<item name="${person.name|DOM,Dijit,9js}" />${@/for}</persons></data>'));
				assert(parser.parse('<data><persons>${@for persons person}<item name="${person.name|String,DOM,Dijit,9js}" />${@/for}</persons></data>'));
				done();
			});
		});
		describe('-> Live Templates', function() {
			describe('-> Parsing', function() {
				it('should parse a Live Template tag', function(done) {
					assert(parser.parse('<data><persons>%{person.name|String}</persons></data>'));
					assert(parser.parse('<data><persons>%{person.name}</persons></data>'));
					assert(parser.parse('<data><persons>%{person.name|DOM,Dijit}</persons></data>'));
					done();
				});
				it('should parse a Live for loop tag', function(done) {
					assert(parser.parse('<data><persons>%{@for persons person | key @ item/@key}<item key="${person.key}" name="%{person.name|String,DOM,Dijit,9js}" />${@/for}</persons></data>'));
					done();
				});
			});
		});
	});

});