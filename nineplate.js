/** 
@module nineplate 
@author Eduardo Burgos <eburgos@gmail.com>
*/
(function() {
	'use strict';
	var isAmd = (typeof(define) !== 'undefined') && define.amd;
	var isDojo = isAmd && define.amd.vendor === 'dojotoolkit.org';
	var isNode = (typeof(window) === 'undefined');
	var req = (isDojo && isNode)? global.require : require;

	/**
	builds the Nineplate module
	@param {Object} requireText - Either requireJS text/text or dojo's dojo/text. Used to load files
	@param {Object} extend - NineJS's extend. Used to build classes
	@param {Object} Properties - a mixin class that allows a class to have a getter and setter and some events
	@exports nineplate
	*/
	function moduleExport(requireText, extend, Properties, def, domProcessor, textProcessor) {
		var Template = extend(Properties, {
			text: '',
			toAmd: function (sync) {
				var preText = 'define([',
					prePostText = '], function() {\n/* jshint -W074 */\n/* globals window: true */\n\'use strict\';\nvar r = ',
					postText =  ';\nreturn r;\n});\n';
				if (isNode && !sync) {
					return def.when(this.compileDom(), function (fn) {
						var depsText = fn.amdDependencies.map(function (item) {
							return '\'' + item + '\'';
						}).join(',');
						return preText + depsText + prePostText + fn + postText;
					}, function (err) {
						throw err;
					});
				}
				var fn = this.compileDom(sync);
				var depsText = fn.amdDependencies.map(function (item) {
					return '\'' + item + '\'';
				}).join(',');
				return preText + depsText + prePostText + fn + postText;
			},
			toCommonJs: function() {
				var preText = '/* jshint -W074 */\n/* globals window: true */\n\'use strict\';\nmodule.exports =', postText = ';';
				if (isNode) {
					if (isDojo) {
						return preText + this.compileText() + postText;
					}
					else {
						return def.when(this.compileText(), function(value) {
							return preText + value + postText;
						});
					}
				}
				return preText + this.compileText() + postText;
			},
			compileDom: function(sync) {
				/* jshint evil: true */
				var result = this.compiledDomVersion,
					self = this;
				if (!result) {
					result = domProcessor.compileDom(this.template, sync, { ignoreHtmlOptimization: true });
					if (sync) {
						this.compiledDomVersion = result;
					}
					else {
						result = def.when(result, function(val) {
							self.compiledDomVersion = val;
							return val;
						}, function (err) {
							throw err;
						});
					}
				}
				return result;
			},
			renderDom: function(context) {
				var compiled = this.compileDom(true /* sync */);
				return compiled(context);
			},
			compileText: function(sync) {
				/* jshint evil: true */
				var result = this.compiledTextVersion,
					self = this;
				if (!result) {
					//Do some processing
					result = textProcessor.compileText(this.template, sync);
					if (sync) {
						this.compiledTextVersion = result;
					}
					else {
						result = def.when(result, function(val) {
							self.compiledTextVersion = val;
							return val;
						});
					}
				}
				return result;
			},
			renderText: function(context) {
				var compiled = this.compileText(true /* sync */);
				return compiled(context);
			}
		});

		var Nineplate = extend({
			buildTemplate: function(val) {
				var template = new Template();
				template.set('template', val);
				return template;
			},
			getTemplate: function(path, callback) {
				var self = this;
				requireText.load(path, require, function(val) {
					callback(self.buildTemplate(val));
				});
			},
			load: function(name, req, onLoad, config) {
				if (isDojo && require.cache[/*this.mid + '!' + */name]) {
					require([/*this.mid + '!' + */name], function(templateModule) {
						onLoad(templateModule);
					});
				}
				else {
					var loadText = function(val) {
						onLoad(new Nineplate().buildTemplate(val));
					};
					requireText.load(name, req, loadText, config);
				}
			}
		});
		var result = new Nineplate();
		if (isNode) {
			var cache = {};
			result.__express = function(path, options, callback) {
				var self = result;
				// support callback API
				if (typeof(options) === 'function') {
					callback = options;
					options = undefined;
				}
				options = options || {};
				if (cache[path]) {
					return callback(null, cache[path](options));
				}
				else {
					self.getTemplate(path, function(template) {
						template.compileText(false).then(function(fnTemplate) {
							cache[path] = fnTemplate;
							return callback(null, fnTemplate(options));
						});
					});
				}
			};
		}
		return result;
	}

	if (isAmd) { //AMD
		//Testing for dojo toolkit
		if (isDojo) {
			define(['dojo/text', './core/extend', './core/ext/Properties', './core/deferredUtils', './nineplate/DomProcessor', './nineplate/TextProcessor'], moduleExport);
		} else {
			//Trying for RequireJS and hopefully every other
			define(['./core/text', './core/extend', './core/ext/Properties', './core/deferredUtils', './nineplate/DomProcessor', './nineplate/TextProcessor'], moduleExport);
		}
	} else if (isNode) { //Server side
		module.exports = moduleExport(req('./nineplate/utils/node/text'), req('./core/extend'), req('./core/ext/Properties'), req('./core/deferredUtils'), req('./nineplate/DomProcessor'), req('./nineplate/TextProcessor'));
	} else {
		// plain script in a browser
		throw new Error('Non AMD environments are not supported');
	}
})();