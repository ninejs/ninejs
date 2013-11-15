(function(global) {
	'use strict';
	var isAmd = (typeof(define) !== 'undefined') && define.amd;
	var isNode = (typeof(window) === 'undefined');
	var req = require;
	function moduleExport(extend, Properties, moduleRegistry, Evented) {
		var Module = extend(Properties, Evented, {
			/*
			Override to return the appropriate provides object.
			*/
			getProvides: function() {
				return this;
			},
			getFeature: function(id, name) {
				var provides = this.provides,
					cnt,
					found;
				for (cnt = 0; cnt < provides.length; cnt += 1){
					if (provides[cnt].id === id){
						found = provides[cnt];
					}
				}
				if (found) {
					var feat = found.features[name];
					if (feat) {
						if (typeof(feat) === 'function'){
							var value = feat.call(this);
							found.features[name] = value;
							return value;
						}
						else {
							return feat;
						}
					}
				}
				return false;
			},
			init: function(name, config) {
				this.config[name] = config;
			},
			consumesModule: function(name) {
				var cnt, arr = this.consumes;
				for (cnt = 0; cnt < arr.length; cnt += 1){
					if (arr[cnt].id === name) {
						return true;
					}
				}
				return false;
			},
			providesModule: function(name) {
				var cnt, arr = this.provides;
				for (cnt = 0; cnt < arr.length; cnt += 1) {
					if (arr[cnt].id === name) {
						return true;
					}
				}
				return false;
			},
			enable: function(config) {
				if (!this.get('enabled')) {
					var error = moduleRegistry.validate(this, true), errorProvides = [], cnt;
					if (error) {
						for (cnt = 0; cnt < this.provides; cnt += 1) {
							errorProvides.push(this.provides[cnt].id);
						}
						throw new Error('Error while trying to enable module with provides: "' + errorProvides.join(',') + '": \n' + error);
					}
					else {
						for (cnt = 0; cnt < this.provides.length; cnt += 1) {
							this.init(this.provides[cnt].id, config[this.provides[cnt].id]);
						}
						this.set('enabled', true);
					}
				}
				return true;
			}
		}, extend.postConstruct(function() {
			this.mixinProperties({
				/*
				filled at runtime with consumes instances
				*/
				modules: {},
				config: {}
			});
			if (!this.provides) {
				/*
				id, version
				*/
				this.provides = [];
			}
			if (!this.consumes) {
				/*
				id, version (optional constraint, * for latest)
				*/
				this.consumes = [];
			}
		}));
		moduleRegistry.Module = Module;
		return Module;
	}
	if (isAmd) {
		define(['../core/extend', '../core/ext/Properties', './moduleRegistry', '../core/ext/Evented'], moduleExport);
	}
	else if (isNode) {
		module.exports = moduleExport(req('../core/extend'), req('../core/ext/Properties'), req('./moduleRegistry'), req('../core/ext/Evented'));
	}
	else {
		global.Module = moduleExport(global.extend, global.Properties, global.moduleRegistry, global.Evented);
	}
})(this);