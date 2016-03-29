///<amd-dependency path="./core/text" />

'use strict';
import extend from './core/extend';
import Properties from './core/ext/Properties';
import { when } from './core/deferredUtils';
import { compileDom } from './_nineplate/domProcessor';
import { compileText } from './_nineplate/textProcessor';
import './_nineplate/utils/node/text';

declare var require: any;
declare var define:{
	(deps:string[], callback:(...rest:any[]) => any): void;
	amd: any;
};

var requireText: any,
	req = require;
var isNode = typeof(window) === 'undefined',
	isAmd = (typeof(define) !== 'undefined') && (define.amd),
	isDojo = isAmd && define.amd.vendor === 'dojotoolkit.org';
if ((typeof(window) === 'undefined') && (!isDojo)) {
	requireText = req('./_nineplate/utils/node/text');
}
else {
	requireText = require('./core/text');
}

export interface ResultFunction {
	(context: any, doc?: HTMLDocument): any;
	amdDependencies?: string[];
}

export interface NineplateType {
	buildTemplate: (val: string) => Template;
	getTemplate: (path: string, callback: (t: Template) => void) => void;
	load: (name: string, req: any, onLoad: (v: any) => void, config?: any) => void;
	__express: (path: string, options: any, callback: (err: any, val: any) => void) => void;
}

var Nineplate = extend<NineplateType>({
	buildTemplate: function(val: string) {
		var template = new Template({});
		template.set('text', val);
		return template;
	},
	getTemplate: function(path: string, callback: (t: Template) => void) {
		var self = this;
		requireText.load(path, require, function(val: string) {
			callback(self.buildTemplate(val));
		});
	},
	load: function(name: string, req: any, onLoad: (v: any) => void, config?: any) {
		if (isDojo && require.cache[/*this.mid + '!' + */name]) {
			require([/*this.mid + '!' + */name], function(templateModule: any) {
				onLoad(templateModule);
			});
		}
		else {
			var loadText = function(val: string) {
				onLoad(new Nineplate().buildTemplate(val));
			};
			requireText.load(name, req, loadText, config);
		}
	}
});
var result = new Nineplate();
if (isNode) {
	var cache: { [name: string]: (options: any) => any } = {};
	result.__express = function(path: string, options: any, callback: (err: any, val: any) => void) {
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
			self.getTemplate(path, function(template: Template) {
				template.compileText(false).then(function(fnTemplate: (options: any) => any) {
					cache[path] = fnTemplate;
					return callback(null, fnTemplate(options));
				});
			});
		}
	};
}

export function load(name: string, req: any, onLoad: (v: any) => void, config?: any) {
	return result.load(name, req, onLoad, config);
}
export default result;

export class Template extends Properties {
	text: string = '';
	compiledDomVersion: (v: any) => any;
	compiledTextVersion: (v: any) => any;
	toAmd (sync: boolean, options: any = {}): any {
		var prefix = options.ninejsPrefix || 'ninejs';
		var preText = `(function (factory) {
					if (typeof module === \'object\' && typeof module.exports === \'object\') { \n
						var v = factory(require, exports); if (v !== undefined) module.exports = v; \n
					} \n
					else if (typeof define === \'function\' && define.amd) { \n
						define([\'require\', \'module\'`,
			prePostText = `], factory); \n
					} \n
				})(function (require, module) {\n/* jshint -W074 */\n/* globals window: true */\n\'use strict\';\nvar r = `,
			postText =  ';\nmodule.exports = r;	});\n';
		if (isNode && !sync) {
			return when(this.compileDom(false, options), function (fn) {
				// if (!options.standalone) {  // This seems to be redundant
				// 	fn.amdDependencies.push(`${prefix}/_nineplate/utils/functions`);
				// }
				var depsText = (fn.amdDependencies || []).map(function (item: string) {
					return '\'' + item + '\'';
				}).join(',');
				return preText + (depsText? ', ' : '') + depsText + prePostText + fn.toString() + postText;
			}, function (err) {
				throw err;
			});
		}
		var fn = this.compileDom(sync, options);
		var depsText = (fn.amdDependencies || []).map(function (item: string) {
			return '\'' + item + '\'';
		}).join(',');
		return preText + depsText + prePostText + fn + postText;
	}
	toCommonJs (): any {
		var preText = '/* jshint -W074 */\n/* globals window: true */\n\'use strict\';\nmodule.exports =', postText = ';';
		if (isNode) {
			if (isDojo) {
				return preText + this.compileText(false) + postText;
			}
			else {
				return when(this.compileText(false), function(value) {
					return preText + value + postText;
				});
			}
		}
		return preText + this.compileText(false) + postText;
	}
	compileDomSync (options?: any) : (val: any) => any {
		if (this.compiledDomVersion) {
			return this.compiledDomVersion;
		}
		var result = compileDom(this.text, true, options || { ignoreHtmlOptimization: true });
		this.compiledDomVersion = result;
		return result;
	}
	compileDom (sync: boolean, options?: any): any {
		/* jshint evil: true */
		if (sync) {
			return this.compileDomSync(options);
		}
		else {
			var result: any = this.compiledDomVersion,
				self = this;
			if (!result) {
				result = when(compileDom(this.text, sync, options || { ignoreHtmlOptimization: true }), function(val) {
					self.compiledDomVersion = val;
					return val;
				}, function (err) {
					throw err;
				});
			}
			return result;
		}
	}
	renderDom (context: any) {
		var compiled = this.compileDom(true /* sync */);
		return compiled(context);
	}
	compileTextSync () {
		if (this.compiledTextVersion) {
			return this.compiledTextVersion;
		}
		else {
			return compileText(this.text, true);
		}
	}
	compileText (sync: boolean): any {
		/* jshint evil: true */
		if (sync) {
			return this.compileTextSync();
		}
		else {
			var result: any = this.compiledTextVersion,
				self = this;
			if (!result) {
				//Do some processing
				result = compileText(this.text, sync);
				if (sync) {
					this.compiledTextVersion = result;
				}
				else {
					result = when(result, function (val) {
						self.compiledTextVersion = val;
						return val;
					});
				}
			}
			return result;
		}
	}
	renderText (context: any) {
		var compiled = this.compileText(true /* sync */);
		return compiled(context);
	}
}