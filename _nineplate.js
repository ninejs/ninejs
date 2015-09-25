(function (deps, factory) {
    if (typeof module === 'object' && typeof module.exports === 'object') {
        var v = factory(require, exports); if (v !== undefined) module.exports = v;
    }
    else if (typeof define === 'function' && define.amd) {
        define(deps, factory);
    }
})(["require", "exports", './_nineplate/baseProcessor', './_nineplate/domProcessor', './_nineplate/renderers', './_nineplate/textProcessor', './_nineplate/utils'], function (require, exports) {
    exports.baseProcessor = require('./_nineplate/baseProcessor');
    exports.domProcessor = require('./_nineplate/domProcessor');
    exports.renderers = require('./_nineplate/renderers');
    exports.textProcessor = require('./_nineplate/textProcessor');
    exports.utils = require('./_nineplate/utils');
});
//# sourceMappingURL=_nineplate.js.map