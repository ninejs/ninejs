(function (dependencies, factory) {
    if (typeof module === 'object' && typeof module.exports === 'object') {
        var v = factory(require, exports); if (v !== undefined) module.exports = v;
    }
    else if (typeof define === 'function' && define.amd) {
        define(dependencies, factory);
    }
})(["require", "exports", "./config", "../core/extend", "path", "fs", "../core/deferredUtils", "./moduleRegistry"], function (require, exports) {
    'use strict';
    var config_1 = require("./config");
    var extend_1 = require("../core/extend");
    var path = require("path");
    var fs = require("fs");
    var deferredUtils_1 = require("../core/deferredUtils");
    var moduleRegistry_1 = require("./moduleRegistry");
    var njsModulesPath = path.resolve(process.cwd(), config_1.default.modulesFolder || '9js/modules'), onDemandModules = {
        'ninejs': './ninejs-server',
        'webserver': './webserver/module'
    };
    moduleRegistry_1.moduleRegistry.set('onDemandModules', onDemandModules);
    function loadModule(dir) {
        function loadConfigFromUnit(id, config, currentConfigFile) {
            if (currentConfigFile) {
                if (!currentConfigFile.units) {
                    currentConfigFile.units = {};
                }
                if (currentConfigFile.units[id]) {
                    var cfg = {};
                    cfg[id] = currentConfigFile.units[id];
                    extend_1.default.mixinRecursive(cfg[id], (config.units[id] || {}));
                    config.units[id] = cfg[id];
                }
            }
        }
        var currentModule = require(path.resolve(dir, 'module')).default, currentConfigPath = path.resolve(dir, '9js.config.json'), currentConfigFile, cnt, id;
        currentModule.loadedFrom = path.resolve(dir, 'module');
        if (currentConfigPath) {
            currentConfigFile = require(currentConfigPath);
            for (cnt = 0; cnt < currentModule.provides.length; cnt += 1) {
                id = currentModule.provides[cnt].id;
                loadConfigFromUnit(id, config_1.default, currentConfigFile);
            }
            for (cnt = 0; cnt < currentModule.consumes.length; cnt += 1) {
                id = currentModule.consumes[cnt].id;
                loadConfigFromUnit(id, config_1.default, currentConfigFile);
            }
        }
        moduleRegistry_1.moduleRegistry.addModule(currentModule);
    }
    if (config_1.default.modules) {
        var cnt, currentModule;
        for (cnt = 0; cnt < config_1.default.modules.length; cnt += 1) {
            currentModule = require(config_1.default.modules[cnt]);
            if (currentModule.default) {
                currentModule = currentModule.default;
            }
            if (currentModule.loadedFrom) {
                currentModule.loadedFrom(config_1.default.modules[cnt]);
            }
            moduleRegistry_1.moduleRegistry.addModule(currentModule);
        }
    }
    var moduleLoadPromise = {};
    if (fs.existsSync(njsModulesPath)) {
        moduleLoadPromise = deferredUtils_1.nfcall(fs.readdir, njsModulesPath).then(function (files) {
            return deferredUtils_1.all(files.map(function (dir) {
                var dirpath = path.resolve(njsModulesPath, dir);
                return deferredUtils_1.nfcall(fs.stat, dirpath).then(function (stat) {
                    if (stat.isDirectory()) {
                        loadModule(dirpath);
                    }
                }, function (error) {
                    throw error;
                });
            }));
        }, function (error) {
            throw error;
        });
    }
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = deferredUtils_1.resolve(moduleLoadPromise).then(function () {
        var _defer = deferredUtils_1.defer();
        process.nextTick(function () {
            deferredUtils_1.resolve(moduleRegistry_1.moduleRegistry.enableModules())
                .then(function (val) {
                _defer.resolve(val);
            }, function (err) {
                console.error(err);
                _defer.reject(err);
            });
        });
        return _defer.promise;
    }, function (error) {
        console.log(error);
        console.log(error.stack);
        throw new Error(error);
    });
});
//# sourceMappingURL=serverBoot.js.map