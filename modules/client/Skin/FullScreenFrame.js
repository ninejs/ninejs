/// <amd-dependency path="../../../css!./FullScreenFrame.css" />
/// <amd-dependency path="../../../nineplate!./FullScreenFrame.html" />
(function (deps, factory) {
    if (typeof module === 'object' && typeof module.exports === 'object') {
        var v = factory(require, exports); if (v !== undefined) module.exports = v;
    }
    else if (typeof define === 'function' && define.amd) {
        define(deps, factory);
    }
})(["require", "exports", "../../../css!./FullScreenFrame.css", "../../../nineplate!./FullScreenFrame.html", '../../../ui/Skin'], function (require, exports) {
    var Skin_1 = require('../../../ui/Skin');
    var css = require('../../../css!./FullScreenFrame.css');
    var template = require('../../../nineplate!./FullScreenFrame.html');
    exports.default = new Skin_1.default({
        cssList: [css],
        template: template
    });
});
//# sourceMappingURL=FullScreenFrame.js.map