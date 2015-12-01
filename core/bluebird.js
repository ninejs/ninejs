(function (factory) {
    if (typeof module === 'object' && typeof module.exports === 'object') {
        var v = factory(require, exports); if (v !== undefined) module.exports = v;
    }
    else if (typeof define === 'function' && define.amd) {
        define(["require", "exports", "../client/bluebird"], factory);
    }
})(function (require, exports) {
    var bluebird = require('../client/bluebird');
    var defer = bluebird.defer;
    exports.defer = defer;
    exports.default = bluebird;
});
//# sourceMappingURL=bluebird.js.map