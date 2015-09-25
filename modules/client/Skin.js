(function (deps, factory) {
    if (typeof module === 'object' && typeof module.exports === 'object') {
        var v = factory(require, exports); if (v !== undefined) module.exports = v;
    }
    else if (typeof define === 'function' && define.amd) {
        define(deps, factory);
    }
})(["require", "exports", './Skin/FullScreenFrame'], function (require, exports) {
    exports.FullScreenFrame = require('./Skin/FullScreenFrame');
});
//# sourceMappingURL=Skin.js.map