(function (factory) {
    if (typeof module === 'object' && typeof module.exports === 'object') {
        var v = factory(require, exports); if (v !== undefined) module.exports = v;
    }
    else if (typeof define === 'function' && define.amd) {
        define(["require", "exports"], factory);
    }
})(function (require, exports) {
    'use strict';
    var map = (function () {
        var map;
        if (typeof (Array.prototype.map) === 'function') {
            map = function (arr, fn) {
                return Array.prototype.map.call(arr, fn);
            };
        }
        else {
            map = function (arr, fn) {
                var cnt, len = arr.length, r = [];
                for (cnt = 0; cnt < len; cnt += 1) {
                    r.push(fn(arr[cnt], cnt, arr));
                }
                return r;
            };
        }
        return map;
    })();
    exports.map = map;
    var forEach = (function () {
        var forEach;
        if (typeof (Array.prototype.forEach) === 'function') {
            forEach = function (arr, fn) {
                return Array.prototype.forEach.call(arr, fn);
            };
        }
        else {
            forEach = function (arr, fn) {
                var cnt, len = arr.length;
                for (cnt = 0; cnt < len; cnt += 1) {
                    fn(arr[cnt], cnt, arr);
                }
            };
        }
        return forEach;
    })();
    exports.forEach = forEach;
    var indexOf = (function () {
        var indexOf;
        if (typeof (Array.prototype.indexOf) === 'function') {
            indexOf = function (arr, obj) {
                return Array.prototype.indexOf.call(arr, obj);
            };
        }
        else {
            indexOf = function (arr, obj) {
                var cnt, len = arr.length;
                for (cnt = 0; cnt < len; cnt += 1) {
                    if (arr[cnt] === obj) {
                        return cnt;
                    }
                }
                return -1;
            };
        }
        return indexOf;
    })();
    exports.indexOf = indexOf;
    var filter = (function () {
        var filter;
        if (typeof (Array.prototype.filter) === 'function') {
            filter = function (arr, fun, thisArg) {
                return Array.prototype.filter.call(arr, fun, thisArg);
            };
        }
        else {
            filter = function (arr, fun, thisArg) {
                if (arr === void 0 || arr === null) {
                    throw new TypeError();
                }
                var t = Object(arr);
                var len = t.length >>> 0;
                if (typeof fun !== 'function') {
                    throw new TypeError();
                }
                var res = [];
                var thisArg = arguments.length >= 2 ? arguments[1] : void 0;
                for (var i = 0; i < len; i += 1) {
                    if (i in t) {
                        var val = t[i];
                        if (fun.call(thisArg, val, i, t)) {
                            res.push(val);
                        }
                    }
                }
                return res;
            };
        }
        return filter;
    })();
    exports.filter = filter;
});
//# sourceMappingURL=array.js.map