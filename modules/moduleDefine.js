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
        class ThisModule extends Module_1.default {
            constructor() {
                super();
                this.consumes = consumes;
            }
            doInit(name, config) {
                if (typeof (provideMap[name]) !== 'undefined') {
                    var args = [config], self = this;
                    let consumers = this.consumes.map(item => {
                        let unit = self.getUnit(item.id);
                        args.push(unit);
                        return unit;
                    });
                    return deferredUtils_1.when(deferredUtils_1.all(consumers), () => {
                        var unitObj = provideMap[name].apply(null, args);
                        if (unitObj) {
                            if (deferredUtils_1.isPromise(unitObj.init)) {
                                return unitObj.init;
                            }
                            else if (typeof (unitObj.init) === 'function') {
                                return deferredUtils_1.when(unitObj.init(), (d) => {
                                    delete unitObj.init;
                                    return d;
                                }, (err) => {
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
            }
            getProvides(name) {
                if (typeof (provideMap[name]) !== 'undefined') {
                    return provideInstances[name];
                }
            }
            init() {
                let x = Module_1.default.prototype.init.call(this);
                let args = arguments;
                return deferredUtils_1.when(x, () => {
                    return this.doInit.apply(this, args);
                });
            }
        }
        ThisModule.prototype.provides = [];
        var provideMap = {}, provideInstances = {};
        var provide = function (item, callback) {
            if (typeof (item) === 'string') {
                item = {
                    id: item
                };
            }
            ThisModule.prototype.provides.push(item);
            provideMap[item.id] = function (...args) {
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