(function (factory) {
    if (typeof module === 'object' && typeof module.exports === 'object') {
        var v = factory(require, exports); if (v !== undefined) module.exports = v;
    }
    else if (typeof define === 'function' && define.amd) {
        define(["require", "exports", './logic/Expression'], factory);
    }
})(function (require, exports) {
    exports.Expression = require('./logic/Expression');
});
//# sourceMappingURL=logic.js.map