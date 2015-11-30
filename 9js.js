(function (factory) {
    if (typeof module === 'object' && typeof module.exports === 'object') {
        var v = factory(require, exports); if (v !== undefined) module.exports = v;
    }
    else if (typeof define === 'function' && define.amd) {
        define(["require", "exports", './client', './config', './core', './css', './modernizer', './modules', './nineplate', './request', './ui', './_css', './_nineplate'], factory);
    }
})(function (require, exports) {
    exports.client = require('./client');
    exports.config = require('./config');
    exports.core = require('./core');
    exports.css = require('./css');
    exports.modernizer = require('./modernizer');
    exports.modules = require('./modules');
    exports.nineplate = require('./nineplate');
    exports.request = require('./request');
    exports.ui = require('./ui');
    exports._css = require('./_css');
    exports._nineplate = require('./_nineplate');
});
//# sourceMappingURL=9js.js.map