(function(global) {
	'use strict';
	var isAmd = (typeof(define) !== 'undefined') && define.amd;
	var isNode = (typeof(window) === 'undefined');
	var req = require;
	function moduleExport(extend, Properties, config, deferredUtils) {
		function getConfigObject(m, config) {
			var cfgObj = {}, cnt;
			for (cnt = 0; cnt < m.provides.length; cnt += 1) {
				cfgObj[m.provides[cnt].id] = config.units[m.provides[cnt].id] || {};
			}
			return cfgObj;
		}
		function compareVersions(source, command, target) {
			function cmp(source, target) {
				var ar1 = source.split('.'), ar2 = target.split('.'), cnt, len, v1, v2, undef;
				len = ar1.length;
				if (ar2.length > len) {
					len = ar2.length;
				}
				for (cnt = 0; cnt < len; cnt += 1) {
					v1 = ar1[cnt];
					v2 = ar2[cnt];
					if (v1 === undef) {
						if (v2 === undef) {
							return 0;
						}
						else {
							return -1;
						}
					}
					else {
						if (v2 === undef) {
							return 1;
						}
						else {
							if ((v1 + 0) > (v2 + 0)) {
								return 1;
							}
							else if ((v1 + 0) < (v2 + 0)) {
								return -1;
							}
						}
					}
				}
				return 0;
			}
			var fn = function() {
				return false;
			};
			switch (command) {
			case '>':
				fn = function(source, target) {
					return cmp(source, target) > 0;
				};
				break;
			case '>=':
				fn = function(source, target) {
					return cmp(source, target) >= 0;
				};
				break;
			case '<':
				fn = function(source, target) {
					return cmp(source, target) < 0;
				};
				break;
			case '<=':
				fn = function(source, target) {
					return cmp(source, target) <= 0;
				};
				break;
			}
			return fn(source, target);
		}
		//TODO: for now it just supports '*' or exact version
		function areVersionsCompatible(source, target) {
			if (!target || target === '*' || (source === true)){
				return true;
			}
			var spl = target.split(' '), cnt;
			if (spl.length > 1) {
				var command, result = true, val;
				for (cnt = 0; cnt < spl.length; cnt += 1) {
					if ((cnt % 2) === 0) {
						command =  spl[cnt];
					}
					else {
						val = spl[cnt];
						result = result && compareVersions(source, command, val);
					}
				}
				return result && ((cnt % 2) === 0);
			}
			return source === target;
		}
		var ModuleRegistry = extend(Properties, function() {
			extend.mixin(this, {
				providesList: {}
			});
			var moduleList = [];
			var moduleSet = {};
			this.enabledUnits = {};
			this.addModule = function(m) {
				var p, currentProvides = [], cnt, self = this;
				for(cnt = 0; cnt < m.provides.length; cnt += 1) {
					if (this.providesList[m.provides[cnt].id]) {
						throw new Error('Duplicate provides. Unable to add ' + p + ' because it\'s already there');
					}
					else {
						currentProvides[m.provides[cnt].id] = m.provides[cnt];
					}
				}
				for (p in currentProvides) {
					if (currentProvides.hasOwnProperty(p)) {
						this.providesList[p] = currentProvides[p];
						moduleSet[p] = m;
					}
				}
				moduleList.push(m);
				//Injecting getModule method
				m.getModuleDefinition = function(name) {
					if (self.Module.prototype.consumesModule.call(m, name)) {
						return moduleSet[name];
					}
					else {
						throw new Error('Cannot require a "' + name + '" unit that this module does not consume');
					}
				};
				m.getUnit = function(name) {
					if (self.Module.prototype.consumesModule.call(this, name)) {
						return moduleSet[name].getProvides.apply(moduleSet[name], arguments);
					}
					else {
						throw new Error('Cannot require a "' + name + '" unit that this module does not consume');
					}
				};
			};
			this.validate = function(m, enableOnDemand) {
				function errorIfNoDependencies() {
					if (!len) {
						for (cnt = 0; cnt < m.provides.length; cnt += 1) {
							if (m.provides[cnt].id === 'ninejs') {
								len += 1;
							}
						}
						if (!len) {
							messages += 'A module must at least consume "ninejs-server" or "ninejs-client"\n';
						}
					}
				}
				function processOnDemand(self) {
					if (enableOnDemand) {
						if (!moduleSet[current.id]) {
							throw new Error('module not found: "' + current.id + '". Perhaps you forgot to add it.');
						}
						if (!moduleSet[current.id].get('enabled')) {
							var tryModule = m.getModuleDefinition(current.id);
							if (tryModule) {
								return self.Module.prototype.enable.call(tryModule, getConfigObject(tryModule, config));
							}
						}
					}
				}
				function processConsumesFeatures(self) {
					if (current.features) {
						var p;
						var features = self.providesList[current.id].features;
						var requiredFeature;
						var providedFeature;
						for (p in current.features) {
							if (current.features.hasOwnProperty(p)) {
								requiredFeature = current.features[p];
								providedFeature = features?features[p]:false;
								if (!providedFeature){
									messages += 'unit "' + current.id + '" required a feature "' + p + '" that is not provided.\n';
								}
								else {
									if (!areVersionsCompatible(providedFeature, requiredFeature)){
										messages += 'incompatible versions on module "' + current.id + '" with feature "' + p + '". Your version is "' + providedFeature + '". Required version is: "' + requiredFeature + '"\n';
									}
								}
							}
						}
					}
				}
				var consumes = m.consumes, current, messages = '', len = 0, cnt;
				for (cnt = 0; cnt < consumes.length; cnt += 1) {
					len += 1;
					current = consumes[cnt];
					if (!this.providesList[current.id]){ //try enabling it
						var onDemandModules = this.get('onDemandModules') || {}, onDemand;
						//Scanning for on-demand modules
						if (onDemandModules[current.id] && !this.hasProvide(current.id)) {
							onDemand = req(onDemandModules[current.id]);
							this.addModule(onDemand);
						}
					}
					processOnDemand(this);
					if (this.providesList[current.id]) {
						if (!areVersionsCompatible(this.providesList[current.id].version, current.version)){
							messages += 'incompatible versions on module "' + current.id + '". Your version is "' + this.providesList[current.id].version + '". Required version is: "' + current.version + '"\n';
						}
						else {
							processConsumesFeatures(this);
						}
					}
					else {
						messages += 'missing dependency: "' + current.id + '" version: "' + current.version + '"\n';
					}
				}
				errorIfNoDependencies();
				return messages;
			};
			this.enableModules = function() {
				var currentModule, cnt, pArray = [];
				for (cnt = 0; cnt < moduleList.length; cnt += 1) {
					currentModule = moduleList[cnt];
					pArray.push(this.Module.prototype.enable.call(currentModule, getConfigObject(currentModule, config)));
				}
				return deferredUtils.when(deferredUtils.all(deferredUtils.mapToPromises(pArray)), function() {
					for (cnt = 0; cnt < moduleList.length; cnt += 1) {
						currentModule = moduleList[cnt];
						currentModule.emit('modulesEnabled', {});
					}
				}, function (err) {
					console.log('Error while enabling some modules');
					throw err;
				});
			};
			this.initUnit = function (unitId) {
				if (!this.enabledUnits[unitId]) {
					var unitConfig = config.units[unitId];
					var defer = deferredUtils.defer(),
						self = this;
					this.enabledUnits[unitId] = defer.promise;
					deferredUtils.when(moduleSet[unitId].init(unitId, unitConfig), function (r) {
						self.enabledUnits[unitId] = r || true;
						defer.resolve(r || true);
					}, console.error);
					if (this.enabledUnits[unitId] === true) {
						return true;
					}
					return this.enabledUnits[unitId].promise;
				}
			};
			this.build = function() {
				var cnt,
					pArray = [],
					tempPromiseArray,
					currentModule,
					t;
				for (cnt = 0; cnt < moduleList.length; cnt += 1) {
					currentModule = moduleList[cnt];
					tempPromiseArray = [];
					currentModule.emit('build', { promises: tempPromiseArray });
					for (t = 0; t < tempPromiseArray.length; t += 1) {
						pArray.push(tempPromiseArray[t]);
					}
				}
				return deferredUtils.when(deferredUtils.all(pArray), function() {
					return true;
				}, function (error) {
					console.log(error);
					throw error;
				});
			};
		},
		{
			hasProvide: function(id) {
				return !!this.providesList[id];
			}
		});
		return new ModuleRegistry();
	}
	if (isAmd) {
		define(['../core/extend', '../core/ext/Properties', './config', '../core/deferredUtils'], moduleExport);
	}
	else if (isNode) {
		module.exports = moduleExport(req('../core/extend'), req('../core/ext/Properties'), req('./config'), req('../core/deferredUtils'));
	}
	else {
		global.moduleRegistry = moduleExport(global.extend, global.Properties, global.config);
	}
})(this);