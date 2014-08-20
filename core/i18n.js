(function(global) {
	'use strict';
	var isAmd = (typeof(define) !== 'undefined' && define.amd),
		isDojo = isAmd && define.amd.vendor === 'dojotoolkit.org',
		isNode = (typeof(window) === 'undefined'),
		req = require,
		path;

	function moduleExport(extend, Evented, amdText) {
		var json = global.JSON;
		function getFile(src, require, load, config) {
			var obj;
			if (isAmd) {
				obj = amdText.load(src, require, load, config);
			}
			else if (isNode) {
				obj = req(src);
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
					this.setLocale(shrt, true, require, load);
					parent = this.loaded[shrt];
					pathPart = shrt + '/' + locale.substr(3);
				}
				locale = locale || 'root';
				if (locale !== 'root') {
					getFile(this.baseUrl + '/' + pathPart + '/' + this.baseName, require, function (a) {
						var Constr = function() {};
						Constr.prototype = parent;
						result = new Constr();
						result.$njsLocale = locale;
						extend.mixin(result, json.parse(a));
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
			setLocale: function(locale, ignoreChangedEvent, require, load) {
				var self = this;
				if (this.locale !== locale) {
					if (!this.loaded.root) {
						this.loaded.root = this.root;
					}
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
						this.setLocale(locale.substr(0,2), ignoreChangedEvent, require, function (a) {
							self.locale = locale;
							self.setLocale(locale, ignoreChangedEvent, require, load);
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
					load(resourceSet);
				});
				return resourceSet;
			}
			if (!load) {
				obj = getFile(src, require, load, config);
				return rest(obj);
			}
			else {
				getFile(src, require, function(obj) {
					rest(json.parse(obj), load);
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
			define(['./extend', './ext/Evented', 'dojo/text'], moduleExport);
		}
		else {
			define(['./extend', './ext/Evented', './text'], moduleExport);
		}
	} else if (isNode) { //Server side
		module.exports = moduleExport(req('./extend'), req('./ext/Evented'), {});
	} else { //Try to inject in global (hopefully no one does this ever)
		var i18n = moduleExport(global.ninejs.extend, global.ninejs.ext.Evented, {}, global.ninejs.core.deferredUtils);
		global.ninejs.extend.mixinRecursive(global, { ninejs: { core: { i18n: i18n } } });
	}
})(this);