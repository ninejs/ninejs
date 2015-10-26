(function (factory) {
    if (typeof module === 'object' && typeof module.exports === 'object') {
        var v = factory(require, exports); if (v !== undefined) module.exports = v;
    }
    else if (typeof define === 'function' && define.amd) {
        define(["require", "exports", './Editor/Default'], factory);
    }
})(function (require, exports) {
    exports.Default = require('./Editor/Default');
});
//# sourceMappingURL=Editor.js.map