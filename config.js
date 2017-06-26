(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports", "./core/extend", "./modules/config"], factory);
    }
})(function (require, exports) {
    'use strict';
    Object.defineProperty(exports, "__esModule", { value: true });
    var extend = require("./core/extend");
    var config_1 = require("./modules/config");
    var isAmd = (typeof (define) !== 'undefined') && define.amd;
    var isDojo = isAmd && define.amd.vendor === 'dojotoolkit.org';
    var isNode = (typeof (window) === 'undefined');
    var req = (isDojo && isNode) ? global.require : require;
    var dojoConfig;
    var _global = ((typeof (global) !== 'undefined') ? global : window) || {};
    if (isDojo) {
        if (!isNode) {
            dojoConfig = _global.dojoConfig || {};
        }
        else {
            dojoConfig = req('dojo/_base/config');
        }
    }
    var r;
    if (!isNode) {
        _global = window;
    }
    if (dojoConfig) {
        r = dojoConfig;
    }
    else if (_global.requirejs) {
        r = _global.requirejs.s.contexts._.config;
    }
    else {
        r = {};
    }
    r.ninejs = r.ninejs || {};
    extend.mixinRecursive(r.ninejs, _global.ninejsConfig || {});
    extend.mixinRecursive(r.ninejs, config_1.default || {});
    exports.default = r;
});
//# sourceMappingURL=config.js.map