(function () {
	'use strict';
	var isAmd = (typeof(define) !== 'undefined') && define.amd;
	var req = require;
	(function (factory) {
		if (isAmd) {
			define(['../core/extend', '../modules/Module'], factory);
		}
		else {
			module.exports = factory(req('../core/extend'), req('../modules/Module'));
		}
	})(function (extend, Module) {
		return function (consumes, callback) {
			consumes = (consumes || []).map(function (item) {
				if (typeof(item) === 'string') {
					item = {
						id: item
					};
				}
				if (!item.version) {
					item.version = '*';
				}
				return item;
			});
			var ThisModule = extend(Module, {
				consumes: consumes,
				provides: [],
				init: extend.after(function () {
					return this.doInit.apply(this, arguments);
				})
			});
			var provideMap = {},
				provideInstances = {};
			var provide = function (item, callback) {
				if (typeof(item) === 'string') {
					item = {
						id: item
					};
				}
				ThisModule.prototype.provides.push(item);
				provideMap[item.id] = function () {
					if (typeof(provideInstances[item.id]) === 'undefined') {
						provideInstances[item.id] = callback.apply(null, arguments);
					}
					return provideInstances[item.id];
				};
			};
			ThisModule.prototype.getProvides = function (name) {
				if (typeof(provideMap[name]) !== 'undefined') {
					return provideInstances[name];
				}
			};
			ThisModule.prototype.doInit = function (name, config) {
				if (typeof(provideMap[name]) !== 'undefined') {
					var args = [config],
						self = this;
					this.consumes.forEach(function (item) {
						args.push(self.getUnit(item.id));
					});
					return provideMap[name].apply(null, args);
				}
			};
			callback(provide);
			var result = new ThisModule();
			return result;
		};
	});
})();