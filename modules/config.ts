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

var isAmd = (typeof(define) !== 'undefined') && define.amd;
var isDojo = isAmd && define.amd.vendor === 'dojotoolkit.org';
var isNode = (typeof(window) === 'undefined');
var req = require;
var dojoConfig: any;
if (isDojo) {
	dojoConfig = require('dojo/_base/config');
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
	var fs = req('fs'),
		path = req('path'),
		njsConfigPath = path.resolve(process.cwd(), '9js.config.json'),
		njsConfig: any = {},
		finalConfig: any = { modules: [], units: {} };
	if (fs.existsSync(njsConfigPath)) {
		njsConfig = require(njsConfigPath);
		readConfigModules(njsConfig, finalConfig);
		mixin(config, finalConfig);
		mixin(config, njsConfig);
	}
}
export default config;