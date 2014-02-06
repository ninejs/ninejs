(function() {
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