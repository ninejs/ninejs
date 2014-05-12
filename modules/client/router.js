define(['../Module', '../../core/extend', '../../client/router', '../../client/hash', '../config'], function (Module, extend, router, hash, clientConfig) {
	'use strict';
	var HashRouter = Module.extend({
		getProvides: function(name) {
			if (name === 'router') {
				return router;
			}
		},
		init: extend.after(function(name, config) {
			var p, action;
			if (name === 'router') {
				for (p in config) {
					if (config.hasOwnProperty(p)) {
						if (typeof(config[p]) === 'string') {
							action = require(config[p]);
							router.register(p, action);
						}
					}
				}
			}
		}),
		consumes: [
			{
				id: 'ninejs'
			}
		],
		provides: [
			{
				id: 'router'
			}
		]
	});
	var result = new HashRouter();
	result.on('modulesEnabled', function() {
		router.startup();
		var start;
		start = hash() || clientConfig.boot;
		setTimeout(function() {
			if (start) {
				if (typeof(start) === 'function') {
					start();
				}
				else if (typeof(start) === 'string') {
					router.go(start, true);
				}
			}
			else {
				router.go('/', true);
			}
		});
	});
	return result;
});