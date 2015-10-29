var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
(function (factory) {
    if (typeof module === 'object' && typeof module.exports === 'object') {
        var v = factory(require, exports); if (v !== undefined) module.exports = v;
    }
    else if (typeof define === 'function' && define.amd) {
        define(["require", "exports", '../core/extend', '../core/ext/Properties', '../nineplate', '../core/deferredUtils'], factory);
    }
})(function (require, exports) {
    var extend = require('../core/extend');
    var Properties_1 = require('../core/ext/Properties');
    var nineplate_1 = require('../nineplate');
    var def = require('../core/deferredUtils');
    var Skin = (function (_super) {
        __extends(Skin, _super);
        function Skin() {
            _super.apply(this, arguments);
            this.enabled = false;
        }
        Skin.prototype.applies = function () {
            return true;
        };
        Skin.prototype.templateSetter = function (value) {
            if (typeof (value) === 'function') {
                this.template = value;
            }
            else if (value && value.compileDom) {
                this.template = value.compileDom(true);
            }
            else {
                this.template = value;
            }
        };
        Skin.prototype.enable = function (widget) {
            var cnt, nTemplate, templateResult, self = this, defer = def.defer();
            if (this.cssList) {
                for (cnt = 0; cnt < this.cssList.length; cnt += 1) {
                    this.cssList[cnt] = this.cssList[cnt].enable();
                }
            }
            if (this.template) {
                var template;
                if (typeof (this.template) === 'string') {
                    var templateString = this.template;
                    nTemplate = nineplate_1.default.buildTemplate(templateString);
                    template = nTemplate.compileDom(true);
                    this.template = template;
                }
                else {
                    template = this.template;
                }
                var parentNode;
                var oldNode;
                if (widget.domNode && widget.domNode.parentNode) {
                    parentNode = widget.domNode.parentNode;
                    oldNode = widget.domNode;
                }
                var afterLoadDeps = function () {
                    templateResult = template(widget);
                    if (widget.mixinProperties) {
                        widget.mixinProperties(templateResult);
                    }
                    else {
                        extend.mixin(widget, templateResult);
                    }
                    if (parentNode) {
                        parentNode.replaceChild(widget.domNode, oldNode);
                    }
                    defer.resolve(true);
                };
                if (template.amdDependencies && template.amdDependencies.length) {
                    require(template.amdDependencies || [], afterLoadDeps);
                }
                else {
                    afterLoadDeps();
                }
            }
            return defer.promise;
        };
        Skin.prototype.disable = function () {
            var cnt = 0;
            if (this.cssList) {
                for (cnt = 0; cnt < this.cssList.length; cnt += 1) {
                    this.cssList[cnt] = this.cssList[cnt].disable();
                }
            }
        };
        Skin.prototype.updated = function (control) {
        };
        return Skin;
    })(Properties_1.default);
    Skin.prototype.cssList = [];
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = Skin;
});
//# sourceMappingURL=Skin.js.map