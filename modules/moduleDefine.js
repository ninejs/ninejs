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
        define(["require", "exports", './Module', '../core/deferredUtils'], factory);
    }
})(function (require, exports) {
    var Module_1 = require('./Module');
    var deferredUtils_1 = require('../core/deferredUtils');
    function define(consumes, callback) {
        consumes = (consumes || []).map(function (item) {
            if (typeof (item) === 'string') {
                item = {
                    id: item
                };
            }
            if (!item.version) {
                item.version = '*';
            }
            return item;
        });
        var ThisModule = (function (_super) {
            __extends(ThisModule, _super);
            function ThisModule() {
                _super.call(this);
                this.consumes = consumes;
            }
            ThisModule.prototype.doInit = function (name, config) {
                if (typeof (provideMap[name]) !== 'undefined') {
                    var args = [config], self = this;
                    var consumers = this.consumes.map(function (item) {
                        var unit = self.getUnit(item.id);
                        args.push(unit);
                        if (unit) {
                            if (deferredUtils_1.isPromise(unit.init)) {
                                return unit.init;
                            }
                            else if (typeof (unit.init) === 'function') {
                                var d = deferredUtils_1.defer();
                                try {
                                    d.resolve(unit.init());
                                }
                                catch (err) {
                                    d.reject(err);
                                }
                                return d.promise;
                            }
                            else {
                                return unit;
                            }
                        }
                        else {
                            return unit;
                        }
                    });
                    return deferredUtils_1.when(deferredUtils_1.all(consumers), function () {
                        var unitObj = provideMap[name].apply(null, args);
                        if (unitObj) {
                            if (deferredUtils_1.isPromise(unitObj.init)) {
                                return unitObj.init;
                            }
                            else if (typeof (unitObj.init) === 'function') {
                                return deferredUtils_1.when(unitObj.init(), function (d) {
                                    return d;
                                }, function (err) {
                                    throw err;
                                });
                            }
                            else {
                                return unitObj;
                            }
                        }
                        else {
                            return unitObj;
                        }
                    });
                }
            };
            ThisModule.prototype.getProvides = function (name) {
                if (typeof (provideMap[name]) !== 'undefined') {
                    return provideInstances[name];
                }
            };
            ThisModule.prototype.init = function () {
                var _this = this;
                var x = Module_1.default.prototype.init.call(this);
                var args = arguments;
                return deferredUtils_1.when(x, function () {
                    return _this.doInit.apply(_this, args);
                });
            };
            return ThisModule;
        })(Module_1.default);
        ThisModule.prototype.provides = [];
        var provideMap = {}, provideInstances = {};
        var provide = function (item, callback) {
            if (typeof (item) === 'string') {
                item = {
                    id: item
                };
            }
            ThisModule.prototype.provides.push(item);
            provideMap[item.id] = function () {
                var args = [];
                for (var _i = 0; _i < arguments.length; _i++) {
                    args[_i - 0] = arguments[_i];
                }
                if (typeof (provideInstances[item.id]) === 'undefined') {
                    provideInstances[item.id] = callback.apply(null, args);
                }
                return provideInstances[item.id];
            };
        };
        callback(provide);
        var result = new ThisModule();
        return result;
    }
    exports.define = define;
    ;
});
//# sourceMappingURL=moduleDefine.js.map