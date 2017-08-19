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
    var append;
    append = (function () {
        var append = function (parentNode, node, position) {
            if (typeof (node) === 'string') {
                node = parentNode.ownerDocument.createElement(node);
            }
            parentNode.insertAdjacentElement(position || 'beforeend', node);
            return node;
        };
        if (!window.document.body || !window.document.body.insertAdjacentElement) {
            append = function (parentNode, node, position) {
                if (typeof (node) === 'string') {
                    node = parentNode.ownerDocument.createElement(node);
                }
                if (!position) {
                    parentNode.appendChild(node);
                }
                else {
                    if (position === 'beforeBegin') {
                        parentNode.parentNode.insertBefore(node, parentNode);
                    }
                }
                return node;
            };
        }
        append.create = function (node) {
            return window.document.createElement(node);
        };
        append.remove = function (node) {
            if (node.parentNode) {
                node.parentNode.removeChild(node);
            }
        };
        append.toIndex = function (parentNode, node, index) {
            var cur = 0, currentChild;
            if (typeof (index) === 'undefined') {
                return append(parentNode, node);
            }
            else {
                currentChild = parentNode.firstChild;
                while (currentChild && (cur < index)) {
                    currentChild = currentChild.nextSibling;
                    cur += 1;
                }
                if (!currentChild) {
                    return append(parentNode, node);
                }
                else {
                    parentNode.insertBefore(node, currentChild);
                }
            }
        };
        return append;
    })();
    exports.toIndex = append.toIndex;
    exports.remove = append.remove;
    exports.create = append.create;
    exports.default = append;
});
//# sourceMappingURL=append.js.map