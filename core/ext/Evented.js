(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports", "../on"], factory);
    }
})(function (require, exports) {
    'use strict';
    var on_1 = require("../on");
    var isAmd = (typeof (define) !== 'undefined') && define.amd, isDojo = isAmd && define.amd.vendor === 'dojotoolkit.org', isNode = (typeof (window) === 'undefined'), req = (isDojo && isNode) ? global.require : require;
    var result;
    if (isNode) {
        result = require('events').EventEmitter.prototype;
    }
    else {
        var on = require('../on'), aspect = require('../aspect');
        var after = aspect.after;
        result = {
            on: function (type, listener) {
                return on_1.default.parse(this, type, listener, function (target, type) {
                    return after(target, 'on' + type, listener, true);
                });
            },
            emit: function () {
                var arglist = [];
                for (var _i = 0; _i < arguments.length; _i++) {
                    arglist[_i] = arguments[_i];
                }
                var args = [this];
                args.push.apply(args, arglist);
                return on_1.default.emit.apply(on, args);
            }
        };
    }
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = result;
});
//# sourceMappingURL=Evented.js.map