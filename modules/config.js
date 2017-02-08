(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports"], factory);
    }
})(function (require, exports) {
    'use strict';
    var isAmd = (typeof (define) !== 'undefined') && define.amd;
    var isDojo = isAmd && define.amd.vendor === 'dojotoolkit.org';
    var isNode = (typeof (window) === 'undefined');
    var dojoConfig;
    var _global = ((typeof (global) !== 'undefined') ? global : window) || {};
    if (isDojo) {
        if (!isNode) {
            dojoConfig = _global.dojoConfig || {};
        }
        else {
            dojoConfig = require('dojo/_base/config');
        }
    }
    function mixin(src, target) {
        if (!src) {
            return;
        }
        var p;
        for (p in target) {
            if (target.hasOwnProperty(p)) {
                src[p] = target[p];
            }
        }
        return src;
    }
    function readConfigModules(njsConfig, finalConfig) {
        var arr = njsConfig.modules;
        if (arr) {
            for (var p in arr) {
                if (arr.hasOwnProperty(p)) {
                    finalConfig.modules.push(p);
                    for (var unitConfig in arr[p]) {
                        if (arr[p].hasOwnProperty(unitConfig)) {
                            finalConfig.units[unitConfig] = arr[p][unitConfig];
                        }
                    }
                }
            }
        }
    }
    var config = {}, p, njs;
    if (dojoConfig && dojoConfig.ninejs) {
        njs = dojoConfig.ninejs;
        for (p in njs) {
            if (njs.hasOwnProperty(p)) {
                config[p] = njs[p];
            }
        }
    }
    if (isNode) {
        try {
            var req = (isDojo && isNode) ? global.require : require;
            var fs = req('fs'), path = req('path'), njsConfigPath = path.resolve(process.cwd(), '9js.config.json'), njsConfig = {}, finalConfig = { modules: [], units: {} };
            if (fs.existsSync(njsConfigPath)) {
                njsConfig = require(njsConfigPath);
                readConfigModules(njsConfig, finalConfig);
                mixin(config, finalConfig);
                mixin(config, njsConfig);
            }
        }
        catch (e) {
        }
    }
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = config;
});
//# sourceMappingURL=config.js.map