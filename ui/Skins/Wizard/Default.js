(function (factory) {
    if (typeof module === 'object' && typeof module.exports === 'object') {
        var v = factory(require, exports); if (v !== undefined) module.exports = v;
    }
    else if (typeof define === 'function' && define.amd) {
        define(["require", "exports", "../../../nineplate!./Default.html", "../../../css!./Default.css", '../../Skin'], factory);
    }
})(function (require, exports) {
    var Skin_1 = require('../../Skin');
    var template = require('../../../nineplate!./Default.html');
    var css = require('../../../css!./Default.css');
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = new Skin_1.default({
        template: template,
        cssList: [css]
    });
});
//# sourceMappingURL=Default.js.map