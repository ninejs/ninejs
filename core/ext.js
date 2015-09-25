(function (deps, factory) {
    if (typeof module === 'object' && typeof module.exports === 'object') {
        var v = factory(require, exports); if (v !== undefined) module.exports = v;
    }
    else if (typeof define === 'function' && define.amd) {
        define(deps, factory);
    }
})(["require", "exports", './ext/Evented', './ext/Properties', './ext/_common'], function (require, exports) {
    exports.Evented = require('./ext/Evented');
    exports.Properties = require('./ext/Properties');
    exports._common = require('./ext/_common');
});
//# sourceMappingURL=ext.js.map