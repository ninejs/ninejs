'use strict';

import extend from '../core/extend';
import Module from './Module';
import winston = require('winston');
import { define } from './moduleDefine';
import {Logger} from "./logging";
var njs = require('../lib/ninejs');
var packageJson = require('../package.json');

export class NineJs extends Module {
	logger: { [ name: string ]: Logger };
	config: any;
	configGetter () {
		var r: any = null;
		if (this.config) {
			r = this.config['ninejs'];
		}
		return r;
	}
	loggerGetter (name: string) {
		function createLogger(config: any) {
			var loggingConfig = (config || {}).logging || [];
			var cnt: number;
			if (Object.prototype.toString.call(loggingConfig) !== '[object Array]') {
				loggingConfig = [loggingConfig];
			}
			var cfg: any;
			for (cnt = 0; cnt < loggingConfig.length; cnt += 1){
				if (loggingConfig[cnt].name === name){
					cfg = loggingConfig[cnt];
				}
			}
			cfg = cfg || ( loggingConfig[0] || {
				transports: [
					new (winston.transports.Console)(),
				]
			});
			let transports: any = winston.transports;
			cfg.transports = (cfg.transports || []).map(function(item: any) {
				if (transports[item.type]) {
					return new (transports[item.type])(item);
				}
				return item;
			});

			return new (winston.Logger)(cfg);
		}
		name = name || 'default';
		if (!this.logger[name]) {
			this.logger[name] = createLogger(this.config);
		}
		return this.logger[name];
	}
	init (name: string, config: any) {
		if (name === 'ninejs') {
			this.config = config;
			var log = this.get('logger');
			njs.on('log', function(data: any) {
				log.info(data.message);
			});
		}
	}
	constructor (args: any) {
		super(args);
		var provide: any = {
			id: 'ninejs',
			version: packageJson.version,
			features: {}
		};
		extend.mixin(this, {
			provides: [
				provide
			],
			logger: {}
		});
		provide.features['node.js'] = process.version.substr(1);//stripping out the 'v'
		//Testing for harmony (ES6). The only thing I could figure out that changes in an ES6 environment is the global.Map variable.
		if ((typeof(global) !== 'undefined') && (typeof(global.Map) === 'function')) {
			provide.features['harmony'] = true;
		}
	}
}
var result: Module = new NineJs(undefined);
export default result;
