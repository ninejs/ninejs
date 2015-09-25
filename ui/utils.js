(function (deps, factory) {
    if (typeof module === 'object' && typeof module.exports === 'object') {
        var v = factory(require, exports); if (v !== undefined) module.exports = v;
    }
    else if (typeof define === 'function' && define.amd) {
        define(deps, factory);
    }
})(["require", "exports", './utils/append', './utils/domUtils', './utils/setClass', './utils/setText'], function (require, exports) {
    exports.append = require('./utils/append');
    exports.domUtils = require('./utils/domUtils');
    exports.setClass = require('./utils/setClass');
    exports.setText = require('./utils/setText');
});
//# sourceMappingURL=utils.js.map