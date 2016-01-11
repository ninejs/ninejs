(function (factory) {
    if (typeof module === 'object' && typeof module.exports === 'object') {
        var v = factory(require, exports); if (v !== undefined) module.exports = v;
    }
    else if (typeof define === 'function' && define.amd) {
        define(["require", "exports", '../extend', '../objUtils'], factory);
    }
})(function (require, exports) {
    'use strict';
    var extend_1 = require('../extend');
    var objUtils_1 = require('../objUtils');
    var emitToWatchList;
    function sliceArguments(arr, refIndex) {
        var r = [];
        for (var cnt = refIndex; cnt < arr.length; cnt += 1) {
            r.push(arr[cnt]);
        }
        return r;
    }
    var watchIdCount = 0;
    var WatchHandleConstructor = extend_1.default({
        pause: function () {
            if (this.action && !this.action['$njsIsEmpty']) {
                this.bkAction = this.action;
                this.action = function () { };
                this.action['$njsIsEmpty'] = true;
            }
        },
        resume: function () {
            if (this.action && this.action['$njsIsEmpty']) {
                this.action = this.bkAction;
                this.bkAction = null;
                delete this.bkAction;
            }
        },
        remove: function () {
            var cnt, found = -1;
            for (cnt = 0; cnt < this.watchList.length; cnt += 1) {
                if (this.watchList[cnt].id === this.id) {
                    found = cnt;
                }
            }
            if (found >= 0) {
                this.watchList.splice(found, 1);
            }
        }
    }, function (action, watchList) {
        watchIdCount += 1;
        this.id = watchIdCount;
        this.action = action;
        this.watchList = watchList;
    });
    var excludedProperties = {
        '$njsConstructors': true,
        '$njsWatch': true
    };
    var EventedArrayConstructor = extend_1.default(Array, function (arr) {
        var cnt, len;
        if (arr && arr.length) {
            len = arr.length;
            for (cnt = 0; cnt < len; cnt += 1) {
                this.push(arr[cnt]);
            }
        }
    }), mixRecursive;
    function getMixedElement(element) {
        var evArray, properties;
        if (objUtils_1.isArrayLike(element)) {
            evArray = new EventedArrayConstructor();
            mixRecursive(evArray, element);
            return evArray;
        }
        else if (typeof (element) === 'object') {
            properties = new Properties({});
            mixRecursive(properties, element);
            return properties;
        }
        else {
            return element;
        }
    }
    mixRecursive = function (src, tgt) {
        var arr, cnt, len;
        if (objUtils_1.isArrayLike(src) && objUtils_1.isArrayLike(tgt)) {
            while (src.length) {
                src.pop();
            }
            len = tgt.length;
            for (cnt = 0; cnt < len; cnt += 1) {
                src.push(getMixedElement(tgt[cnt]));
            }
        }
        else if (src && (typeof (src.set) === 'function') && tgt && (typeof (tgt) === 'object')) {
            for (var p in tgt) {
                if (tgt.hasOwnProperty(p)) {
                    if (objUtils_1.isArrayLike(tgt[p])) {
                        arr = tgt[p];
                        src[p] = new EventedArrayConstructor();
                        mixRecursive(src[p], arr);
                    }
                    else if (typeof (tgt[p]) === 'object') {
                        if (typeof (src[p]) === 'undefined') {
                            src[p] = new Properties({});
                        }
                        mixRecursive(src[p], tgt[p]);
                    }
                    else {
                        Properties.prototype.set.call(src, p, tgt[p]);
                    }
                }
            }
        }
    };
    var Properties = (function () {
        function Properties(props) {
            var argslist = [];
            for (var _i = 1; _i < arguments.length; _i++) {
                argslist[_i - 1] = arguments[_i];
            }
            var self = this, me = this, args = props, execute = function () {
                if (typeof (args) === 'object') {
                    for (var p in args) {
                        if (args.hasOwnProperty(p)) {
                            self.set(p, args[p]);
                        }
                    }
                }
            };
            this.$njsWatch = {};
            if (me.$njsInstanceDepth) {
                this.$njsConstructors.push(function (args) {
                    self.$njsConstructors.push(execute);
                });
            }
            else {
                execute();
            }
        }
        Properties.prototype.get = function (name) {
            var getter = this[name + 'Getter'], args;
            if (typeof (getter) === 'function') {
                args = sliceArguments(arguments, 1);
                return getter.apply(this, args);
            }
            else {
                return this[name];
            }
        };
        Properties.prototype.set = function (name) {
            var values = [];
            for (var _i = 1; _i < arguments.length; _i++) {
                values[_i - 1] = arguments[_i];
            }
            var result, value = values[0];
            if (typeof (name) === 'string') {
                var sname = name, old = this.get(sname), newValue = value, setter = this[sname + 'Setter'], args;
                if (typeof (setter) === 'function') {
                    args = sliceArguments(arguments, 1);
                    result = setter.apply(this, args);
                }
                else {
                    this[sname] = value;
                    result = this;
                }
                if (objUtils_1.isDate(old) && objUtils_1.isDate(newValue)) {
                    if (old.getTime() !== newValue.getTime()) {
                        emitToWatchList(this, name, old, newValue);
                    }
                }
                else if (old !== newValue) {
                    emitToWatchList(this, sname, old, newValue);
                }
            }
            else if (name) {
                for (var p in name) {
                    if (name.hasOwnProperty(p)) {
                        this.set(p, name[p]);
                    }
                }
                result = this;
            }
            return result;
        };
        Properties.prototype.watch = function (name, action) {
            var currentWatch = this.$njsWatch[name], result;
            if (!currentWatch) {
                currentWatch = this.$njsWatch[name] = [];
            }
            result = new WatchHandleConstructor(action, currentWatch);
            currentWatch.push(result);
            return result;
        };
        Properties.prototype.mixinProperties = function (target) {
            Properties.mixin(this)(target);
            return this;
        };
        Properties.prototype.mixinRecursive = function (target) {
            mixRecursive(this, target);
            return this;
        };
        Properties.mixin = function (target) {
            return function (args) {
                for (var p in args) {
                    if (args.hasOwnProperty(p)) {
                        Properties.prototype.set.call(target, p, args[p]);
                    }
                }
            };
        };
        Properties.getObject = function (obj) {
            var r = {};
            var arr;
            for (var p in obj) {
                if (obj.hasOwnProperty(p) && (!excludedProperties[p])) {
                    var t = obj[p];
                    if (objUtils_1.isArrayLike(t)) {
                        arr = [];
                        Array.prototype.forEach.call(t, function (item) {
                            if (typeof (item) === 'object') {
                                arr.push(Properties.getObject(item));
                            }
                            else {
                                arr.push(item);
                            }
                        });
                        r[p] = arr;
                    }
                    else if (typeof (t) === 'object') {
                        if (t === null) {
                            r[p] = null;
                        }
                        else {
                            r[p] = Properties.getObject(t);
                        }
                    }
                    else {
                        r[p] = t;
                    }
                }
            }
            return r;
        };
        return Properties;
    })();
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = Properties;
    ;
    emitToWatchList = function (self, name, oldValue, newValue) {
        var watchList = self.$njsWatch, watchProp, cnt;
        if (watchList) {
            watchProp = watchList[name];
            if (watchProp) {
                for (cnt = 0; cnt < watchProp.length; cnt += 1) {
                    watchProp[cnt].action.call(self, name, oldValue, newValue);
                }
            }
        }
    };
});
//# sourceMappingURL=Properties.js.map