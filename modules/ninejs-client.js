(function (factory) {
    if (typeof module === 'object' && typeof module.exports === 'object') {
        var v = factory(require, exports); if (v !== undefined) module.exports = v;
    }
    else if (typeof define === 'function' && define.amd) {
        define(["require", "exports", './Module'], factory);
    }
})(function (require, exports) {
    'use strict';
    var Module_1 = require('./Module');
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = new Module_1.default({
        provides: [
            {
                id: 'ninejs',
                version: '0.1.5'
            }
        ]
    });
});
//# sourceMappingURL=ninejs-client.js.map