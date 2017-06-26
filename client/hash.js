(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports"], factory);
    }
})(function (require, exports) {
    'use strict';
    Object.defineProperty(exports, "__esModule", { value: true });
    function hash(newHash, replace) {
        if (!arguments.length) {
            return window.location.hash;
        }
        if (newHash.charAt(0) === '#') {
            newHash = newHash.substring(1);
        }
        if (replace) {
            window.location.replace('#' + newHash);
        }
        else {
            window.location.href = '#' + newHash;
        }
    }
    exports.default = hash;
    ;
});
//# sourceMappingURL=hash.js.map