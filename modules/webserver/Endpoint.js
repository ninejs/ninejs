(function (factory) {
    if (typeof module === 'object' && typeof module.exports === 'object') {
        var v = factory(require, exports); if (v !== undefined) module.exports = v;
    }
    else if (typeof define === 'function' && define.amd) {
        define(["require", "exports", '../../core/ext/Properties', '../../core/ext/Evented'], factory);
    }
})(function (require, exports) {
    var Properties_1 = require('../../core/ext/Properties');
    var Evented_1 = require('../../core/ext/Evented');
    class Endpoint extends Properties_1.default {
        constructor(args) {
            super(args);
            this.children = [];
        }
        on(eventType, callback) {
            return Evented_1.default.on.apply(this, arguments);
        }
        emit(eventType, data) {
            return Evented_1.default.emit.apply(this, arguments);
        }
        handler(req, res, next) {
        }
    }
    exports.Endpoint = Endpoint;
    Endpoint.prototype.type = 'endpoint';
    Endpoint.prototype.method = 'get';
    exports.default = Endpoint;
});
//# sourceMappingURL=Endpoint.js.map