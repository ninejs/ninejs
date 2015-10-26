import extend from '../core/extend';
import Properties from '../core/ext/Properties';
import { moduleRegistry } from './moduleRegistry';
import Evented from '../core/ext/Evented';
import { when, all, defer, PromiseType } from '../core/deferredUtils';

declare var define:{
	(deps:string[], callback:(...rest:any[]) => any): void;
	amd: any;
};
declare var require: any;

var isAmd = (typeof(define) !== 'undefined') && define.amd;
var isNode = (typeof(window) === 'undefined');
var req = require;

var postConstruct = function() {
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
};

class Module extends Properties {
	config: { [ name: string ]: any };
	consumes: any[];
	provides: any[];
	getModuleDefinition: (name: string) => any;
	getUnit: (name: string) => any;
	on (type: string, listener: (e?: any) => any) {
		var _on: any;
		_on = Evented.on;
		return _on.call(this, type, listener);
	}
	emit (type: string, data: any) {
		var _emit:any;
		_emit = Evented.emit;
		return _emit.call(this, type, data);
	}
	/*
	Override to return the appropriate provides object.
	*/
	getProvides (name: string, ...args: any[]): any {
		return <any> this;
	}
	getFeature (id: string, name: string) {
		var provides = this.provides,
			cnt: number,
			found: any;
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
	}
	init (name: string, config: any): any {
		this.config[name] = config;
	}
	consumesModule (name: string) {
		var cnt: number,
			arr = this.consumes;
		for (cnt = 0; cnt < arr.length; cnt += 1){
			if (arr[cnt].id === name) {
				return true;
			}
		}
		return false;
	}
	providesModule (name: string) {
		var cnt: number,
			arr = this.provides;
		for (cnt = 0; cnt < arr.length; cnt += 1) {
			if (arr[cnt].id === name) {
				return true;
			}
		}
		return false;
	}
	enable (config: any): PromiseType<any> {
		if (!this.get('enabled')) {
			var error = moduleRegistry.validate(this, true),
				errorProvides: string[] = [],
				cnt: number;
			return when(error, (error: string) =>{
				if (error) {
					for (cnt = 0; cnt < this.provides.length; cnt += 1) {
						errorProvides.push(this.provides[cnt].id);
					}
					throw new Error('Error while trying to enable module with provides: "' + errorProvides.join(',') + '": \n' + error);
				}
				else {
					var self = this;
					return when(all(this.consumes.map(function (unit) {
						if (!moduleRegistry.enabledUnits[unit.id]) {
							return moduleRegistry.initUnit(unit.id);
						}
						else {
							return moduleRegistry.enabledUnits[unit.id];
						}
					})), function () {
						return when(all(self.provides.map(function (item) {
							if (!moduleRegistry.enabledUnits[item.id]) {
								var _defer = defer();
								moduleRegistry.enabledUnits[item.id] = _defer.promise;
								when(self.init(item.id, config[item.id]), function () {
									_defer.resolve(true);
								}, (err:any) => {
									_defer.reject(err);
								});
								return moduleRegistry.enabledUnits[item.id];
							}
							else {
								return moduleRegistry.enabledUnits[item.id];
							}
						})), function () {
							self.set('enabled', true);
						}, function (err: any) {
							console.log('Error while enabling some modules');
							throw new Error(err);
						});
					}, function (err: any) {
						console.log('Error while enabling some modules');
						throw new Error(err);
					});
				}
			});
		}
		else {
			var t = defer();
			t.resolve(true);
			return t.promise;
		}
	}
	constructor (args?: any) {
		super(args);
		postConstruct.call(this);
	}
}
moduleRegistry.Module = Module;
export default Module;