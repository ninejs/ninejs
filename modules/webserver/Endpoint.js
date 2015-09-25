/// <reference path="../../typings/express/express.d.ts" />
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
(function (deps, factory) {
    if (typeof module === 'object' && typeof module.exports === 'object') {
        var v = factory(require, exports); if (v !== undefined) module.exports = v;
    }
    else if (typeof define === 'function' && define.amd) {
        define(deps, factory);
    }
})(["require", "exports", '../../core/ext/Properties', '../../core/ext/Evented'], function (require, exports) {
    var Properties_1 = require('../../core/ext/Properties');
    var Evented_1 = require('../../core/ext/Evented');
    var Endpoint = (function (_super) {
        __extends(Endpoint, _super);
        function Endpoint(args) {
            _super.call(this, args);
            this.children = [];
        }
        Endpoint.prototype.on = function (eventType, callback) {
            return Evented_1.default.on.apply(this, arguments);
        };
        Endpoint.prototype.emit = function (eventType, data) {
            return Evented_1.default.emit.apply(this, arguments);
        };
        Endpoint.prototype.handler = function (req, res) {
        };
        return Endpoint;
    })(Properties_1.default);
    exports.Endpoint = Endpoint;
    Endpoint.prototype.type = 'endpoint';
    Endpoint.prototype.method = 'get';
    exports.default = Endpoint;
});
//# sourceMappingURL=Endpoint.js.map