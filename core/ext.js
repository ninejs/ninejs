(function (factory) {
    if (typeof module === 'object' && typeof module.exports === 'object') {
        var v = factory(require, exports); if (v !== undefined) module.exports = v;
    }
    else if (typeof define === 'function' && define.amd) {
        define(["require", "exports", './ext/Evented', './ext/Properties'], factory);
    }
})(function (require, exports) {
    exports.Evented = require('./ext/Evented');
    exports.Properties = require('./ext/Properties');
});
//# sourceMappingURL=ext.js.map