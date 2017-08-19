'use strict';

import * as extend from '../core/extend';
import Properties from '../core/ext/Properties';
import modulesConfig from './config'
import ninejsConfig from '../config';
import { when, all, mapToPromises, defer, resolve } from '../core/deferredUtils';

declare var require: any;
var req = require;

var config: any = {};
extend.mixinRecursive(config, modulesConfig);
extend.mixinRecursive(config, ninejsConfig.ninejs);

function getConfigObject(m: any, config: any) {
	var cfgObj: { [ name: string ]: any } = {}, cnt: number;
	let units = ninejsConfig.ninejs.units || {};
	for (cnt = 0; cnt < m.provides.length; cnt += 1) {
		cfgObj[m.provides[cnt].id] = units[m.provides[cnt].id] || {};
	}
	return cfgObj;
}
function compareVersions(source: string, command: string, target: string) {
	function cmp(source: string, target: string) {
		var ar1 = source.split('.'), ar2 = target.split('.'),
			cnt: number,
			len: number,
			v1: string,
			v2: string;
		len = ar1.length;
		if (ar2.length > len) {
			len = ar2.length;
		}
		for (cnt = 0; cnt < len; cnt += 1) {
			v1 = ar1[cnt];
			v2 = ar2[cnt];
			if (typeof(v1) === 'undefined') {
				if (typeof(v2) === 'undefined') {
					return 0;
				}
				else {
					return -1;
				}
			}
			else {
				if (typeof(v2) === 'undefined') {
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
	var fn: Function = function() {
		return false;
	};
	switch (command) {
	case '>':
		fn = function(source: string, target: string) {
			return cmp(source, target) > 0;
		};
		break;
	case '>=':
		fn = function(source: string, target: string) {
			return cmp(source, target) >= 0;
		};
		break;
	case '<':
		fn = function(source: string, target: string) {
			return cmp(source, target) < 0;
		};
		break;
	case '<=':
		fn = function(source: string, target: string) {
			return cmp(source, target) <= 0;
		};
		break;
	}
	return fn(source, target);
}
//TODO: for now it just supports '*' or exact version
function areVersionsCompatible(source: any, target: string) {
	if (!target || target === '*' || (source === true)){
		return true;
	}
	var spl = target.split(' '),
		cnt: number;
	if (spl.length > 1) {
		var command: string,
			result = true,
			val: string;
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
export class ModuleRegistry extends Properties {
	addModule: (m: any) => void;
	build: () => Promise<any>;
	enableModules: () => Promise<any>;
	enabledUnits: { [ name: string ]: any };
	initUnit: (unitId: string) => Promise<any>;
	providesList: { [ name: string ]: any };
	validate: (m: any, enableOnDemand: boolean) => Promise<string>;
	Module: any;

	hasProvide(id: string) {
		return !!this.providesList[id];
	}

	constructor() {
		super({});
		extend.mixin(this, {
			providesList: {}
		});
		var moduleList: any[] = [];
		var moduleSet: { [ name: string ]: any } = {};
		this.enabledUnits = {};
		this.addModule = function (m: any) {
			var p: string,
				currentProvides: { [ name: string ]: any } = {},
				cnt: number,
				self = this;
			if ((!m.provides) && (m.default)) {
				m = m.default;
			}
			for (cnt = 0; cnt < m.provides.length; cnt += 1) {
				if (this.providesList[m.provides[cnt].id]) {
					throw new Error('Duplicate provides. Unable to add ' + m.provides[cnt].id + ' because it\'s already there');
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
			m.getModuleDefinition = function (name: string) {
				if (self.Module.prototype.consumesModule.call(m, name)) {
					return moduleSet[name];
				}
				else {
					throw new Error('Cannot require a "' + name + '" unit that this module does not consume');
				}
			};
			m.getUnit = function (name: string) {
				if (self.Module.prototype.consumesModule.call(this, name)) {
					return moduleSet[name].getProvides.apply(moduleSet[name], arguments);
				}
				else {
					throw new Error('Cannot require a "' + name + '" unit that this module does not consume');
				}
			};
		};
		this.validate = function (m: any, enableOnDemand: boolean) {
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

			function processOnDemand(self: ModuleRegistry, current: any) {
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

			function processConsumesFeatures(self: ModuleRegistry, current: any) {
				if (current.features) {
					var p: string;
					var features = self.providesList[current.id].features;
					var requiredFeature: any;
					var providedFeature: any;
					for (p in current.features) {
						if (current.features.hasOwnProperty(p)) {
							requiredFeature = current.features[p];
							providedFeature = features ? features[p] : false;
							if (!providedFeature) {
								messages += 'unit "' + current.id + '" required a feature "' + p + '" that is not provided.\n';
							}
							else {
								if (!areVersionsCompatible(providedFeature, requiredFeature)) {
									messages += 'incompatible versions on module "' + current.id + '" with feature "' + p + '". Your version is "' + providedFeature + '". Required version is: "' + requiredFeature + '"\n';
								}
							}
						}
					}
				}
			}

			var consumes = m.consumes,
				messages = '',
				len = 0,
				cnt: number;
			let defs = consumes.map((current: any) => {
				len += 1;
				if (!this.providesList[current.id]) { //try enabling it
					var onDemandModules = this.get('onDemandModules') || {},
						onDemand: any;
					//Scanning for on-demand modules
					if (onDemandModules[current.id] && !this.hasProvide(current.id)) {
						onDemand = req(onDemandModules[current.id]).default;
						this.addModule(onDemand);
					}
				}
				return when(processOnDemand(this, current), () => {
					if (this.providesList[current.id]) {
						if (!areVersionsCompatible(this.providesList[current.id].version, current.version)) {
							messages += 'incompatible versions on module "' + current.id + '". Your version is "' + this.providesList[current.id].version + '". Required version is: "' + current.version + '"\n';
						}
						else {
							processConsumesFeatures(this, current);
						}
					}
					else {
						messages += 'missing dependency: "' + current.id + '" version: "' + current.version + '"\n';
					}
				});
			});
			return when(all(defs), () => {
				errorIfNoDependencies();
				return messages;
			});
		};
		this.enableModules = function () {
			var currentModule: any,
				cnt: number,
				pArray: any[] = [];
			for (cnt = 0; cnt < moduleList.length; cnt += 1) {
				currentModule = moduleList[cnt];
				pArray.push(this.Module.prototype.enable.call(currentModule, getConfigObject(currentModule, config)));
			}
			return when(all(mapToPromises(pArray)), function () {
				for (cnt = 0; cnt < moduleList.length; cnt += 1) {
					currentModule = moduleList[cnt];
					currentModule.emit('modulesEnabled', {});
				}
			}, function (err) {
				console.log('Error while enabling some modules');
				throw err;
			});
		};
		this.initUnit = function (unitId: string) {
			if (!this.enabledUnits[unitId]) {
				var unitConfig = config.units[unitId];
				var _defer = defer(),
					self = this;
				this.enabledUnits[unitId] = _defer.promise;
				when(moduleSet[unitId].init(unitId, unitConfig), function (r) {
					self.enabledUnits[unitId] = r || true;
					_defer.resolve(r || true);
				}, console.error);
				return _defer.promise;
			}
			else {
				return resolve(this.enabledUnits[unitId]);
			}
		};
		this.build = function () {
			var cnt: number,
				pArray: any[] = [],
				tempPromiseArray: any[],
				currentModule: any,
				t: number;
			for (cnt = 0; cnt < moduleList.length; cnt += 1) {
				currentModule = moduleList[cnt];
				tempPromiseArray = [];
				currentModule.emit('build', {promises: tempPromiseArray});
				for (t = 0; t < tempPromiseArray.length; t += 1) {
					pArray.push(tempPromiseArray[t]);
				}
			}
			return when(all(pArray), function () {
				return true;
			}, function (error) {
				console.log(error);
				throw error;
			});
		};
	}
}
export var moduleRegistry = new ModuleRegistry;