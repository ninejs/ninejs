(function (factory) {
    if (typeof module === 'object' && typeof module.exports === 'object') {
        var v = factory(require, exports); if (v !== undefined) module.exports = v;
    }
    else if (typeof define === 'function' && define.amd) {
        define(["require", "exports", './client/container', './client/FullScreenFrame', './client/router', './client/singlePageContainer', './client/Skin'], factory);
    }
})(function (require, exports) {
    exports.container = require('./client/container');
    exports.FullScreenFrame = require('./client/FullScreenFrame');
    exports.router = require('./client/router');
    exports.singlePageContainer = require('./client/singlePageContainer');
    exports.Skin = require('./client/Skin');
});
//# sourceMappingURL=client.js.map