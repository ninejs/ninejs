/// <reference path="../typings/node/node.d.ts" />
/// <reference path="../typings/bunyan/bunyan.d.ts" />


import extend from '../core/extend';
import Module from './Module';
import { define } from './moduleDefine';
import bunyan = require('bunyan');
var njs = require('../lib/ninejs');
var packageJson = require('../package.json');

class NineJs extends Module {
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
				name: 'ninejs',
				streams: [{
					level: 'info',
					type: 'raw',
					stream: {
						write: function(data: any) {
							console.log('[' + data.time.toDateString() + ' ' + data.time.toLocaleTimeString() + '] ' + data.msg);
						}
					}
				}]
			});
			(cfg.streams || []).forEach(function(item: any) {
				if (item.stream === 'console') {
					item.type = 'raw';
					item.stream = {
						write: function(data: any) {
							console.log('[' + data.time.toDateString() + ' ' + data.time.toLocaleTimeString() + '] ' + data.msg);
						}
					};
				}
			});
			return bunyan.createLogger(cfg);
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

export interface LoggerStream {
	type?: string;
	level?: number | string;
	path?: string;
	stream?: NodeJS.WritableStream | LoggerStream;
	closeOnExit?: boolean;
}
export interface Logger {
	addStream(stream:LoggerStream):void;
	level(value: number | string):void;
	levels(name: number | string, value: number | string):void;

	trace(error:Error, format?:any, ...params:any[]):void;
	trace(buffer:Buffer, format?:any, ...params:any[]):void;
	trace(obj:Object, format?:any, ...params:any[]):void;
	trace(format:string, ...params:any[]):void;
	debug(error:Error, format?:any, ...params:any[]):void;
	debug(buffer:Buffer, format?:any, ...params:any[]):void;
	debug(obj:Object, format?:any, ...params:any[]):void;
	debug(format:string, ...params:any[]):void;
	info(error:Error, format?:any, ...params:any[]):void;
	info(buffer:Buffer, format?:any, ...params:any[]):void;
	info(obj:Object, format?:any, ...params:any[]):void;
	info(format:string, ...params:any[]):void;
	warn(error:Error, format?:any, ...params:any[]):void;
	warn(buffer:Buffer, format?:any, ...params:any[]):void;
	warn(obj:Object, format?:any, ...params:any[]):void;
	warn(format:string, ...params:any[]):void;
	error(error:Error, format?:any, ...params:any[]):void;
	error(buffer:Buffer, format?:any, ...params:any[]):void;
	error(obj:Object, format?:any, ...params:any[]):void;
	error(format:string, ...params:any[]):void;
	fatal(error:Error, format?:any, ...params:any[]):void;
	fatal(buffer:Buffer, format?:any, ...params:any[]):void;
	fatal(obj:Object, format?:any, ...params:any[]):void;
	fatal(format:string, ...params:any[]):void;
}