var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
(function (deps, factory) {
    if (typeof module === 'object' && typeof module.exports === 'object') {
        var v = factory(require, exports); if (v !== undefined) module.exports = v;
    }
    else if (typeof define === 'function' && define.amd) {
        define(deps, factory);
    }
})(["require", "exports", '../core/ext/Properties', './moduleRegistry', '../core/ext/Evented', '../core/deferredUtils'], function (require, exports) {
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
    var Module = (function (_super) {
        __extends(Module, _super);
        function Module(args) {
            _super.call(this, args);
            postConstruct.call(this);
        }
        Module.prototype.on = function (type, listener) {
            var _on;
            _on = Evented_1.default.on;
            return _on.call(this, type, listener);
        };
        Module.prototype.emit = function (type, data) {
            var _emit;
            _emit = Evented_1.default.emit;
            return _emit.call(this, type, data);
        };
        Module.prototype.getProvides = function (name) {
            var args = [];
            for (var _i = 1; _i < arguments.length; _i++) {
                args[_i - 1] = arguments[_i];
            }
            return this;
        };
        Module.prototype.getFeature = function (id, name) {
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
        };
        Module.prototype.init = function (name, config) {
            this.config[name] = config;
        };
        Module.prototype.consumesModule = function (name) {
            var cnt, arr = this.consumes;
            for (cnt = 0; cnt < arr.length; cnt += 1) {
                if (arr[cnt].id === name) {
                    return true;
                }
            }
            return false;
        };
        Module.prototype.providesModule = function (name) {
            var cnt, arr = this.provides;
            for (cnt = 0; cnt < arr.length; cnt += 1) {
                if (arr[cnt].id === name) {
                    return true;
                }
            }
            return false;
        };
        Module.prototype.enable = function (config) {
            var _this = this;
            if (!this.get('enabled')) {
                var error = moduleRegistry_1.moduleRegistry.validate(this, true), errorProvides = [], cnt;
                return deferredUtils_1.when(error, function (error) {
                    if (error) {
                        for (cnt = 0; cnt < _this.provides.length; cnt += 1) {
                            errorProvides.push(_this.provides[cnt].id);
                        }
                        throw new Error('Error while trying to enable module with provides: "' + errorProvides.join(',') + '": \n' + error);
                    }
                    else {
                        var self = _this;
                        return deferredUtils_1.when(deferredUtils_1.all(_this.consumes.map(function (unit) {
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
                                    }, function (err) {
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
        };
        return Module;
    })(Properties_1.default);
    moduleRegistry_1.moduleRegistry.Module = Module;
    exports.default = Module;
});
//# sourceMappingURL=Module.js.map