'use strict';

import Module from '../Module';
import extend from '../../core/extend';
import * as router from '../../client/router';
import hash from '../../client/hash';
import clientConfig from '../config';

class HashRouter extends Module {
	getProvides (name: string) {
		if (name === 'router') {
			return router;
		}
	}
	init (name: string, config: any) {
		super.init(name, config);
		var p: string, action: (evt: any) => any;
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
	}
	constructor () {
		super();
		this.consumes = [
			{
				id: 'ninejs'
			}
		];
		this.provides = [
			{
				id: 'router'
			}
		];
	}

}
var result: Module = new HashRouter();
result.on('modulesEnabled', function() {
	router.startup();
	var start: any;
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

export default result;