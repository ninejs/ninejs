(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports", "./Default.9plate", "./Default.ncss", "../../Skin"], factory);
    }
})(function (require, exports) {
    'use strict';
    var Skin_1 = require("../../Skin");
    var template = require('./Default.9plate');
    var css = require('./Default.ncss');
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = new Skin_1.default({
        template: template,
        cssList: [css]
    });
});
//# sourceMappingURL=Default.js.map