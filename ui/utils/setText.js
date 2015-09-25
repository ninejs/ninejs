(function (deps, factory) {
    if (typeof module === 'object' && typeof module.exports === 'object') {
        var v = factory(require, exports); if (v !== undefined) module.exports = v;
    }
    else if (typeof define === 'function' && define.amd) {
        define(deps, factory);
    }
})(["require", "exports"], function (require, exports) {
    var setText = (function () {
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
    exports.default = setText;
});
//# sourceMappingURL=setText.js.map