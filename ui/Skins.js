(function (factory) {
    if (typeof module === 'object' && typeof module.exports === 'object') {
        var v = factory(require, exports); if (v !== undefined) module.exports = v;
    }
    else if (typeof define === 'function' && define.amd) {
        define(["require", "exports", './Skins/Editor', './Skins/Wizard'], factory);
    }
})(function (require, exports) {
    exports.Editor = require('./Skins/Editor');
    exports.Wizard = require('./Skins/Wizard');
});
//# sourceMappingURL=Skins.js.map