(function (factory) {
    if (typeof module === 'object' && typeof module.exports === 'object') {
        var v = factory(require, exports); if (v !== undefined) module.exports = v;
    }
    else if (typeof define === 'function' && define.amd) {
        define(["require", "exports", '../config', './moduleRegistry', './Module', '../core/extend', '../core/deferredUtils', './client/router', './ninejs-client', './client/container', './client/singlePageContainer'], factory);
    }
})(function (require, exports) {
    'use strict';
    var config_1 = require('../config');
    var moduleRegistry_1 = require('./moduleRegistry');
    var Module_1 = require('./Module');
    var extend_1 = require('../core/extend');
    var deferredUtils_1 = require('../core/deferredUtils');
    require('./client/router');
    require('./ninejs-client');
    require('./client/container');
    require('./client/singlePageContainer');
    var modules = config_1.default.ninejs.modules || {}, moduleArray = [], prefix = config_1.default.ninejs.prefix || 'ninejs', onDemandModules = {
        'ninejs': prefix + '/modules/ninejs-client',
        'router': prefix + '/modules/client/router',
        'container': prefix + '/modules/client/container',
        'singlePageContainer': prefix + '/modules/client/singlePageContainer'
    };
    moduleRegistry_1.moduleRegistry.set('onDemandModules', onDemandModules);
    for (var p in modules) {
        if (modules.hasOwnProperty(p)) {
            moduleArray.push(p);
        }
    }
    var moduleLoadPromise = deferredUtils_1.defer();
    require(moduleArray, function () {
        var cnt, current, allUnitsCfg = {}, unitCfg;
        for (cnt = 0; cnt < arguments.length; cnt += 1) {
            moduleRegistry_1.moduleRegistry.addModule(arguments[cnt]);
        }
        for (cnt = 0; cnt < arguments.length; cnt += 1) {
            current = arguments[cnt];
            unitCfg = modules[moduleArray[cnt]];
            extend_1.default.mixinRecursive(allUnitsCfg, unitCfg);
        }
        extend_1.default.mixinRecursive(config_1.default.ninejs, { units: {} });
        extend_1.default.mixinRecursive(allUnitsCfg, config_1.default.ninejs.units);
        extend_1.default.mixinRecursive(config_1.default.ninejs.units, allUnitsCfg);
        var arr = Array.prototype.map.call(arguments, function (current) {
            if (current.default) {
                current = current.default;
            }
            Module_1.default.prototype.enable.call(current, config_1.default.ninejs.units);
        });
        deferredUtils_1.when(deferredUtils_1.all(arr), function () {
            moduleLoadPromise.resolve(true);
        });
    });
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = deferredUtils_1.when(moduleLoadPromise.promise, function () {
        var deferred = deferredUtils_1.defer();
        deferredUtils_1.when(moduleRegistry_1.moduleRegistry.enableModules(), function (val) {
            deferred.resolve(val);
        }, function (error) {
            console.log(error);
            throw new Error(error);
        });
        return deferred.promise;
    }, function (error) {
        console.error(error);
        throw error;
    });
});
//# sourceMappingURL=clientBoot.js.map