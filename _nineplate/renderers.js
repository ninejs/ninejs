(function (factory) {
    if (typeof module === 'object' && typeof module.exports === 'object') {
        var v = factory(require, exports); if (v !== undefined) module.exports = v;
    }
    else if (typeof define === 'function' && define.amd) {
        define(["require", "exports", './renderers/JavascriptRenderer'], factory);
    }
})(function (require, exports) {
    exports.JavascriptRenderer = require('./renderers/JavascriptRenderer');
});
//# sourceMappingURL=renderers.js.map