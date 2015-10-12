(function (deps, factory) {
    if (typeof module === 'object' && typeof module.exports === 'object') {
        var v = factory(require, exports); if (v !== undefined) module.exports = v;
    }
    else if (typeof define === 'function' && define.amd) {
        define(deps, factory);
    }
})(["require", "exports", './ui/bootstrap', './ui/Skin', './ui/Skins', './ui/utils', './ui/Widget'], function (require, exports) {
    exports.bootstrap = require('./ui/bootstrap');
    exports.Skin = require('./ui/Skin');
    exports.Skins = require('./ui/Skins');
    exports.utils = require('./ui/utils');
    exports.Widget = require('./ui/Widget');
});
//# sourceMappingURL=ui.js.map