(function (factory) {
    if (typeof module === 'object' && typeof module.exports === 'object') {
        var v = factory(require, exports); if (v !== undefined) module.exports = v;
    }
    else if (typeof define === 'function' && define.amd) {
        define(["require", "exports", './_css/builder', './_css/styleEnable'], factory);
    }
})(function (require, exports) {
    exports.builder = require('./_css/builder');
    exports.styleEnable = require('./_css/styleEnable');
});
//# sourceMappingURL=_css.js.map