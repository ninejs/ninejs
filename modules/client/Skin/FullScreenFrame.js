(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports", "./FullScreenFrame.ncss", "./FullScreenFrame.9plate", "../../../ui/Skin"], factory);
    }
})(function (require, exports) {
    'use strict';
    Object.defineProperty(exports, "__esModule", { value: true });
    var Skin_1 = require("../../../ui/Skin");
    var css = require('./FullScreenFrame.ncss');
    var template = require('./FullScreenFrame.9plate');
    exports.default = new Skin_1.default({
        cssList: [css],
        template: template
    });
});
//# sourceMappingURL=FullScreenFrame.js.map