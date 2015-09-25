(function (deps, factory) {
    if (typeof module === 'object' && typeof module.exports === 'object') {
        var v = factory(require, exports); if (v !== undefined) module.exports = v;
    }
    else if (typeof define === 'function' && define.amd) {
        define(deps, factory);
    }
})(["require", "exports", './client/FullScreenFrame', './client/Skin', './client/container', './client/router', './client/singlePageContainer'], function (require, exports) {
    exports.FullScreenFrame = require('./client/FullScreenFrame');
    exports.Skin = require('./client/Skin');
    exports.container = require('./client/container');
    exports.router = require('./client/router');
    exports.singlePageContainer = require('./client/singlePageContainer');
});
//# sourceMappingURL=client.js.map