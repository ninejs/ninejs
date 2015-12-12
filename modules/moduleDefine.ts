'use strict';

import extend from '../core/extend';
import Module from './Module';
import { when, isPromise, defer, all, resolve } from '../core/deferredUtils';

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
				let consumers = this.consumes.map(item => {
					let unit = self.getUnit(item.id);
					args.push(unit);
					return unit
				});
				return when(all(consumers), () => {
					var unitObj = provideMap[name].apply(null, args);
					if (unitObj) {
						if (isPromise(unitObj.init)) {
							return unitObj.init;
						}
						else if (typeof(unitObj.init) === 'function') {
							return when(unitObj.init(), (d) => {
								delete unitObj.init;
								return d;
							}, (err) => {
								throw err;
							});
						}
						else {
							return unitObj;
						}
					}
					else {
						return unitObj;
					}
				});
			}
		}
		getProvides (name: string) {
			if (typeof(provideMap[name]) !== 'undefined') {
				return provideInstances[name];
			}
		}
		init () {
			let x = Module.prototype.init.call(this);
			let args = arguments;
			return when(x, () => {
				return this.doInit.apply(this, args);
			});
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