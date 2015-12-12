(function (factory) {
    if (typeof module === 'object' && typeof module.exports === 'object') {
        var v = factory(require, exports); if (v !== undefined) module.exports = v;
    }
    else if (typeof define === 'function' && define.amd) {
        define(["require", "exports"], factory);
    }
})(function (require, exports) {
    'use strict';
    var setText;
    setText = (function () {
        function emptyNode(node) {
            var c = node.lastChild;
            while (c) {
                node.removeChild(c);
                c = node.lastChild;
            }
        }
        function appendText(element, text) {
            if (element && element.ownerDocument) {
                element.appendChild(element.ownerDocument.createTextNode(text));
            }
        }
        var setText = function (node, text) {
            emptyNode(node);
            appendText(node, text);
            return node;
        };
        setText.emptyNode = emptyNode;
        return setText;
    })();
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = setText;
});
//# sourceMappingURL=setText.js.map