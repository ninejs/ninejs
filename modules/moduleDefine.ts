import extend from '../core/extend';
import Module from './Module';
import { when, isPromise } from '../core/deferredUtils';

export function define (consumes: any[], callback: (unitDefine: (item: any, provide: (...args: any[]) => any) => void) => void) {
	consumes = (consumes || []).map(function (item: any) {
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
	class ThisModule extends Module {
		consumes: any[];
		provides: any[];
		doInit (name: string, config: any) {
			if (typeof(provideMap[name]) !== 'undefined') {
				var args = [config],
					self = this;
				this.consumes.forEach(function (item) {
					args.push(self.getUnit(item.id));
				});
				var unitObj = provideMap[name].apply(null, args);
				if (unitObj) {
					if (isPromise(unitObj.init)) {
						return unitObj.init;
					}
					else if (typeof(unitObj.init) === 'function') {
						return when(unitObj.init(), (d) => {
							return d;
						}, (err) => {
							throw new Error(err);
						});
					}
					else {
						return unitObj;
					}
				}
				else {
					return unitObj;
				}
			}
		}
		getProvides (name: string) {
			if (typeof(provideMap[name]) !== 'undefined') {
				return provideInstances[name];
			}
		}
		init () {
			Module.prototype.init.call(this);
			return this.doInit.apply(this, arguments);
		}
		constructor () {
			super();
			this.consumes = consumes;
		}
	}
	ThisModule.prototype.provides = [];
	var provideMap: { [ name: string ]: (...args: any[]) => any } = {},
		provideInstances: { [ name: string ]: any } = {};
	var provide = function (item: any, callback: (...args: any[]) => any) {
		if (typeof(item) === 'string') {
			item = {
				id: item
			};
		}
		ThisModule.prototype.provides.push(item);
		provideMap[item.id] = function (...args: any[]) {
			if (typeof(provideInstances[item.id]) === 'undefined') {
				provideInstances[item.id] = callback.apply(null, args);
			}
			return provideInstances[item.id];
		};
	};
	callback(provide);
	var result: any = new ThisModule();
	return <Module> result;
};