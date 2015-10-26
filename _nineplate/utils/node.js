(function (factory) {
    if (typeof module === 'object' && typeof module.exports === 'object') {
        var v = factory(require, exports); if (v !== undefined) module.exports = v;
    }
    else if (typeof define === 'function' && define.amd) {
        define(["require", "exports", './node/node-xml', './node/text', './node/xmlParser'], factory);
    }
})(function (require, exports) {
    exports.nodeXml = require('./node/node-xml');
    exports.text = require('./node/text');
    exports.xmlParser = require('./node/xmlParser');
});
//# sourceMappingURL=node.js.map