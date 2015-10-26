(function (factory) {
    if (typeof module === 'object' && typeof module.exports === 'object') {
        var v = factory(require, exports); if (v !== undefined) module.exports = v;
    }
    else if (typeof define === 'function' && define.amd) {
        define(["require", "exports", './Wizard/Default'], factory);
    }
})(function (require, exports) {
    exports.Default = require('./Wizard/Default');
});
//# sourceMappingURL=Wizard.js.map