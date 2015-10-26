(function (factory) {
    if (typeof module === 'object' && typeof module.exports === 'object') {
        var v = factory(require, exports); if (v !== undefined) module.exports = v;
    }
    else if (typeof define === 'function' && define.amd) {
        define(["require", "exports", './bootstrap/bootstrap'], factory);
    }
})(function (require, exports) {
    exports.bootstrap = require('./bootstrap/bootstrap');
});
//# sourceMappingURL=bootstrap.js.map