'use strict';
var config = require('./config'),
	extend = require('../core/extend'),
	path = require('path'),
	fs = require('fs'),
	Q = require('kew'),
	registry = require('./moduleRegistry'),
	//trying to autodiscover modules from the /9js/modules folder
	njsModulesPath = path.resolve(process.cwd(), config.modulesFolder || '9js/modules'),
	loadModule,
	onDemandModules = {
		'ninejs': './ninejs-server',
		'webserver': './webserver/module'
	};
registry.set('onDemandModules', onDemandModules);
loadModule = function(dir) {
	function loadConfigFromUnit(id, config, currentConfigFile) {
		if (currentConfigFile) {
			if (!currentConfigFile.units) {
				currentConfigFile.units = {};
			}
			if (currentConfigFile.units[id]) {
				var cfg = {};
				cfg[id] = currentConfigFile.units[id];
				extend.mixinRecursive(cfg[id], (config.units[id] || {}));
				config.units[id] = cfg[id];
			}
		}
	}
	var currentModule = require(path.resolve(dir, 'module')), currentConfigPath = path.resolve(dir, '9js.config.json'), currentConfigFile, cnt, id;
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
};
if (config.modules) {
	var cnt, currentModule;
	for (cnt = 0; cnt < config.modules.length; cnt += 1) {
		currentModule = require(config.modules[cnt]);
		currentModule.loadedFrom(config.modules[cnt]);
		registry.addModule(currentModule);
	}
}
var moduleLoadPromise = {};
if (fs.existsSync(njsModulesPath)) {
	moduleLoadPromise = Q.nfcall(fs.readdir, njsModulesPath).then(function(files) {
		return Q.all(files.map(function(dir) {
			var dirpath = path.resolve(njsModulesPath, dir);
			return Q.nfcall(fs.stat, dirpath).then(function(stat) {
				if (stat.isDirectory()){
					loadModule(dirpath);
				}
			}, function(error) {
				throw new Error(error);
			});
		}));
	}, function(error) {
		throw new Error(error);
	});
}
module.exports = Q.resolve(moduleLoadPromise).then(function(){
	var defer = Q.defer();
	process.nextTick(function() {
		Q.resolve(registry.enableModules())
			.then(function(val) {
				defer.resolve(val);
			}, function (err) {
				console.error(err);
				defer.reject(err);
			});
	});
	return defer.promise;
}, function(error) {
	console.log(error);
	throw new Error(error);
});
