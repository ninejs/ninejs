'use strict';

import extend from './extend';
import Evented from './ext/Evented';
import * as amdText from './text';
import { defer } from './deferredUtils';
declare var define: any;

var isAmd = (typeof(define) !== 'undefined' && define.amd),
	isDojo = isAmd && define.amd.vendor === 'dojotoolkit.org',
	isNode = (typeof(window) === 'undefined'),
	req = require;

function getFile(src: string, require: any, load: (data: any) => void, config?: any) {
	var obj: any;
	if (isAmd) {
		amdText.load(src, require, load, config);
	}
	else if (isNode) {
		obj = req(src);
		if (load) {
			load(obj);
		}
	}
	else {
		throw new Error('environment not yet supported');
	}
	return obj;
}
export interface I18nResource {
	loadResource: (locale: string, require: any, load: (data: any) => void) => any;
	setLocale: (locale: string, ignoreChangedEvent: boolean, req: any, originalLoad: (data: any) => void) => Promise<any>;
	getResource: () => any;
	root: any;
	baseUrl: string;
	baseName: string;
	available: { [name: string]: boolean };
}
var I18nResourceSet = extend<I18nResource>(Evented, {
	loadResource: function(locale: string, require: any, load: (data: any) => void) {
		var shrt: string,
			parent = this.loaded.root,
			result: any,
			pathPart = locale;
		if (locale && (locale.length > 2)) {
			shrt = locale.substr(0, 2);
			if (this.available[shrt]) {
				if (this.loaded[shrt]) {
					parent = this.loaded[shrt];
				}
			}
			pathPart = shrt + '/' + locale.substr(3);
		}
		locale = locale || 'root';
		if (locale !== 'root') {
			getFile(this.baseUrl + '/' + pathPart + '/' + this.baseName, require, function (a: any) {
				class Constr {};
				Constr.prototype = parent;
				result = new Constr();
				result.$njsLocale = locale;
				if (typeof(a) === 'string') {
					a = JSON.parse(a);
				}
				extend.mixin(result, a);
				load(result);
			});
		}
		else {
			result = this.loaded.root;
			result.$njsLocale = locale;
			load(result);
		}
		return result;
	},
	setLocale: function(locale: string, ignoreChangedEvent: boolean, req: any, originalLoad: (data: any) => void) {
		var require: any = req || require;
		var self = this;
		var deferred = defer();
		function load(val: any) {
			if (originalLoad) {
				deferred.promise.then(originalLoad);
			}
			deferred.resolve(val);
		}
		if (this.locale !== locale) {
			(function (self: any) {
				if (!self.loaded.root) {
					self.loaded.root = self.root;
				}
			})(this);
			if (this.loaded[locale || 'root']) {
				this.resource = this.loaded[locale || 'root'];
				this.locale = locale;
				if (!ignoreChangedEvent) {
					self.emit('localeChanged', { locale: self.locale });
				}
				load(this.resource);
			}
			else if (this.available[locale]) {
				this.loadResource(locale, require, function (obj: any) {
					self.resource =  obj;
					self.loaded[locale || 'root'] = self.resource;
					self.locale = locale;
					if (!ignoreChangedEvent) {
						self.emit('localeChanged', { locale: self.locale });
					}
					load(obj);
				});
			}
			else if (((locale || '').length > 2) && (this.available[locale.substr(0,2)])) {
				this.setLocale(locale.substr(0,2), ignoreChangedEvent, require).then(function () {
					self.locale = locale;
					self.setLocale(locale, ignoreChangedEvent, require).then(function (val: any) {
						load(val);
					});
				});
			}
			else {
				this.resource = this.root;
				load(this.root);
			}
		}
		else {
			load(this.resource);
		}
		return deferred.promise;
	},
	getResource: function() {
		return this.resource;
	}
}, function() {
	this.loaded = {};
});

export function getResource (src: string, require: any, load?: (data: any) => void, config?: any) {
	var obj: any,
		root: any,
		available: { [name: string]: boolean } = {},
		current: any,
		locale: string;
	require = require || {};
	locale = (config || require.rawConfig || {}).locale || null;
	function rest(obj: any, load?: (v: any) => void) {
		root = obj.root;
		for (var p in obj) {
			if (obj.hasOwnProperty(p)) {
				if (p !== 'root') {
					current = obj[p];
					if (current) {
						available[p] = true;
					}
				}
			}
		}
		var resourceSet = new I18nResourceSet();
		resourceSet.root = root;
		if (isNode) {
			var path = req('path');
			resourceSet.baseUrl = path.dirname(src);
			resourceSet.baseName = path.basename(src);
		}
		else {
			resourceSet.baseUrl = src.substr(0, src.lastIndexOf('/'));
			resourceSet.baseName = src.substr(src.lastIndexOf('/') + 1);
		}
		resourceSet.available = available;
		resourceSet.setLocale(locale, null, require, function () {
			if (load) {
				load(resourceSet);
			}
		});
		return resourceSet;
	}
	if (!load) {
		obj = getFile(src, require, load, config);
		return rest(obj);
	}
	else {
		getFile(src, require, function(obj) {
			if (typeof(obj) === 'string') {
				obj = JSON.parse(obj);
			}
			rest(obj, load);
		}, config);
	}
}
export function load (mid: string, require: any, load: (data: any) => void, config: any) {
	getResource(mid, require, load, config);
}