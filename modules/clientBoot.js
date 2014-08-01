/*
Searched for defined client side 9js modules, requires them and initializes with their respective config

modules must have:
{
	mid: 'ninejs/sampleModule' //The AMD moduleID
}
*/
define(['./config', './moduleRegistry', './Module', '../core/extend', '../core/deferredUtils', './client/router', './ninejs-client', './client/container', './client/singlePageContainer'], function(clientConfig, registry, Module, extend, deferredUtils) {
	'use strict';
	var modules = clientConfig.modules || {},
		moduleArray = [],
		prefix = clientConfig.prefix || 'ninejs',
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
	var moduleLoadPromise = deferredUtils.defer();
	require(moduleArray, function() {
		var cnt,
			current,
			allUnitsCfg = {},
			unitCfg;
		for (cnt = 0; cnt < arguments.length; cnt += 1) {
			registry.addModule(arguments[cnt]);
		}
		for (cnt = 0; cnt < arguments.length; cnt += 1) {
			current = arguments[cnt];
			unitCfg = modules[moduleArray[cnt]];
			extend.mixinRecursive(allUnitsCfg, unitCfg);
		}
		extend.mixinRecursive(clientConfig, { units: {} });
		extend.mixinRecursive(allUnitsCfg, clientConfig.units);
		extend.mixinRecursive(clientConfig.units, allUnitsCfg);
		for (cnt = 0; cnt < arguments.length; cnt += 1) {
			current = arguments[cnt];
			Module.prototype.enable.call(current, clientConfig.units);
		}
		moduleLoadPromise.resolve(true);
	});
	return deferredUtils.when(moduleLoadPromise.promise, function(){
		var defer = deferredUtils.defer();
		deferredUtils.when(registry.enableModules(), function(val) {
			defer.resolve(val);
		}, function (error) {
			console.log(error);
			throw new Error(error);
		});
		return defer.promise;
	}, function(error) {
		console.log(error);
		throw new Error(error);
	});
});