(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports", "../css"], factory);
    }
})(function (require, exports) {
    'use strict';
    Object.defineProperty(exports, "__esModule", { value: true });
    var css = require("../css");
    function load() {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        var id = args[0];
        if (!(/\!/.test(id))) {
            args[0] = id + '!enable';
        }
        return css.load.apply(this, args);
    }
    exports.load = load;
});
//# sourceMappingURL=styleEnable.js.map