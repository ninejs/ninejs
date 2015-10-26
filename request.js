(function (factory) {
    if (typeof module === 'object' && typeof module.exports === 'object') {
        var v = factory(require, exports); if (v !== undefined) module.exports = v;
    }
    else if (typeof define === 'function' && define.amd) {
        define(["require", "exports", "reqwest/reqwest"], factory);
    }
})(function (require, exports) {
    var req = require, isNode = typeof (window) === 'undefined', isAmd = typeof (define) === 'function' && define.amd, isDojo = isAmd && (define.amd.vendor === 'dojotoolkit.org');
    var request;
    if (isAmd) {
        if (isNode) {
            if (isDojo) {
                request = require.nodeRequire('request');
            }
            else {
                request = require('request');
            }
        }
        else {
            request = require('reqwest/reqwest');
        }
    }
    else if (typeof (exports) === 'object') {
        request = req('request');
    }
    function fn() {
        return request.apply(request, arguments);
    }
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = fn;
    var verb = function (v, args) {
        var obj;
        if (typeof (args[0]) === 'object') {
            obj = args[0];
        }
        else if (typeof (args[1]) === 'object') {
            obj = args[1];
            if (typeof (args[0]) === 'string') {
                obj.url = args[0];
                args.splice(0, 1);
            }
        }
        if (obj) {
            obj.method = v;
            if (obj.handleAs) {
                obj.type = obj.handleAs;
            }
        }
        return fn.apply(null, args);
    };
    function get() {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i - 0] = arguments[_i];
        }
        return verb('get', args);
    }
    exports.get = get;
    function post() {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i - 0] = arguments[_i];
        }
        return verb('post', args);
    }
    exports.post = post;
    function put() {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i - 0] = arguments[_i];
        }
        return verb('put', args);
    }
    exports.put = put;
    function del() {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i - 0] = arguments[_i];
        }
        return verb('delete', args);
    }
    exports.del = del;
    function patch() {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i - 0] = arguments[_i];
        }
        return verb('patch', args);
    }
    exports.patch = patch;
});
//# sourceMappingURL=request.js.map