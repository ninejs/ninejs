(function (global) {
	/* global describe, it, expect, window */
	'use strict';
	var isNode = typeof(window) === undefined;
	var req;
	if (isNode) {
		req = require;
	}
	else {
		req = global.require;
	}
	function check( done, f ) {
		try {
			f();
			done();
		} catch(e) {
			done(e);
		}
	}
	function tst(nineplate, Properties) {
		describe('Nineplate in a headless WebKit (PhantomJS)', function () {
			describe('-> DOM Rendering', function() {
				it('should render a simple template', function(done) {
					nineplate.getTemplate('./template.html', function(template){
						var result = template.renderDom({
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
							liveChanges: new Properties({
								val: 0
							}),
							persons: [
								new Properties({
									name: 'Eduardo Burgos',
									gender: 'M'
								}),
								new Properties({
									name: 'Amanda Burgos',
									gender: 'F'
								})
							]
						});
						check(done, function() {
							expect(result.domNode).to.be.an('object');
						});
					});
				});
				it('should render live values', function (done) {
					nineplate.getTemplate('./template.html', function(template){
						var data = new Properties({
							title: 'The title',
							'class': 'container',
							tagName: 'section',
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
							liveChanges: new Properties({
								val: 0
							}),
							persons: [
								new Properties({
									name: 'Eduardo Burgos',
									gender: 'M'
								}),
								new Properties({
									name: 'Amanda Burgos',
									gender: 'F'
								})
							]
						});
						var result = template.renderDom(data);
						check(done, function() {
							expect(result.personsNode.getElementsByTagName('div')[0].getAttribute('data-key')).to.equal('Eduardo Burgos');
							expect(result.personsNode.getElementsByTagName('div')[0].getElementsByTagName('div')[0].innerText).to.equal('Eduardo Burgos');
						});
					});
				});
				it('should render updated live values', function (done) {
					nineplate.getTemplate('./template.html', function(template){
						var data = new Properties({
							title: 'The title',
							'class': 'container',
							tagName: 'section',
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
							liveChanges: new Properties({
								val: 0
							}),
							persons: [
								new Properties({
									name: 'Eduardo Burgos',
									gender: 'M',
									age: 30
								}),
								new Properties({
									name: 'Amanda Burgos',
									gender: 'F',
									age: 0
								})
							]
						});
						var result = template.renderDom(data);
//						data.get('persons')[1].set('age', 1);
						data.get('liveChanges').set('val', 1);
						check(done, function() {
							expect(result.domNode.querySelectorAll('.liveChanges')[0].innerText).to.equal('1');
//							expect(result.personsNode.getElementsByTagName('div')[4].getElementsByTagName('div')[2].innerText).to.equal('1');
						});
					});
				});
				it('should render updated live values in attributes', function (done) {
					nineplate.getTemplate('./liveExpressions/inAttribute01.html', function(template){
						var data = new Properties({
							liveChanges: new Properties({
								val: 0
							})
						});
						var result = template.renderDom(data);
//						data.get('persons')[1].set('age', 1);
						data.get('liveChanges').set('val', 1);
						check(done, function() {
							expect(result.domNode.querySelectorAll('.liveChanges')[0].getAttribute('data-value')).to.equal('1');
//							expect(result.personsNode.getElementsByTagName('div')[4].getElementsByTagName('div')[2].innerText).to.equal('1');
						});
					});
				});
				it('should render updated live values in attributes after 2nd change', function (done) {
					nineplate.getTemplate('./liveExpressions/inAttribute01.html', function(template){
						var data = new Properties({
							liveChanges: new Properties({
								val: 0
							})
						});
						var result = template.renderDom(data);
						data.get('liveChanges').set('val', 1);
						data.get('liveChanges').set('val', 2);
						check(done, function() {
							expect(result.domNode.querySelectorAll('.liveChanges')[0].getAttribute('data-value')).to.equal('2');
						});
					});
				});
				it('should render updated live values in a loop', function (done) {
					nineplate.getTemplate('./template.html', function(template){
						var data = new Properties({
							title: 'The title',
							'class': 'container',
							tagName: 'section',
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
							liveChanges: new Properties({
								val: 0
							}),
							persons: [
								new Properties({
									name: 'Eduardo Burgos',
									gender: 'M',
									age: 30
								}),
								new Properties({
									name: 'Amanda Burgos',
									gender: 'F',
									age: 0
								}),
								new Properties({
									name: 'Raul Burgos',
									gender: 'M',
									age: 4
								})
							]
						});
						var result = template.renderDom(data);
						data.get('persons')[1].set('age', 1);
						check(done, function() {
							expect(result.personsNode.getElementsByTagName('div')[4].getElementsByTagName('div')[2].innerText).to.equal('1');
						});
					});
				});
				it('should render with a numeric dataType in an object', function (done) {
					nineplate.getTemplate('./template.html', function (template) {
						var result = template.renderDom({
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
							liveChanges: new Properties({
								val: 0
							}),
							persons: [
								new Properties({
									name: 'Eduardo Burgos',
									gender: 'M'
								}),
								new Properties({
									name: 'Amanda Burgos',
									gender: 'F'
								})
							]
						});
						check(done, function() {
							expect(result.domNode.getElementsByClassName('testANumberInAnObject')[0].textContent).to.equal('5');
						});
					});
				});
				it('should render xml entity tags', function (done) {
					nineplate.getTemplate('./templateEntityTags.html', function (template) {
						var result = template.renderDom({
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
							}
						});
						check(done, function() {
							expect(result.domNode.getElementsByClassName('testANumberInAnObject')[0].textContent).to.equal('5');
						});
					});
				});
			});
			describe(' -> AMD Extensions', function() {
				//Setting up AMD with RequireJS
				it('should render a template with an editor widget', function(done) {
					nineplate.getTemplate('./amdExtensions/editor01.html', function (template) {
						var compiled = template.compileDom(true);
						require(compiled.amdDependencies || [], function() {
							var result = compiled({
							});
							check(done, function() {
								expect(result.editor.$njsWidget).to.not.equal(undefined);
							});
						});
					});
				});
				it('should support 2-way binding with an AMD control', function(done) {
					nineplate.getTemplate('./amdExtensions/editor02.html', function (template) {
						var compiled = template.compileDom(true);
						require(compiled.amdDependencies || [], function() {
							var data = new Properties(),
								result = compiled({
									data: data
								});
							check(done, function() {
								data.set('age', 24);
								data.set('age', 31);
								expect(result.editor.get('value')).to.equal(31);
								result.editor.set('value', 45);
								expect(data.get('age')).to.equal(45);
							});
						});
					});
				});
			});
			describe(' -> Bug fixes', function() {
				it('should render all tags. Should pass even if ignoreHtmlOptimization: false', function(done) {
					nineplate.getTemplate('./test001.html', function (template) {
						var result = template.renderDom({
							i18n: function(a) {
								return a;
							}
						});
						check(done, function() {
							expect(result.domNode.textContent).to.contain('@');
						});
					});
				});
				it('should keep all classes when dealing with a calculated class attribute', function(done) {
					nineplate.getTemplate('./test002.html', function (template) {
						var result = template.renderDom({
							i18n: function(a) {
								return a;
							},
							navClass: 'nav',
							'class': 'navbarclass',
							role: 'navigation',
							brand: 'test'
						});
						check(done, function() {
							var classes = Array.prototype.slice.call(result.domNode.classList, 0);
							expect(classes).to.contain('NavBar');
							expect(classes).to.contain('navbar');
							expect(classes).to.contain('nav');
							expect(classes).to.contain('navbarclass');
							expect(classes).to.contain('vpan12');
						});
					});
				});
				it('should render with a string filter', function (done) {
					nineplate.getTemplate('./testCases/filter01.html', function (template) {
						var result = template.renderDom({
							data: 1234.56,
							filter: function(v) {
								return '$' + v;
							}
						});
						check(done, function() {
							expect(result.domNode.textContent).to.equal('$1234.56');
						});
					});
				});
			});
		});
	}
	if (isNode) {
		tst(req('../../nineplate'), req('../../core/ext/Properties'));
	}
	else {
		req(['ninejs/nineplate', 'ninejs/core/ext/Properties'], tst);
	}
})(this);