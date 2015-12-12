(function (factory) {
    if (typeof module === 'object' && typeof module.exports === 'object') {
        var v = factory(require, exports); if (v !== undefined) module.exports = v;
    }
    else if (typeof define === 'function' && define.amd) {
        define(["require", "exports"], factory);
    }
})(function (require, exports) {
    'use strict';
    exports.t = function appendText(e, text, doc) {
        return e.appendChild(doc.createTextNode(text));
    };
    exports.tst = function appendTest() {
        return window.document.body && (window.document.body.insertAdjacentElement);
    };
    exports.ae = function alternateAppend(e, name, doc) {
        var node = doc.createElement(name);
        e.appendChild(node);
        return node;
    };
    exports.aens = function alternateAppendNs(e, name, ns, doc) {
        var node = doc.createElementNS(ns, name);
        e.appendChild(node);
        return node;
    };
    exports.e = function appendElement(e, name, doc) {
        var node = doc.createElement(name);
        e.insertAdjacentElement('beforeEnd', node);
        return node;
    };
    exports.ens = function appendElementNs(e, name, ns, doc) {
        var node = doc.createElementNS(ns, name);
        e.insertAdjacentElement('beforeEnd', node);
        return node;
    };
});
//# sourceMappingURL=functions.js.map