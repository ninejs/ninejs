(function (factory) {
    if (typeof module === 'object' && typeof module.exports === 'object') {
        var v = factory(require, exports); if (v !== undefined) module.exports = v;
    }
    else if (typeof define === 'function' && define.amd) {
        define(["require", "exports", '../core/ext/Properties', './moduleRegistry', '../core/ext/Evented', '../core/deferredUtils'], factory);
    }
})(function (require, exports) {
    var Properties_1 = require('../core/ext/Properties');
    var moduleRegistry_1 = require('./moduleRegistry');
    var Evented_1 = require('../core/ext/Evented');
    var deferredUtils_1 = require('../core/deferredUtils');
    var isAmd = (typeof (define) !== 'undefined') && define.amd;
    var isNode = (typeof (window) === 'undefined');
    var req = require;
    var postConstruct = function () {
        this.mixinProperties({
            modules: {},
            config: {}
        });
        if (!this.provides) {
            this.provides = [];
        }
        if (!this.consumes) {
            this.consumes = [];
        }
    };
    class Module extends Properties_1.default {
        constructor(args) {
            super(args);
            postConstruct.call(this);
        }
        on(type, listener) {
            var _on;
            _on = Evented_1.default.on;
            return _on.call(this, type, listener);
        }
        emit(type, data) {
            var _emit;
            _emit = Evented_1.default.emit;
            return _emit.call(this, type, data);
        }
        getProvides(name, ...args) {
            return this;
        }
        getFeature(id, name) {
            var provides = this.provides, cnt, found;
            for (cnt = 0; cnt < provides.length; cnt += 1) {
                if (provides[cnt].id === id) {
                    found = provides[cnt];
                }
            }
            if (found) {
                var feat = found.features[name];
                if (feat) {
                    if (typeof (feat) === 'function') {
                        var value = feat.call(this);
                        found.features[name] = value;
                        return value;
                    }
                    else {
                        return feat;
                    }
                }
            }
            return false;
        }
        init(name, config) {
            this.config[name] = config;
        }
        consumesModule(name) {
            var cnt, arr = this.consumes;
            for (cnt = 0; cnt < arr.length; cnt += 1) {
                if (arr[cnt].id === name) {
                    return true;
                }
            }
            return false;
        }
        providesModule(name) {
            var cnt, arr = this.provides;
            for (cnt = 0; cnt < arr.length; cnt += 1) {
                if (arr[cnt].id === name) {
                    return true;
                }
            }
            return false;
        }
        enable(config) {
            if (!this.get('enabled')) {
                var error = moduleRegistry_1.moduleRegistry.validate(this, true), errorProvides = [], cnt;
                return deferredUtils_1.when(error, (error) => {
                    if (error) {
                        for (cnt = 0; cnt < this.provides.length; cnt += 1) {
                            errorProvides.push(this.provides[cnt].id);
                        }
                        throw new Error('Error while trying to enable module with provides: "' + errorProvides.join(',') + '": \n' + error);
                    }
                    else {
                        var self = this;
                        return deferredUtils_1.when(deferredUtils_1.all(this.consumes.map(function (unit) {
                            if (!moduleRegistry_1.moduleRegistry.enabledUnits[unit.id]) {
                                return moduleRegistry_1.moduleRegistry.initUnit(unit.id);
                            }
                            else {
                                return moduleRegistry_1.moduleRegistry.enabledUnits[unit.id];
                            }
                        })), function () {
                            return deferredUtils_1.when(deferredUtils_1.all(self.provides.map(function (item) {
                                if (!moduleRegistry_1.moduleRegistry.enabledUnits[item.id]) {
                                    var _defer = deferredUtils_1.defer();
                                    moduleRegistry_1.moduleRegistry.enabledUnits[item.id] = _defer.promise;
                                    deferredUtils_1.when(self.init(item.id, config[item.id]), function () {
                                        _defer.resolve(true);
                                    }, (err) => {
                                        _defer.reject(err);
                                    });
                                    return moduleRegistry_1.moduleRegistry.enabledUnits[item.id];
                                }
                                else {
                                    return moduleRegistry_1.moduleRegistry.enabledUnits[item.id];
                                }
                            })), function () {
                                self.set('enabled', true);
                            }, function (err) {
                                console.log('Error while enabling some modules');
                                throw new Error(err);
                            });
                        }, function (err) {
                            console.log('Error while enabling some modules');
                            throw new Error(err);
                        });
                    }
                });
            }
            else {
                var t = deferredUtils_1.defer();
                t.resolve(true);
                return t.promise;
            }
        }
    }
    moduleRegistry_1.moduleRegistry.Module = Module;
    exports.default = Module;
});
//# sourceMappingURL=Module.js.map