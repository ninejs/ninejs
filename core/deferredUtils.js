(function (factory) {
    if (typeof module === 'object' && typeof module.exports === 'object') {
        var v = factory(require, exports); if (v !== undefined) module.exports = v;
    }
    else if (typeof define === 'function' && define.amd) {
        define(["require", "exports", './bluebird'], factory);
    }
})(function (require, exports) {
    var bluebird_1 = require('./bluebird');
    var nativePromise = typeof (Promise) === 'function';
    ;
    ;
    var Q = bluebird_1.default;
    function isPromise(valueOrPromise) {
        return valueOrPromise && (typeof (valueOrPromise.then) === 'function');
    }
    exports.isPromise = isPromise;
    var _mapToPromises;
    var _defer;
    var _when;
    var _all;
    var _delay;
    var _series;
    if (nativePromise) {
        _mapToPromises = function (arr) {
            var cnt, len = arr.length, current, result = [];
            for (cnt = 0; cnt < len; cnt += 1) {
                current = arr[cnt];
                result.push(Promise.resolve(current));
            }
            return result;
        };
        _defer = function (r) {
            var pResolve, pReject, p = new Promise(function (resolve, reject) {
                pResolve = resolve;
                pReject = reject;
            });
            p.resolve = function (v) {
                setTimeout(function () {
                    pResolve(v);
                }, 0);
            };
            p.reject = function (v) {
                setTimeout(function () {
                    pReject(v);
                }, 0);
            };
            p.promise = p;
            if (arguments.length) {
                p.resolve(r);
            }
            return p;
        };
        _when = function (v, success, reject, fin) {
            if (isPromise(v)) {
                return Promise.resolve(v).then(success, reject);
            }
            else {
                return Promise.resolve(success(v));
            }
        };
        _all = function (arr) {
            if (!arr.length) {
                return Promise.resolve([]);
            }
            else {
                return Promise.all(arr);
            }
        };
        _delay = function (ms) {
            return new Promise(function (resolve) {
                setTimeout(function () {
                    resolve(true);
                }, ms);
            });
        };
    }
    else {
        _mapToPromises = function (arr) {
            var cnt, len = arr.length, current, defer, result = [];
            for (cnt = 0; cnt < len; cnt += 1) {
                current = arr[cnt];
                if (this.isPromise(current)) {
                    result.push(current);
                }
                else {
                    defer = this.defer();
                    defer.resolve(current);
                    result.push(defer.promise);
                }
            }
            return result;
        };
        _defer = function (r) {
            if (typeof (r) !== 'undefined') {
                var d = Q.defer();
                d.resolve(r);
                return d;
            }
            else {
                return Q.defer();
            }
        };
        _when = function (v, success, reject, fin) {
            var r;
            if (isPromise(v)) {
                r = v.then(success, reject);
            }
            else {
                r = resolve(v).then(success, reject);
            }
            if (typeof (fin) === 'function') {
                return r.fin(fin);
            }
            else {
                return r;
            }
        };
        _all = function () {
            return Q.all.apply(Q, arguments);
        };
        _delay = function () {
            return Q.delay.apply(Q, arguments);
        };
    }
    _series = function (taskList) {
        var t, currentPromise, result = _defer(), self = this;
        currentPromise = result.promise;
        taskList.forEach(function (cur) {
            var defer = self.defer();
            if (typeof (t) === 'function') {
                t = t();
            }
            if (!isPromise(t)) {
                t = self.when(t, function (t) {
                    return t;
                });
            }
            t.then(function () {
                defer.resolve(true);
            }, function (err) {
                defer.reject(err);
            });
            currentPromise = self.all([currentPromise, defer.promise]).then(cur.action || function () { });
        });
        result.resolve(true);
        return currentPromise;
    };
    exports.delay = _delay;
    exports.mapToPromises = _mapToPromises;
    exports.defer = _defer;
    exports.when = _when;
    exports.all = _all;
    exports.series = _series;
    function resolve(val) {
        var d = exports.defer();
        d.resolve(val);
        return d.promise;
    }
    exports.resolve = resolve;
    function ncall(fn, self) {
        var args = [];
        for (var _i = 2; _i < arguments.length; _i++) {
            args[_i - 2] = arguments[_i];
        }
        var d = exports.defer();
        function callback(err, result) {
            if (err) {
                if (err instanceof Error) {
                    d.reject(err);
                }
                else {
                    d.reject(new Error(err));
                }
            }
            else {
                d.resolve(result);
            }
        }
        ;
        args.push(callback);
        fn.apply(self, args);
        return d.promise;
    }
    exports.ncall = ncall;
    function nfcall(fn) {
        var args = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            args[_i - 1] = arguments[_i];
        }
        var d = exports.defer();
        function callback(err, result) {
            if (err) {
                if (err instanceof Error) {
                    d.reject(err);
                }
                else {
                    d.reject(new Error(err));
                }
            }
            else {
                d.resolve(result);
            }
        }
        args.push(callback);
        fn.apply(null, args);
        return d.promise;
    }
    exports.nfcall = nfcall;
});
//# sourceMappingURL=deferredUtils.js.map