'use strict';

import clientConfig from '../config'
import { moduleRegistry  as registry } from './moduleRegistry'
import Module from './Module'
import extend from '../core/extend'
import { defer, when, all, PromiseType } from '../core/deferredUtils'
import './client/router'
import './ninejs-client'
import './client/container'
import './client/singlePageContainer'

declare var require: any;

/*
Searches for defined client side 9js modules, requires them and initializes with their respective config

modules must have:
{
	mid: 'ninejs/sampleModule' //The AMD moduleID
}
*/
var modules = clientConfig.ninejs.modules || {},
	moduleArray: any[] = [],
	prefix = clientConfig.ninejs.prefix || 'ninejs',
	onDemandModules = {
		'ninejs': prefix + '/modules/ninejs-client',
		'router': prefix + '/modules/client/router',
		'container': prefix + '/modules/client/container',
		'singlePageContainer': prefix + '/modules/client/singlePageContainer'
	};
registry.set('onDemandModules', onDemandModules);
for (var p in modules) {
	if (modules.hasOwnProperty(p)) {
		moduleArray.push(p);
	}
}
var moduleLoadPromise = defer();
require(moduleArray, function() {
	var cnt: number,
		current: any,
		allUnitsCfg = {},
		unitCfg: any;
	for (cnt = 0; cnt < arguments.length; cnt += 1) {
		registry.addModule(arguments[cnt]);
	}
	for (cnt = 0; cnt < arguments.length; cnt += 1) {
		current = arguments[cnt];
		unitCfg = modules[moduleArray[cnt]];
		extend.mixinRecursive(allUnitsCfg, unitCfg);
	}
	extend.mixinRecursive(clientConfig.ninejs, { units: {} });
	extend.mixinRecursive(allUnitsCfg, clientConfig.ninejs.units);
	extend.mixinRecursive(clientConfig.ninejs.units, allUnitsCfg);
	let arr = Array.prototype.map.call(arguments, (current: any) => {
		if (current.default) {
			current = current.default;
		}
		Module.prototype.enable.call(current, clientConfig.ninejs.units);
	});
	when(all(arr), () => {
		moduleLoadPromise.resolve(true);
	});
});
export { PromiseType };
export default when(moduleLoadPromise.promise, function(){
	var deferred = defer();
	when(registry.enableModules(), function(val: any) {
		deferred.resolve(val);
	}, function (error: any) {
		console.log(error);
		throw new Error(error);
	});
	return deferred.promise;
}, function(error) {
	console.error(error);
	throw error;
});