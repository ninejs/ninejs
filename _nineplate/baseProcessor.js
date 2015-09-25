(function (deps, factory) {
    if (typeof module === 'object' && typeof module.exports === 'object') {
        var v = factory(require, exports); if (v !== undefined) module.exports = v;
    }
    else if (typeof define === 'function' && define.amd) {
        define(deps, factory);
    }
})(["require", "exports", './utils/node/xmlParser'], function (require, exports) {
    var xmlParser_1 = require('./utils/node/xmlParser');
    var isNode = typeof (window) === 'undefined';
    function manualTrim(str) {
        str = str.replace(/^\s+/, '');
        for (var i = str.length - 1; i >= 0; i -= 1) {
            if (/\S/.test(str.charAt(i))) {
                str = str.substring(0, i + 1);
                break;
            }
        }
        return str;
    }
    var XmlNode = (function () {
        function XmlNode(parsedXmlNode) {
            this.node = parsedXmlNode;
        }
        XmlNode.prototype.nodeType = function () {
            return this.node.nodeType;
        };
        XmlNode.prototype.value = function () {
            return this.node.value;
        };
        XmlNode.prototype.nodeValue = function () {
            return this.node.nodeValue;
        };
        XmlNode.prototype.getAttributes = function () {
            var cnt, attributes = this.node.attributes, len = attributes.length, r = [];
            for (cnt = 0; cnt < len; cnt += 1) {
                r.push(new XmlNode(attributes[cnt]));
            }
            return r;
        };
        XmlNode.prototype.getChildNodes = function () {
            var cnt, children = isNode ? this.node.children : this.node.childNodes, len = children.length, r = [];
            for (cnt = 0; cnt < len; cnt += 1) {
                r.push(new XmlNode(children[cnt]));
            }
            return r;
        };
        XmlNode.prototype.hasVariableTagName = function () {
            var attributes = this.getAttributes(), cnt;
            for (cnt = 0; cnt < attributes.length; cnt += 1) {
                if (attributes[cnt].nodeName() === 'data-ninejs-tagName') {
                    return true;
                }
            }
            return false;
        };
        XmlNode.prototype.getVariableTagName = function (callback) {
            var attributes = this.getAttributes(), found, cnt;
            for (cnt = 0; cnt < attributes.length; cnt += 1) {
                if (attributes[cnt].nodeName() === 'data-ninejs-tagName') {
                    found = attributes[cnt];
                }
            }
            if (found) {
                return callback(found.value());
            }
            else {
                return callback(null);
            }
        };
        XmlNode.prototype.nodeName = function () {
            return this.node.nodeName;
        };
        XmlNode.prototype.nodeLocalName = function () {
            return this.node.localName || this.node.nodeName;
        };
        XmlNode.prototype.namespaceUri = function () {
            return this.node.namespaceURI || this.node.namespaceUri || '';
        };
        XmlNode.prototype.parentNode = function () {
            if (!this.node.parentNode) {
                return null;
            }
            else {
                return new XmlNode(this.node.parentNode);
            }
        };
        XmlNode.prototype.set = function (n, v) {
            this.node[n] = v;
        };
        XmlNode.prototype.get = function (n) {
            return this.node[n];
        };
        return XmlNode;
    })();
    exports.XmlNode = XmlNode;
    var TextParseContext = (function () {
        function TextParseContext() {
            this.r = [];
            this.lineBuffer = [];
        }
        TextParseContext.prototype.append = function (line) {
            this.appendLine();
            this.r.push(line);
        };
        TextParseContext.prototype.appendLine = function () {
            if (this.lineBuffer.length) {
                this.r.push('result.push(\'' + this.lineBuffer.join('') + '\');\n');
                this.lineBuffer = [];
            }
        };
        TextParseContext.prototype.getText = function () {
            return this.r.join('');
        };
        return TextParseContext;
    })();
    exports.TextParseContext = TextParseContext;
    function trim(content) {
        if (!content) {
            return null;
        }
        if (content.trim) {
            return content.trim();
        }
        else {
            return manualTrim(content);
        }
    }
    exports.trim = trim;
    function safeFilter(content) {
        if (content) {
            content = content.replace(/(\'|\")/g, function ($0, $1) {
                return '\\' + $1;
            }).replace(/\n/g, function () {
                return '';
            });
        }
        return content;
    }
    exports.safeFilter = safeFilter;
    function getParsedXml(text, sync) {
        var xmlDoc;
        if (isNode) {
            return xmlParser_1.parse(text, sync);
        }
        else if (typeof (window) !== 'undefined') {
            if (typeof (DOMParser) !== 'undefined') {
                var parser = new DOMParser();
                xmlDoc = parser.parseFromString(text, 'text/xml');
            }
            else {
                xmlDoc = new ActiveXObject('Microsoft.XMLDOM');
                xmlDoc.async = false;
                xmlDoc.loadXML(text);
            }
            return xmlDoc;
        }
    }
    exports.getParsedXml = getParsedXml;
});
//# sourceMappingURL=baseProcessor.js.map