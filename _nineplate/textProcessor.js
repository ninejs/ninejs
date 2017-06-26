(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports", "./utils/parser/amd", "../core/deferredUtils", "./baseProcessor"], factory);
    }
})(function (require, exports) {
    'use strict';
    Object.defineProperty(exports, "__esModule", { value: true });
    var deferredUtils = require("../core/deferredUtils");
    var baseProcessor_1 = require("./baseProcessor");
    var parser, req = require, isNode = typeof (window) === 'undefined', isAmd = (typeof (define) !== 'undefined') && (!!define.amd);
    if (!isAmd) {
        parser = req('./utils/parser/commonjs');
    }
    else {
        parser = require('./utils/parser/amd');
    }
    function makePutValue(expression, inFunctionCall, parseContext) {
        function quoteSafe(identifier) {
            return '[\'' + identifier + '\']';
        }
        var cnt, t, arr;
        if (expression.contentType === 'identifier') {
            if (expression.content && expression.content.content) {
                return makePutValue(expression.content, false, parseContext);
            }
            else {
                arr = expression.content.split('.');
                if (inFunctionCall) {
                    arr.splice(arr.length - 1, 1);
                }
                t = 'context';
                for (cnt = 0; cnt < arr.length; cnt += 1) {
                    t += quoteSafe(arr[cnt]);
                }
                return t;
            }
        }
        else if (expression.contentType === 'functionCall') {
            return solveFunctionCall(expression, parseContext);
        }
        else if (expression.contentType === 'string') {
            return '\'' + baseProcessor_1.safeFilter(expression.content) + '\'';
        }
    }
    function processExpression(expression, parseContext) {
        var optimized = expression.optimized || ['String'];
        function putValue() {
            var cnt;
            function testPut(opType) {
                if (opType === 'String') {
                    parseContext.append('if (v) {\n');
                }
            }
            function processPut(opType) {
                if (opType === 'String') {
                    parseContext.append('result.push(v);');
                }
            }
            parseContext.appendLine();
            if (!expression.optimized) {
                parseContext.append('if (v) {\n');
                for (cnt = 0; cnt < optimized.length; cnt += 1) {
                    if (cnt > 0) {
                        parseContext.append('else ');
                    }
                    testPut(optimized[cnt]);
                    processPut(optimized[cnt]);
                    parseContext.append('}\n');
                }
                parseContext.append('}\n');
            }
            else {
                processPut(optimized[0]);
            }
        }
        if (expression.contentType === 'identifier') {
            var putValueText = 'v = ' + makePutValue(expression, false, parseContext) + ';\n';
            parseContext.append(putValueText);
            putValue();
        }
        else if (expression.contentType === 'functionCall') {
            var putValueText = 'v = ' + makePutValue(expression, false, parseContext) + ';\n';
            parseContext.append(putValueText);
            putValue();
        }
        else {
            console.log('unsupported expression content type: ');
            console.log(expression);
        }
    }
    function processExpressionToken(result, parseContext) {
        if (result.value.type === 'expression') {
            processExpression(result.value, parseContext);
        }
        else {
            console.log('unsupported expression token type: ');
            console.log(result.value);
        }
    }
    function processParsedResult(result, parseContext) {
        var cnt;
        if (result.type === 'mixed') {
            for (cnt = 0; cnt < result.content.length; cnt += 1) {
                processParsedResult(result.content[cnt], parseContext);
            }
        }
        else if (result.type === 'expressionToken') {
            processExpressionToken(result, parseContext);
        }
        else if (result.type === 'any') {
            parseContext.lineBuffer.push(baseProcessor_1.safeFilter(result.content));
        }
        else if (result.type === 'beginFor') {
            parseContext.appendLine();
            parseContext.append('(function(context) {\n');
            parseContext.append('var arr, temp, cnt, ident;\n');
            parseContext.append('ident = \'' + result.identifier + '\';\n');
            parseContext.append('temp = context[ident];\n');
            parseContext.append('arr = ' + makePutValue(result.value.value, false, parseContext) + ' || [];\n');
            parseContext.append('for (cnt=0;cnt < arr.length; cnt += 1) {\n');
            parseContext.append('context[ident] = arr[cnt];\n');
        }
        else if (result.type === 'endFor') {
            parseContext.appendLine();
            parseContext.append('}\n');
            parseContext.append('context[ident] = temp;\n');
            parseContext.append('}).call(this, context);\n');
        }
    }
    function solveFunctionCall(expression, parseContext) {
        var arr = expression['arguments'];
        var cnt;
        var functionArgs = [];
        for (cnt = 0; cnt < arr.length; cnt += 1) {
            functionArgs.push(makePutValue(arr[cnt], false, parseContext));
        }
        return makePutValue(expression.content, false, parseContext) + '(' + functionArgs.join(', ') + ')';
    }
    function processParsedXml(xmlNode, parseContext) {
        function getAttributes(xmlNode) {
            return xmlNode.attributes;
        }
        function getChildNodes(xmlNode) {
            if (isNode) {
                return xmlNode.children;
            }
            else {
                return xmlNode.childNodes;
            }
        }
        function nodeName(xmlNode) {
            if (isNode) {
                if (xmlNode.prefix) {
                    return xmlNode.prefix + ':' + xmlNode.nodeName;
                }
                else {
                    return xmlNode.nodeName;
                }
            }
            else {
                if (xmlNode.prefix) {
                    return xmlNode.prefix + ':' + xmlNode.name;
                }
                else {
                    return xmlNode.nodeName;
                }
            }
        }
        function namespaces(xmlNode) {
            if (isNode) {
                return xmlNode.namespaces.map(function (item) {
                    if (!item[0]) {
                        return 'xmlns=\'' + item[1] + '\'';
                    }
                    else {
                        return 'xmlns:' + item[0] + '=\'' + item[1] + '\'';
                    }
                }).join(' ');
            }
            else {
                if (xmlNode.prefix) {
                    return 'xmlns:' + xmlNode.prefix + '=\"' + xmlNode.namespaceURI + '\"';
                }
                else if (xmlNode.namespaceURI) {
                    return 'xmlns=\"' + xmlNode.namespaceURI + '\"';
                }
                return '';
            }
        }
        function namespaceUri(xmlNode) {
            return xmlNode.namespaceUri;
        }
        var processElement = function () {
            var nsList;
            parseContext.lineBuffer.push('<' + nodeName(xmlNode));
            nsList = namespaces(xmlNode);
            var attributes = getAttributes(xmlNode);
            if (nsList || attributes.length) {
                parseContext.lineBuffer.push(' ');
            }
            if (nsList) {
                parseContext.lineBuffer.push(baseProcessor_1.safeFilter(nsList));
                if (attributes.length) {
                    parseContext.lineBuffer.push(' ');
                }
            }
            for (cnt = 0; cnt < attributes.length; cnt += 1) {
                if (cnt > 0) {
                    parseContext.lineBuffer.push(' ');
                }
                processParsedXml(attributes[cnt], parseContext);
            }
            childNodes = getChildNodes(xmlNode);
            if (childNodes.length || ((nodeName(xmlNode) === 'script') && (!namespaceUri(xmlNode)))) {
                parseContext.lineBuffer.push('>');
                for (cnt = 0; cnt < childNodes.length; cnt += 1) {
                    processParsedXml(childNodes[cnt], parseContext);
                }
                parseContext.lineBuffer.push('</' + nodeName(xmlNode) + '>');
            }
            else {
                parseContext.lineBuffer.push(' />');
            }
        };
        var cnt, childNodes;
        if (xmlNode.nodeType === 1) {
            processElement();
        }
        else if (xmlNode.nodeType === 2) {
            parseContext.lineBuffer.push(nodeName(xmlNode) + baseProcessor_1.safeFilter('=\''));
            processTextFragment(baseProcessor_1.trim(xmlNode.value), parseContext);
            parseContext.lineBuffer.push(baseProcessor_1.safeFilter('\''));
        }
        else if (xmlNode.nodeType === 3) {
            processTextFragment(baseProcessor_1.trim(xmlNode.nodeValue), parseContext);
        }
        else if ((xmlNode.nodeType === 4) && (!parseContext.ignoreComments)) {
            processComment(xmlNode.nodeValue, parseContext);
        }
        return parseContext;
    }
    function processText(text, sync) {
        var parsedXml = baseProcessor_1.getParsedXml(text, sync), parseContext = new baseProcessor_1.TextParseContext();
        if (isNode && !sync) {
            return deferredUtils.when(parsedXml, function (value) {
                processParsedXml(value, parseContext);
                parseContext.appendLine();
                return parseContext.getText();
            });
        }
        else {
            if (isNode) {
                processParsedXml(parsedXml, parseContext);
                parseContext.appendLine();
                return parseContext.getText();
            }
            else {
                processParsedXml(parsedXml.documentElement, parseContext);
                parseContext.appendLine();
                return parseContext.getText();
            }
        }
    }
    function processComment(content, parseContext) {
        parseContext.lineBuffer.push('<!--');
        processTextFragment(content, parseContext);
        parseContext.lineBuffer.push('-->');
    }
    function processTextFragment(content, parseContext) {
        if (content) {
            try {
                var parseResult = parser.parse(content);
                processParsedResult(parseResult, parseContext);
            }
            catch (error) {
                console.log(error);
                throw new Error(error);
            }
        }
    }
    function compileText(template, sync) {
        var result, buildString, promise;
        buildString = '\'use strict\';\n';
        buildString += 'var result = [], v, x, y;\n';
        if (isNode && !sync) {
            promise = processText(template, sync);
            return deferredUtils.when(promise, function (value) {
                var result;
                buildString += value;
                buildString += 'return result.join(\'\');\n';
                result = Function.call(null, ['context'], buildString);
                return result;
            });
        }
        else {
            if (sync) {
                buildString += processText(template, true);
                buildString += 'return result.join(\'\');\n';
                result = Function.call(null, ['context'], buildString);
            }
            else {
                promise = processText(template, false);
                return promise.then(function (value) {
                    var result;
                    buildString += value;
                    buildString += 'return result.join(\'\');\n';
                    result = Function.call(null, ['context'], buildString);
                    return result;
                });
            }
        }
        return result;
    }
    exports.compileText = compileText;
});
//# sourceMappingURL=textProcessor.js.map