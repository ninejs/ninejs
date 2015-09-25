(function (deps, factory) {
    if (typeof module === 'object' && typeof module.exports === 'object') {
        var v = factory(require, exports); if (v !== undefined) module.exports = v;
    }
    else if (typeof define === 'function' && define.amd) {
        define(deps, factory);
    }
})(["require", "exports", './core/_common', './core/array', './core/aspect', './core/bluebird', './core/cache', './core/deferredUtils', './core/ext', './core/extend', './core/logic', './core/objUtils', './core/on', './core/text'], function (require, exports) {
    exports._common = require('./core/_common');
    exports.array = require('./core/array');
    exports.aspect = require('./core/aspect');
    exports.bluebird = require('./core/bluebird');
    exports.cache = require('./core/cache');
    exports.deferredUtils = require('./core/deferredUtils');
    exports.ext = require('./core/ext');
    exports.extend = require('./core/extend');
    exports.logic = require('./core/logic');
    exports.objUtils = require('./core/objUtils');
    exports.on = require('./core/on');
    exports.text = require('./core/text');
});
//# sourceMappingURL=core.js.map