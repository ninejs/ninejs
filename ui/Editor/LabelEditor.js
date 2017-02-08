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
        define(["require", "exports", "./LabelEditor.ncss", "../Editor", "../utils/append", "../utils/setText", "../utils/setClass", "../../core/on", "../../core/deferredUtils"], factory);
    }
})(function (require, exports, css) {
    'use strict';
    var Editor_1 = require("../Editor");
    var append_1 = require("../utils/append");
    var setText_1 = require("../utils/setText");
    var setClass_1 = require("../utils/setClass");
    var on_1 = require("../../core/on");
    var deferredUtils_1 = require("../../core/deferredUtils");
    css.enable();
    function identity(v) {
        return v;
    }
    var LabelEditor = (function (_super) {
        __extends(LabelEditor, _super);
        function LabelEditor() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        LabelEditor.prototype.labelSetter = function (v) {
            this.label = v;
            setText_1.default(this.labelNode, (this.labelFilter || identity).call(this, v));
        };
        LabelEditor.prototype.isLabelSetter = function (v) {
            this.isLabel = !!v;
            var cls = "{(v)?'':'!'}isLabel";
            deferredUtils_1.when(this.domNode, function (domNode) {
                setClass_1.default(domNode, cls);
            });
        };
        LabelEditor.prototype.onUpdatedSkin = function () {
            var _this = this;
            _super.prototype.onUpdatedSkin.call(this);
            var domNode = this.domNode;
            setClass_1.default(domNode, 'labelEditor');
            this.labelNode = setClass_1.default(append_1.default(domNode, 'div'), 'njsLabel');
            (this.labelClass || '').split(' ').forEach(function (cl) {
                setClass_1.default(_this.labelNode, cl);
            });
            this.bind(this, 'label');
            setClass_1.default(domNode, 'isLabel');
            this.own(on_1.default(this.labelNode, 'click', function () {
                _this.set('isLabel', false);
                _this.focus();
            }), this.on('blur', function () {
                _this.set('isLabel', true);
            }));
            setTimeout(function () {
                setText_1.default(_this.labelNode, _this.get('value') || _this.get('placeholder') || '');
            });
        };
        return LabelEditor;
    }(Editor_1.default));
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = LabelEditor;
});
//# sourceMappingURL=LabelEditor.js.map