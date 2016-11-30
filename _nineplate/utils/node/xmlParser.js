var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
(function (dependencies, factory) {
    if (typeof module === 'object' && typeof module.exports === 'object') {
        var v = factory(require, exports); if (v !== undefined) module.exports = v;
    }
    else if (typeof define === 'function' && define.amd) {
        define(dependencies, factory);
    }
})(["require", "exports", "./node-xml", "../../../core/bluebird"], function (require, exports) {
    'use strict';
    var xml = require("./node-xml");
    var Q = require("../../../core/bluebird");
    var defer = function () {
        return Q.defer();
    };
    var XmlParserError = (function (_super) {
        __extends(XmlParserError, _super);
        function XmlParserError(msg) {
            return _super.call(this, msg) || this;
        }
        return XmlParserError;
    }(Error));
    exports.XmlParserError = XmlParserError;
    function getAttributeNS(node, prefix) {
        if (node.namespaces.length) {
            var r = node.namespaces.filter(function (ns) {
                return ns[0] === prefix;
            });
            if (r.length) {
                return r[0][1];
            }
        }
        if (node.parentNode) {
            return getAttributeNS(node.parentNode, prefix);
        }
        else {
            return null;
        }
    }
    function parse(text, sync) {
        var deferred = defer();
        var nodes = [];
        var node;
        var rootNode = null;
        var parser = new xml.SaxParser(function (cb) {
            cb.onStartDocument(function () {
            });
            cb.onEndDocument(function () {
                deferred.resolve(rootNode);
            });
            cb.onStartElementNS(function (elem, attrs, prefix, uri, namespaces) {
                var parentNode = node;
                node = {
                    nodeName: elem,
                    prefix: prefix,
                    namespaceUri: uri,
                    namespaces: namespaces,
                    nodeType: 1,
                    parentNode: parentNode,
                    children: [],
                    attributes: []
                };
                node.attributes = attrs.map(function (item) {
                    var nodeName = item[0], ns = null, idx = nodeName.indexOf(':');
                    if (idx >= 0) {
                        ns = getAttributeNS(node, nodeName.substr(0, idx));
                        nodeName = nodeName.substr(idx + 1);
                    }
                    return {
                        nodeName: nodeName,
                        parentNode: node,
                        value: item[1],
                        nodeType: 2,
                        namespaceUri: ns
                    };
                });
                if (!rootNode) {
                    rootNode = node;
                }
                else {
                    parentNode.children.push(node);
                }
                nodes.push(node);
            });
            cb.onEndElementNS(function () {
                nodes.pop();
                node = nodes[nodes.length - 1];
            });
            cb.onCharacters(function (chars) {
                chars = chars.trim();
                if (node && chars) {
                    node.children.push({
                        nodeType: 3,
                        nodeValue: chars
                    });
                }
            });
            cb.onCdata(function (cdata) {
                if (node && cdata) {
                    node.children.push({
                        nodeType: 3,
                        nodeValue: cdata
                    });
                }
            });
            cb.onComment(function (msg) {
                if (node && node.children) {
                    node.children.push({
                        nodeType: 4,
                        nodeValue: msg
                    });
                }
            });
            cb.onWarning(function () {
            });
            cb.onError(function (msg, parser) {
                var err = new XmlParserError(msg);
                if (parser) {
                    err.line = parser.getLineNumber();
                    err.column = parser.getColumnNumber();
                    err.xml = parser['m_parser']['m_xml'];
                }
                deferred.reject(err);
            });
        });
        parser.sync = sync;
        parser.parseString(text);
        if (sync) {
            return rootNode;
        }
        else {
            return deferred.promise;
        }
    }
    exports.parse = parse;
    ;
});
//# sourceMappingURL=xmlParser.js.map