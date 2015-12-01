(function (factory) {
    if (typeof module === 'object' && typeof module.exports === 'object') {
        var v = factory(require, exports); if (v !== undefined) module.exports = v;
    }
    else if (typeof define === 'function' && define.amd) {
        define(["require", "exports", './utils/node/xmlParser'], factory);
    }
})(function (require, exports) {
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
    class XmlNode {
        constructor(parsedXmlNode) {
            this.node = parsedXmlNode;
        }
        nodeType() {
            return this.node.nodeType;
        }
        value() {
            return this.node.value;
        }
        nodeValue() {
            return this.node.nodeValue;
        }
        getAttributes() {
            var cnt, attributes = this.node.attributes, len = attributes.length, r = [];
            for (cnt = 0; cnt < len; cnt += 1) {
                r.push(new XmlNode(attributes[cnt]));
            }
            return r;
        }
        getChildNodes() {
            var cnt, children = isNode ? this.node.children : this.node.childNodes, len = children.length, r = [];
            for (cnt = 0; cnt < len; cnt += 1) {
                r.push(new XmlNode(children[cnt]));
            }
            return r;
        }
        hasVariableTagName() {
            var attributes = this.getAttributes(), cnt;
            for (cnt = 0; cnt < attributes.length; cnt += 1) {
                if (attributes[cnt].nodeName() === 'data-ninejs-tagName') {
                    return true;
                }
            }
            return false;
        }
        getVariableTagName(callback) {
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
        }
        nodeName() {
            return this.node.nodeName;
        }
        nodeLocalName() {
            return this.node.localName || this.node.nodeName;
        }
        namespaceUri() {
            return this.node.namespaceURI || this.node.namespaceUri || '';
        }
        parentNode() {
            if (!this.node.parentNode) {
                return null;
            }
            else {
                return new XmlNode(this.node.parentNode);
            }
        }
        set(n, v) {
            this.node[n] = v;
        }
        get(n) {
            return this.node[n];
        }
    }
    exports.XmlNode = XmlNode;
    class TextParseContext {
        constructor() {
            this.r = [];
            this.lineBuffer = [];
        }
        append(line) {
            this.appendLine();
            this.r.push(line);
        }
        appendLine() {
            if (this.lineBuffer.length) {
                this.r.push('result.push(\'' + this.lineBuffer.join('') + '\');\n');
                this.lineBuffer = [];
            }
        }
        getText() {
            return this.r.join('');
        }
    }
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