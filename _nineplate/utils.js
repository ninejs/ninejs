(function (deps, factory) {
    if (typeof module === 'object' && typeof module.exports === 'object') {
        var v = factory(require, exports); if (v !== undefined) module.exports = v;
    }
    else if (typeof define === 'function' && define.amd) {
        define(deps, factory);
    }
})(["require", "exports", './utils/functions', './utils/node'], function (require, exports) {
    exports.functions = require('./utils/functions');
    exports.node = require('./utils/node');
});
//# sourceMappingURL=utils.js.map