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
(function(global) {
	'use strict';
	var isAmd = (typeof(define) !== 'undefined') && define.amd;
	var isDojo = isAmd && define.amd.vendor === 'dojotoolkit.org';
	var isNode = (typeof(window) === 'undefined');
	var req = require;
	function mixin(src, target) {
		if (!src) {
			return;
		}
		var p;
		for (p in target) {
			if (target.hasOwnProperty(p)) {
				src[p] = target[p];
			}
		}
		return src;
	}
	function moduleExport(dojoConfig) {
		function readConfigModules() {
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
		var config = {}, p, njs;
		if (dojoConfig && dojoConfig.ninejs){
			njs = dojoConfig.ninejs;
			for (var p in njs){
				if (njs.hasOwnProperty(p)) {
					config[p] = njs[p];
				}
			}
		}
		if (isNode) {
			var fs = req('fs'),
				path = req('path'),
				njsConfigPath = path.resolve(process.cwd(), '9js.config.json'),
				njsConfig = {},
				finalConfig = { modules: [], units: {} };
			if (fs.existsSync(njsConfigPath)) {
				njsConfig = require(njsConfigPath);
				readConfigModules();
				mixin(config, finalConfig);
				mixin(config, njsConfig);
			}
		}
		return config;
	}
	if (isAmd) {
		if (isDojo) {
			define(['dojo/_base/config'], moduleExport);
		}
		else {
			define(['./empty'], moduleExport);
		}
	}
	else if (isNode) {
		module.exports = moduleExport({}) || {};
	}
	else {
		global.config = moduleExport(global.ninejsConfig || {});
	}
})(this);