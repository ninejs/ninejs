'use strict';
var Module = require('../Module');
var extend = require('../../core/extend');
var packageJson = require('../../package.json');
var WebServer = require('./WebServer');
var servers = {};
var Mod = extend(Module, {
	getProvides: function(name, serverName) {
		if (name === 'webserver') {
			serverName = serverName || 'default';
			return servers[serverName];
		}
	},
	init: extend.after(function(name, config) {
		if (name === 'webserver') {
			var p, first;
			for (p in config) {
				if (config.hasOwnProperty(p)) {
					var server = new WebServer();
					server.set('logger', this.getUnit('ninejs').get('logger'));
					server.init(config[p]);
					servers[p] = server;
					if (!first) {
						first = server;
					}
				}
			}
			if (!servers['default']) {
				servers['default'] = first;
			}
			if (!first) {
				throw new Error('Must configure at least one webserver. See webserver docs');
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
			id: 'webserver',
			version: packageJson.version
		}
	]
});
var result = new Mod();
result.on('modulesEnabled', function() {
	process.nextTick(function() {
		var item, p;
		for (p in servers) {
			if (servers.hasOwnProperty(p)) {
				item = servers[p];
				item.postCreate();
			}
		}
	});
});
result.on('build', function(data) {
	var promises = data.promises;//Array of promises
	process.nextTick(function() {
		var item, p;
		for (p in servers) {
			if (servers.hasOwnProperty(p)) {
				item = servers[p];
				promises.push(item.build());
			}
		}
	});
});
module.exports = result;