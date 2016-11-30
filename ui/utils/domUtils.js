(function (dependencies, factory) {
    if (typeof module === 'object' && typeof module.exports === 'object') {
        var v = factory(require, exports); if (v !== undefined) module.exports = v;
    }
    else if (typeof define === 'function' && define.amd) {
        define(dependencies, factory);
    }
})(["require", "exports", "../css/common.ncss", "./setClass", "./setText", "./append", "../../modernizer", "../../core/on"], function (require, exports) {
    'use strict';
    var setClass_1 = require("./setClass");
    var setText_1 = require("./setText");
    var append_1 = require("./append");
    var modernizer_1 = require("../../modernizer");
    var on_1 = require("../../core/on");
    var commonCss = require('../css/common.ncss');
    commonCss.enable();
    modernizer_1.default.add('scopedCss', function () {
        var r = false, document = window.document;
        if (document) {
            var style = document.createElement('style');
            if (style.scoped) {
                r = true;
            }
        }
        return r;
    });
    function elementMouseOver(e) {
        setClass_1.default(e.currentTarget, 'dijitHover', 'njsHover');
    }
    function elementMouseOut(e) {
        setClass_1.default(e.currentTarget, '!dijitHover', '!njsHover');
    }
    function isHidden(control) {
        if (control.domNode) {
            return control.domNode.style.display === 'none';
        }
        else {
            return control.style.display === 'none';
        }
    }
    exports.isHidden = isHidden;
    function isShown(control) {
        if (control.domNode) {
            return control.domNode.style.display === 'block';
        }
        else {
            return control.style.display === 'block';
        }
    }
    exports.isShown = isShown;
    function hide(control) {
        var node = control;
        if (control.domNode) {
            node = control.domNode;
        }
        node.style.display = 'none';
    }
    exports.hide = hide;
    function show(control, showAttr) {
        if (!showAttr) {
            showAttr = 'block';
        }
        var node = control;
        if (control.domNode) {
            node = control.domNode;
        }
        node.style.display = showAttr;
        node.style.opacity = 1;
    }
    exports.show = show;
    function empty(node) {
        exports.setText.emptyNode(node);
    }
    exports.empty = empty;
    function enableHovering(control, enter, leave, options) {
        enter = enter || elementMouseOver;
        leave = leave || (elementMouseOut || enter);
        var onFn = on_1.default, r = {};
        if (options && options.pausable) {
            onFn = on_1.default.pausable;
        }
        r.enter = onFn(control, 'mouseover', enter);
        r.leave = onFn(control, 'mouseout', leave);
        r.remove = function () {
            var self = this;
            self.enter.remove();
            self.leave.remove();
        };
        return r;
    }
    exports.enableHovering = enableHovering;
    exports.setText = setText_1.default;
    exports.setClass = setClass_1.default;
    exports.append = append_1.default;
});
//# sourceMappingURL=domUtils.js.map