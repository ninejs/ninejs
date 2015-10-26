(function (factory) {
    if (typeof module === 'object' && typeof module.exports === 'object') {
        var v = factory(require, exports); if (v !== undefined) module.exports = v;
    }
    else if (typeof define === 'function' && define.amd) {
        define(["require", "exports", "../../../css!./FullScreenFrame.css", "../../../nineplate!./FullScreenFrame.html", '../../../ui/Skin'], factory);
    }
})(function (require, exports) {
    var Skin_1 = require('../../../ui/Skin');
    var css = require('../../../css!./FullScreenFrame.css');
    var template = require('../../../nineplate!./FullScreenFrame.html');
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = new Skin_1.default({
        cssList: [css],
        template: template
    });
});
//# sourceMappingURL=FullScreenFrame.js.map