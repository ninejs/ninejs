(function (factory) {
    if (typeof module === 'object' && typeof module.exports === 'object') {
        var v = factory(require, exports); if (v !== undefined) module.exports = v;
    }
    else if (typeof define === 'function' && define.amd) {
        define(["require", "exports", './client/hash', './client/router'], factory);
    }
})(function (require, exports) {
    exports.hash = require('./client/hash');
    exports.router = require('./client/router');
});
//# sourceMappingURL=client.js.map