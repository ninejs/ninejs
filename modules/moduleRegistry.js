var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
(function (factory) {
    if (typeof module === 'object' && typeof module.exports === 'object') {
        var v = factory(require, exports); if (v !== undefined) module.exports = v;
    }
    else if (typeof define === 'function' && define.amd) {
        define(["require", "exports", '../core/extend', '../core/ext/Properties', './config', '../config', '../core/deferredUtils'], factory);
    }
})(function (require, exports) {
    'use strict';
    var extend = require('../core/extend');
    var Properties_1 = require('../core/ext/Properties');
    var config_1 = require('./config');
    var config_2 = require('../config');
    var deferredUtils_1 = require('../core/deferredUtils');
    var req = require;
    var config = {};
    extend.mixinRecursive(config, config_1.default);
    extend.mixinRecursive(config, config_2.default.ninejs);
    function getConfigObject(m, config) {
        var cfgObj = {}, cnt;
        var units = config_2.default.ninejs.units || {};
        for (cnt = 0; cnt < m.provides.length; cnt += 1) {
            cfgObj[m.provides[cnt].id] = units[m.provides[cnt].id] || {};
        }
        return cfgObj;
    }
    function compareVersions(source, command, target) {
        function cmp(source, target) {
            var ar1 = source.split('.'), ar2 = target.split('.'), cnt, len, v1, v2;
            len = ar1.length;
            if (ar2.length > len) {
                len = ar2.length;
            }
            for (cnt = 0; cnt < len; cnt += 1) {
                v1 = ar1[cnt];
                v2 = ar2[cnt];
                if (typeof (v1) === 'undefined') {
                    if (typeof (v2) === 'undefined') {
                        return 0;
                    }
                    else {
                        return -1;
                    }
                }
                else {
                    if (typeof (v2) === 'undefined') {
                        return 1;
                    }
                    else {
                        if ((v1 + 0) > (v2 + 0)) {
                            return 1;
                        }
                        else if ((v1 + 0) < (v2 + 0)) {
                            return -1;
                        }
                    }
                }
            }
            return 0;
        }
        var fn = function () {
            return false;
        };
        switch (command) {
            case '>':
                fn = function (source, target) {
                    return cmp(source, target) > 0;
                };
                break;
            case '>=':
                fn = function (source, target) {
                    return cmp(source, target) >= 0;
                };
                break;
            case '<':
                fn = function (source, target) {
                    return cmp(source, target) < 0;
                };
                break;
            case '<=':
                fn = function (source, target) {
                    return cmp(source, target) <= 0;
                };
                break;
        }
        return fn(source, target);
    }
    function areVersionsCompatible(source, target) {
        if (!target || target === '*' || (source === true)) {
            return true;
        }
        var spl = target.split(' '), cnt;
        if (spl.length > 1) {
            var command, result = true, val;
            for (cnt = 0; cnt < spl.length; cnt += 1) {
                if ((cnt % 2) === 0) {
                    command = spl[cnt];
                }
                else {
                    val = spl[cnt];
                    result = result && compareVersions(source, command, val);
                }
            }
            return result && ((cnt % 2) === 0);
        }
        return source === target;
    }
    var ModuleRegistry = (function (_super) {
        __extends(ModuleRegistry, _super);
        function ModuleRegistry() {
            _super.call(this, {});
            extend.mixin(this, {
                providesList: {}
            });
            var moduleList = [];
            var moduleSet = {};
            this.enabledUnits = {};
            this.addModule = function (m) {
                var p, currentProvides = {}, cnt, self = this;
                if ((!m.provides) && (m.default)) {
                    m = m.default;
                }
                for (cnt = 0; cnt < m.provides.length; cnt += 1) {
                    if (this.providesList[m.provides[cnt].id]) {
                        throw new Error('Duplicate provides. Unable to add ' + m.provides[cnt].id + ' because it\'s already there');
                    }
                    else {
                        currentProvides[m.provides[cnt].id] = m.provides[cnt];
                    }
                }
                for (p in currentProvides) {
                    if (currentProvides.hasOwnProperty(p)) {
                        this.providesList[p] = currentProvides[p];
                        moduleSet[p] = m;
                    }
                }
                moduleList.push(m);
                m.getModuleDefinition = function (name) {
                    if (self.Module.prototype.consumesModule.call(m, name)) {
                        return moduleSet[name];
                    }
                    else {
                        throw new Error('Cannot require a "' + name + '" unit that this module does not consume');
                    }
                };
                m.getUnit = function (name) {
                    if (self.Module.prototype.consumesModule.call(this, name)) {
                        return moduleSet[name].getProvides.apply(moduleSet[name], arguments);
                    }
                    else {
                        throw new Error('Cannot require a "' + name + '" unit that this module does not consume');
                    }
                };
            };
            this.validate = function (m, enableOnDemand) {
                var _this = this;
                function errorIfNoDependencies() {
                    if (!len) {
                        for (cnt = 0; cnt < m.provides.length; cnt += 1) {
                            if (m.provides[cnt].id === 'ninejs') {
                                len += 1;
                            }
                        }
                        if (!len) {
                            messages += 'A module must at least consume "ninejs-server" or "ninejs-client"\n';
                        }
                    }
                }
                function processOnDemand(self, current) {
                    if (enableOnDemand) {
                        if (!moduleSet[current.id]) {
                            throw new Error('module not found: "' + current.id + '". Perhaps you forgot to add it.');
                        }
                        if (!moduleSet[current.id].get('enabled')) {
                            var tryModule = m.getModuleDefinition(current.id);
                            if (tryModule) {
                                return self.Module.prototype.enable.call(tryModule, getConfigObject(tryModule, config));
                            }
                        }
                    }
                }
                function processConsumesFeatures(self, current) {
                    if (current.features) {
                        var p;
                        var features = self.providesList[current.id].features;
                        var requiredFeature;
                        var providedFeature;
                        for (p in current.features) {
                            if (current.features.hasOwnProperty(p)) {
                                requiredFeature = current.features[p];
                                providedFeature = features ? features[p] : false;
                                if (!providedFeature) {
                                    messages += 'unit "' + current.id + '" required a feature "' + p + '" that is not provided.\n';
                                }
                                else {
                                    if (!areVersionsCompatible(providedFeature, requiredFeature)) {
                                        messages += 'incompatible versions on module "' + current.id + '" with feature "' + p + '". Your version is "' + providedFeature + '". Required version is: "' + requiredFeature + '"\n';
                                    }
                                }
                            }
                        }
                    }
                }
                var consumes = m.consumes, messages = '', len = 0, cnt;
                var defs = consumes.map(function (current) {
                    len += 1;
                    if (!_this.providesList[current.id]) {
                        var onDemandModules = _this.get('onDemandModules') || {}, onDemand;
                        if (onDemandModules[current.id] && !_this.hasProvide(current.id)) {
                            onDemand = req(onDemandModules[current.id]).default;
                            _this.addModule(onDemand);
                        }
                    }
                    return deferredUtils_1.when(processOnDemand(_this, current), function () {
                        if (_this.providesList[current.id]) {
                            if (!areVersionsCompatible(_this.providesList[current.id].version, current.version)) {
                                messages += 'incompatible versions on module "' + current.id + '". Your version is "' + _this.providesList[current.id].version + '". Required version is: "' + current.version + '"\n';
                            }
                            else {
                                processConsumesFeatures(_this, current);
                            }
                        }
                        else {
                            messages += 'missing dependency: "' + current.id + '" version: "' + current.version + '"\n';
                        }
                    });
                });
                return deferredUtils_1.when(deferredUtils_1.all(defs), function () {
                    errorIfNoDependencies();
                    return messages;
                });
            };
            this.enableModules = function () {
                var currentModule, cnt, pArray = [];
                for (cnt = 0; cnt < moduleList.length; cnt += 1) {
                    currentModule = moduleList[cnt];
                    pArray.push(this.Module.prototype.enable.call(currentModule, getConfigObject(currentModule, config)));
                }
                return deferredUtils_1.when(deferredUtils_1.all(deferredUtils_1.mapToPromises(pArray)), function () {
                    for (cnt = 0; cnt < moduleList.length; cnt += 1) {
                        currentModule = moduleList[cnt];
                        currentModule.emit('modulesEnabled', {});
                    }
                }, function (err) {
                    console.log('Error while enabling some modules');
                    throw err;
                });
            };
            this.initUnit = function (unitId) {
                if (!this.enabledUnits[unitId]) {
                    var unitConfig = config.units[unitId];
                    var _defer = deferredUtils_1.defer(), self = this;
                    this.enabledUnits[unitId] = _defer.promise;
                    deferredUtils_1.when(moduleSet[unitId].init(unitId, unitConfig), function (r) {
                        self.enabledUnits[unitId] = r || true;
                        _defer.resolve(r || true);
                    }, console.error);
                    return _defer.promise;
                }
                else {
                    return deferredUtils_1.resolve(this.enabledUnits[unitId]);
                }
            };
            this.build = function () {
                var cnt, pArray = [], tempPromiseArray, currentModule, t;
                for (cnt = 0; cnt < moduleList.length; cnt += 1) {
                    currentModule = moduleList[cnt];
                    tempPromiseArray = [];
                    currentModule.emit('build', { promises: tempPromiseArray });
                    for (t = 0; t < tempPromiseArray.length; t += 1) {
                        pArray.push(tempPromiseArray[t]);
                    }
                }
                return deferredUtils_1.when(deferredUtils_1.all(pArray), function () {
                    return true;
                }, function (error) {
                    console.log(error);
                    throw error;
                });
            };
        }
        ModuleRegistry.prototype.hasProvide = function (id) {
            return !!this.providesList[id];
        };
        return ModuleRegistry;
    }(Properties_1.default));
    exports.ModuleRegistry = ModuleRegistry;
    exports.moduleRegistry = new ModuleRegistry;
});
//# sourceMappingURL=moduleRegistry.js.map