(function(global) {
	'use strict';
	var isAmd = (typeof(define) !== 'undefined' && define.amd),
		isDojo = isAmd && define.amd.vendor === 'dojotoolkit.org',
		isNode = (typeof(window) === 'undefined'),
		req = require,
		path;

	function moduleExport(extend, Evented, amdText, def) {
		function getFile(src, require, load, config) {
			var obj;
			if (isAmd) {
				obj = amdText.load(src, require, load, config);
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
		var I18nResourceSet = extend(Evented, {
			loadResource: function(locale, require, load) {
				var shrt,
					parent = this.loaded.root,
					result,
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
					getFile(this.baseUrl + '/' + pathPart + '/' + this.baseName, require, function (a) {
						var Constr = function() {};
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
			setLocale: function(locale, ignoreChangedEvent, req, originalLoad) {
				var require = req || require;
				var self = this;
				var defer = def.defer();
				function load(val) {
					if (originalLoad) {
						defer.promise.then(originalLoad);
					}
					defer.resolve(val);
				}
				if (this.locale !== locale) {
					(function (self) {
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
						this.loadResource(locale, require, function (obj) {
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
							self.setLocale(locale, ignoreChangedEvent, require).then(function (val) {
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
				return defer.promise;
			},
			getResource: function() {
				return this.resource;
			}
		}, function() {
			this.loaded = {};
		});
		var result,
			I18n,
			getResource;

		getResource = function(src, require, load, config) {
			var obj,
				root,
				available = {},
				current,
				locale;
			require = require || {};
			locale = (config || require.rawConfig || {}).locale || null;
			function rest(obj, load) {
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
					path = req('path');
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
		};
		I18n = extend({
			load: function(mid, require, load, config) {
				getResource(mid, require, load, config);
			},
			getResource: getResource
		});
		result = new I18n();
		return result;
	}

	if (isAmd) { //AMD
		if (isDojo) {
			define(['./extend', './ext/Evented', 'dojo/text', './deferredUtils'], moduleExport);
		}
		else {
			define(['./extend', './ext/Evented', './text', './deferredUtils'], moduleExport);
		}
	} else if (isNode) { //Server side
		module.exports = moduleExport(req('./extend'), req('./ext/Evented'), {}, req('./deferredUtils'));
	} else { //Try to inject in global (hopefully no one does this ever)
		var i18n = moduleExport(global.ninejs.extend, global.ninejs.ext.Evented, {}, global.ninejs.core.deferredUtils);
		global.ninejs.extend.mixinRecursive(global, { ninejs: { core: { i18n: i18n } } });
	}
})(this);