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
        define(["require", "exports", "./Button.9plate", "../Widget", "../Skin"], factory);
    }
})(function (require, exports, template) {
    'use strict';
    var Widget_1 = require("../Widget");
    var Skin_1 = require("../Skin");
    var buttonSkin = new Skin_1.default({
        template: template
    });
    var Button = (function (_super) {
        __extends(Button, _super);
        function Button(args) {
            return _super.call(this, args) || this;
        }
        return Button;
    }(Widget_1.default));
    Button.prototype.skin = buttonSkin;
    Button.prototype.type = 'button';
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = Button;
});
//# sourceMappingURL=Button.js.map