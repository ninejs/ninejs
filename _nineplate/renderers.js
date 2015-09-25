(function (deps, factory) {
    if (typeof module === 'object' && typeof module.exports === 'object') {
        var v = factory(require, exports); if (v !== undefined) module.exports = v;
    }
    else if (typeof define === 'function' && define.amd) {
        define(deps, factory);
    }
})(["require", "exports", './renderers/JavascriptRenderer'], function (require, exports) {
    exports.JavascriptRenderer = require('./renderers/JavascriptRenderer');
});
//# sourceMappingURL=renderers.js.map