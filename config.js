(function (deps, factory) {
    if (typeof module === 'object' && typeof module.exports === 'object') {
        var v = factory(require, exports); if (v !== undefined) module.exports = v;
    }
    else if (typeof define === 'function' && define.amd) {
        define(deps, factory);
    }
})(["require", "exports", './core/extend', './modules/config'], function (require, exports) {
    var extend = require('./core/extend');
    var moduleConfig = require('./modules/config');
    var isAmd = (typeof (define) !== 'undefined') && define.amd;
    var isDojo = isAmd && define.amd.vendor === 'dojotoolkit.org';
    var isNode = (typeof (window) === 'undefined');
    var req = (isDojo && isNode) ? global.require : require;
    var dojoConfig;
    if (isDojo) {
        dojoConfig = require('dojo/_base/config');
    }
    var r;
    if (dojoConfig) {
        r = dojoConfig;
    }
    else if (global.requirejs) {
        r = global.requirejs.s.contexts._.config;
    }
    else {
        r = {};
    }
    r.ninejs = r.ninejs || {};
    extend.mixinRecursive(r.ninejs, global.ninejsConfig || {});
    extend.mixinRecursive(r.ninejs, moduleConfig || {});
    exports.default = r;
});
//# sourceMappingURL=config.js.map