'use strict';

import Module from '../Module';
import WebServer from './WebServer';
var packageJson = require('../../package.json');
var servers: { [ name: string ]: WebServer } = {};
class Mod extends Module {
	getProvides (name: string, ...args: any[]) {
		if (name === 'webserver') {
			var serverName: string = (<string>args[0]) || 'default';
			return servers[serverName];
		}
	}
	init (name: string, config: any) {
		super.init(name, config);
		if (name === 'webserver') {
			var p: string,
				first: WebServer;
			for (p in config) {
				if (config.hasOwnProperty(p)) {
					var server = new WebServer({});
					server.getServer = (name: string) => {
						return servers[name];
					};
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
	}
	constructor (args: any) {
		super(args);
		this.consumes = [
			{
				id: 'ninejs'
			}
		];
		this.provides = [
			{
				id: 'webserver',
				version: packageJson.version
			}
		];
	}
}
var result: Module = new Mod(undefined);
result.on('modulesEnabled', function() {
	process.nextTick(function() {
		var item: WebServer,
			p: string;
		for (p in servers) {
			if (servers.hasOwnProperty(p)) {
				item = servers[p];
				item.serverName = p;
				item.postCreate();
			}
		}
	});
});
result.on('build', function(data) {
	var promises = data.promises;//Array of promises
	process.nextTick(function() {
		var item: WebServer,
			p: string;
		for (p in servers) {
			if (servers.hasOwnProperty(p)) {
				item = servers[p];
				promises.push(item.build());
			}
		}
	});
});
export default result;