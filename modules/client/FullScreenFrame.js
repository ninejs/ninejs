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
        define(["require", "exports", '../../ui/Widget', './Skin/FullScreenFrame', '../../ui/utils/append', '../../ui/utils/setClass', '../../core/on', '../../core/deferredUtils', '../../core/array'], factory);
    }
})(function (require, exports) {
    'use strict';
    var Widget_1 = require('../../ui/Widget');
    var FullScreenFrame_1 = require('./Skin/FullScreenFrame');
    var append_1 = require('../../ui/utils/append');
    var setClass_1 = require('../../ui/utils/setClass');
    var on_1 = require('../../core/on');
    var deferredUtils_1 = require('../../core/deferredUtils');
    var array_1 = require('../../core/array');
    function isNumber(n) {
        return !isNaN(parseFloat(n)) && isFinite(n);
    }
    var FullScreenFrame = (function (_super) {
        __extends(FullScreenFrame, _super);
        function FullScreenFrame(args, containerModule) {
            _super.call(this, args);
            this.container = containerModule;
        }
        FullScreenFrame.prototype.selectedSetter = function (idx) {
            var cnt, arr = array_1.filter(this.containerNode.childNodes, function (node) { return node.nodeType === 1; }), len = arr.length, target, current;
            if (isNumber(idx)) {
                target = arr[idx];
            }
            else if (idx.domNode) {
                target = idx.domNode;
            }
            else if (idx['$njsWidget'] && (typeof (idx.show) === 'function')) {
                idx.show();
                target = idx.domNode;
            }
            else {
                target = idx;
            }
            function deactivate(node) {
                return function () {
                    on_1.default.emit(node, 'njsDeactivated', { bubbles: false, cancelable: false });
                };
            }
            function activate(target) {
                setTimeout(function () {
                    on_1.default.emit(target, 'njsActivated', { bubbles: false, cancelable: false });
                }, 10);
            }
            var foundIdx;
            for (cnt = 0; cnt < len; cnt += 1) {
                current = arr[cnt];
                if (setClass_1.default.has(current, 'active')) {
                    setTimeout(deactivate(current), 10);
                }
                setClass_1.default(current, '!active');
                if (current === target) {
                    foundIdx = cnt;
                }
            }
            if (foundIdx !== undefined) {
                setClass_1.default(arr[foundIdx], 'active');
                activate(arr[foundIdx]);
            }
        };
        FullScreenFrame.prototype.addChild = function (child) {
            var self = this;
            function doAddChild(container, child) {
                if (child.domNode) {
                    child.set('parentContainer', self);
                    child = child.domNode;
                }
                append_1.default(container, child);
                return array_1.filter(container.childNodes, function (node) { return node.nodeType === 1; }).length - 1;
            }
            if (((!child.domNode) || (typeof (child.domNode.nodeType) === 'undefined')) && (typeof (child.show) === 'function')) {
                return deferredUtils_1.when(child.show(), function () {
                    doAddChild(self.containerNode, child);
                });
            }
            else {
                return doAddChild(this.containerNode, child);
            }
        };
        return FullScreenFrame;
    })(Widget_1.default);
    FullScreenFrame.prototype.skin = FullScreenFrame_1.default;
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = FullScreenFrame;
});
//# sourceMappingURL=FullScreenFrame.js.map