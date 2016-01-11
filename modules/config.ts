'use strict';

/*
	sample config file:
	{
		modules: {
			'path': {
				//that module's settings
			}
		},
		modulesFolder: 'string' //Server side only
	}
*/
declare var define:{
	(deps:string[], callback:(...rest:any[]) => any): void;
	amd: any;
};
declare var require: any;
declare var process: any;
declare var global: any;

var isAmd = (typeof(define) !== 'undefined') && define.amd;
var isDojo = isAmd && define.amd.vendor === 'dojotoolkit.org';
var isNode = (typeof(window) === 'undefined');
var dojoConfig: any;
let _global: any = ((typeof(global) !== 'undefined') ? global : window) || {};
if (isDojo) {
	if (!isNode) {
		dojoConfig = _global.dojoConfig || {};
	}
	else {
		dojoConfig = require('dojo/_base/config');
	}
}
function mixin(src: any, target: any) {
	if (!src) {
		return;
	}
	var p: string;
	for (p in target) {
		if (target.hasOwnProperty(p)) {
			src[p] = target[p];
		}
	}
	return src;
}
function readConfigModules(njsConfig: any, finalConfig: any) {
	var arr = njsConfig.modules;
	if (arr) {
		for (var p in arr) {
			if (arr.hasOwnProperty(p)) {
				finalConfig.modules.push(p);
				for (var unitConfig in arr[p]) {
					if (arr[p].hasOwnProperty(unitConfig)) {
						finalConfig.units[unitConfig] = arr[p][unitConfig];
					}
				}
			}
		}
	}
}
var config: any = {},
	p: string,
	njs: any;
if (dojoConfig && dojoConfig.ninejs){
	njs = dojoConfig.ninejs;
	for (p in njs){
		if (njs.hasOwnProperty(p)) {
			config[p] = njs[p];
		}
	}
}
if (isNode) {
	try {
		let req = (isDojo && isNode) ? global.require : require;
		var fs = req('fs'),
			path = req('path'),
			njsConfigPath = path.resolve(process.cwd(), '9js.config.json'),
			njsConfig:any = {},
			finalConfig:any = {modules: [], units: {}};
		if (fs.existsSync(njsConfigPath)) {
			njsConfig = require(njsConfigPath);
			readConfigModules(njsConfig, finalConfig);
			mixin(config, finalConfig);
			mixin(config, njsConfig);
		}
	}
	catch (e) {
		// 'require' is not available in some test scenarios
	}
}
export default config;