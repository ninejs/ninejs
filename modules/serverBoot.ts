/// <reference path="../typings/tsd.d.ts" />

import config from './config';
import extend from '../core/extend';
import path = require('path');
import fs = require('fs');
import { all, nfcall, defer, PromiseType } from '../core/deferredUtils';
import { moduleRegistry as registry } from './moduleRegistry';

//trying to autodiscover modules from the /9js/modules folder
var njsModulesPath = path.resolve(process.cwd(), config.modulesFolder || '9js/modules'),
	onDemandModules = {
		'ninejs': './ninejs-server',
		'webserver': './webserver/module'
	};
registry.set('onDemandModules', onDemandModules);
function loadModule (dir: string) {
	function loadConfigFromUnit(id: string, config: any, currentConfigFile: any) {
		if (currentConfigFile) {
			if (!currentConfigFile.units) {
				currentConfigFile.units = {};
			}
			if (currentConfigFile.units[id]) {
				var cfg: any = {};
				cfg[id] = currentConfigFile.units[id];
				extend.mixinRecursive(cfg[id], (config.units[id] || {}));
				config.units[id] = cfg[id];
			}
		}
	}
	var currentModule = require(path.resolve(dir, 'module')).default,
		currentConfigPath = path.resolve(dir, '9js.config.json'),
		currentConfigFile: any,
		cnt: number,
		id: string;
	currentModule.loadedFrom = path.resolve(dir, 'module');
	if (currentConfigPath) {
		currentConfigFile = require(currentConfigPath);
		for (cnt = 0; cnt < currentModule.provides.length; cnt += 1) {
			id = currentModule.provides[cnt].id;
			loadConfigFromUnit(id, config, currentConfigFile);
		}
		for (cnt = 0; cnt < currentModule.consumes.length; cnt += 1) {
			id = currentModule.consumes[cnt].id;
			loadConfigFromUnit(id, config, currentConfigFile);
		}
	}
	registry.addModule(currentModule);
}
if (config.modules) {
	var cnt: number,
		currentModule: any;
	for (cnt = 0; cnt < config.modules.length; cnt += 1) {
		currentModule = require(config.modules[cnt]);
		currentModule.loadedFrom(config.modules[cnt]);
		registry.addModule(currentModule);
	}
}
var moduleLoadPromise = {};
if (fs.existsSync(njsModulesPath)) {
	moduleLoadPromise = nfcall<string[]>(fs.readdir, njsModulesPath).then(function(files) {
		return all(files.map(function(dir: string) {
			var dirpath = path.resolve(njsModulesPath, dir);
			return nfcall(fs.stat, dirpath).then(function(stat: fs.Stats) {
				if (stat.isDirectory()){
					loadModule(dirpath);
				}
			}, function(error: Error) {
				throw error;
			});
		}));
	}, (error: Error) => {
		throw error;
	});
}
export default defer(moduleLoadPromise).promise.then(function(){
	var _defer = defer();
	process.nextTick(function() {
		defer(registry.enableModules()).promise
			.then(function(val: any) {
				_defer.resolve(val);
			}, function (err: any) {
				console.error(err);
				_defer.reject(err);
			});
	});
	return _defer.promise;
}, function(error: any) {
	console.log(error);
	console.log(error.stack);
	throw new Error(error);
});
