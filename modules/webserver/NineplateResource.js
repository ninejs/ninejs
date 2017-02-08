var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports", "./StaticResource"], factory);
    }
})(function (require, exports) {
    'use strict';
    var StaticResource_1 = require("./StaticResource");
    var NineplateResource = (function (_super) {
        __extends(NineplateResource, _super);
        function NineplateResource(arg) {
            return _super.call(this, arg) || this;
        }
        NineplateResource.prototype.handler = function (req, res) {
            var props = this.props || {}, p, self = this;
            res.set('Content-Type', this.contentType);
            for (p in props) {
                if (props.hasOwnProperty(p)) {
                    res.set(p, props[p]);
                }
            }
            this.app.render(this.path, this.context, function (err, html) {
                var result;
                if (err) {
                    res.send(err);
                }
                else {
                    result = (self.doctype ? '<!DOCTYPE ' + self.doctype + '>\n' : '') + html;
                    self.emit('result', { data: result, response: res });
                    res.end(result);
                }
            });
        };
        return NineplateResource;
    }(StaticResource_1.default));
    NineplateResource.prototype.type = 'endpoint';
    NineplateResource.prototype.contentType = 'text/html; charset=utf-8';
    NineplateResource.prototype.doctype = 'html';
    NineplateResource.prototype.context = {};
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = NineplateResource;
});
//# sourceMappingURL=NineplateResource.js.map