(function (deps, factory) {
    if (typeof module === 'object' && typeof module.exports === 'object') {
        var v = factory(require, exports); if (v !== undefined) module.exports = v;
    }
    else if (typeof define === 'function' && define.amd) {
        define(deps, factory);
    }
})(["require", "exports", './ui/Skin', './ui/Skins', './ui/Widget', './ui/bootstrap', './ui/utils'], function (require, exports) {
    exports.Skin = require('./ui/Skin');
    exports.Skins = require('./ui/Skins');
    exports.Widget = require('./ui/Widget');
    exports.bootstrap = require('./ui/bootstrap');
    exports.utils = require('./ui/utils');
});
//# sourceMappingURL=ui.js.map