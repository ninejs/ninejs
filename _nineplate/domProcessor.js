(function (factory) {
    if (typeof module === 'object' && typeof module.exports === 'object') {
        var v = factory(require, exports); if (v !== undefined) module.exports = v;
    }
    else if (typeof define === 'function' && define.amd) {
        define(["require", "exports", "./utils/parser/amd", './utils/functions', '../core/deferredUtils', './baseProcessor', '../core/objUtils', './renderers/JavascriptRenderer'], factory);
    }
})(function (require, exports) {
    'use strict';
    var functions = require('./utils/functions');
    var def = require('../core/deferredUtils');
    var baseProcessor_1 = require('./baseProcessor');
    var objUtils = require('../core/objUtils');
    var JavascriptRenderer_1 = require('./renderers/JavascriptRenderer');
    var parser, req = require, isAmd = (typeof (define) !== 'undefined') && define.amd, isNode = typeof (window) === 'undefined';
    if (isNode && !isAmd) {
        parser = req('./utils/parser/commonjs');
    }
    else {
        parser = require('./utils/parser/amd');
    }
    var svgNamespace = 'http://www.w3.org/2000/svg';
    var TargetType;
    (function (TargetType) {
        TargetType[TargetType["Attr"] = 0] = "Attr";
        TargetType[TargetType["Text"] = 1] = "Text";
    })(TargetType || (TargetType = {}));
    function compileDom(template, sync, options) {
        var rendererStack = [];
        function pushRenderer(r) {
            rendererStack.push(r);
            return r;
        }
        function popRenderer() {
            rendererStack.pop();
            return rendererStack[rendererStack.length - 1];
        }
        var renderer = pushRenderer(new JavascriptRenderer_1.JavascriptRenderer(true)), parentRenderer = renderer, amdPathMapping = {}, amdEnabled = false;
        renderer
            .addGlobal('window')
            .addGlobal('Object')
            .addGlobal('Array');
        if (!options.standalone) {
            renderer.addGlobal('fn');
        }
        function enableAmd() {
            if (!amdEnabled) {
                parentRenderer
                    .addGlobal('require');
                amdEnabled = true;
            }
        }
        function processDom() {
            var text = template, parsedXml = baseProcessor_1.getParsedXml(text, sync), elementContext = {};
            if (isNode && !sync) {
                return def.when(parsedXml, function (value) {
                    return processParsedXml(new baseProcessor_1.XmlNode(value), null, elementContext);
                }, function (error) {
                    throw error;
                });
            }
            else {
                if (isNode) {
                    return processParsedXml(new baseProcessor_1.XmlNode(parsedXml), null, elementContext);
                }
                else {
                    return processParsedXml(new baseProcessor_1.XmlNode(parsedXml.documentElement), null, elementContext);
                }
            }
        }
        function isAmdExtensionValue(v) {
            return (v || '').indexOf('amd://') === 0;
        }
        function processParsedXml(xmlNode, parentNode, elementContext) {
            var textParseContext, amdInstanceName;
            function tryNewContext(action) {
                var tempCtx = { mode: elementContext.mode };
                action(tempCtx);
                if (tempCtx.needsDom) {
                    elementContext.needsDom = true;
                }
            }
            function nodeAct(xmlNode, parentXmlNode) {
                tryNewContext(function (tempCtx) {
                    if (nodeType(xmlNode) === 3) {
                        if (!elementContext.mode) {
                            processParsedXml(xmlNode, parentXmlNode, elementContext);
                        }
                    }
                    else {
                        processParsedXml(xmlNode, parentXmlNode, tempCtx);
                    }
                });
            }
            function processAttributeAct(xmlNode, nodeName) {
                tryNewContext(function () {
                    processAttribute(xmlNode, nodeName, elementContext);
                });
            }
            function processTextAct(nodeValue, target, targetType) {
                tryNewContext(function () {
                    processTextFragment(nodeValue, target, targetType, elementContext);
                });
            }
            function notSkipped(at) {
                return !at.get('skip');
            }
            function visitChildNodes() {
                var cnt, chunk, attributes = xmlNode.getAttributes().filter(notSkipped), childNodes = xmlNode.getChildNodes();
                for (cnt = 0; cnt < attributes.length; cnt += 1) {
                    if (!attributes[cnt].get('skip')) {
                        nodeAct(attributes[cnt], xmlNode);
                    }
                }
                chunk = renderer.chunk();
                renderer = pushRenderer(chunk.renderer);
                for (cnt = 0; cnt < childNodes.length; cnt += 1) {
                    nodeAct(childNodes[cnt], xmlNode);
                }
                if ((!elementContext.mode) && (!elementContext.needsDom) && (!options.ignoreHtmlOptimization)) {
                    chunk.clear();
                    elementContext.asText = true;
                    textParseContext = new baseProcessor_1.TextParseContext();
                    renderer.addAssignment('result', renderer.literal([]));
                    for (cnt = 0; cnt < childNodes.length; cnt += 1) {
                        processParsedXml(childNodes[cnt], xmlNode, elementContext);
                    }
                    textParseContext.appendLine();
                    attributes = xmlNode.getAttributes().filter(notSkipped);
                    for (cnt = 0; cnt < attributes.length; cnt += 1) {
                        nodeAct(attributes[cnt], xmlNode);
                    }
                    if (childNodes.length) {
                        renderer
                            .addAssignment(renderer
                            .expression('node')
                            .member('innerHTML'), renderer
                            .expression('result')
                            .member('join')
                            .invoke(renderer.literal('')));
                    }
                }
                renderer = popRenderer();
            }
            function nodeType(xmlNode) {
                return xmlNode.nodeType();
            }
            function nodeValue(xmlNode) {
                return xmlNode.nodeValue();
            }
            function checkRerendering() {
                var newVarName, newFunctionName, innerCondition, arr = elementContext.reRenderTargets || [], cnt, partCnt, partLen, part, current, watchFn, watchVariable, innerWatch, forIn, len = arr.length;
                if (elementContext.needsRerenderer) {
                    renderer.addReturn(renderer.varName('node'));
                    renderer.comment('Here starts a live expression', true);
                    renderer.comment('Here ends the live expression', false);
                    newFunctionName = renderer.convertToFunctionCall([]);
                    newVarName = renderer.getNewVariable();
                    renderer.addVar(newVarName);
                    watchVariable = renderer.getNewVariable();
                    renderer.addVar(watchVariable);
                    renderer.addAssignment(newVarName, renderer.expression(newFunctionName).invoke());
                    renderer.comment('Add trigger events here');
                    watchFn = renderer.newFunction([]);
                    watchFn
                        .addVar('freeze', watchFn.literal({}))
                        .addVar('freezeNode', watchFn.expression(newVarName));
                    for (cnt = 0; cnt < forLoopVariableStack.length; cnt += 1) {
                        watchFn
                            .addAssignment(watchFn.expression('freeze').element(watchFn.literal(forLoopVariableStack[cnt])), watchFn.expression('context').element(watchFn.literal(forLoopVariableStack[cnt])));
                    }
                    innerWatch = watchFn.innerFunction('wfn');
                    innerWatch
                        .addParameter('name')
                        .addParameter('oldValue')
                        .addParameter('newValue');
                    innerCondition = innerWatch
                        .addCondition(innerWatch.not(innerWatch.expression('oldValue').equals('newValue').parenthesis())).renderer;
                    innerWatch
                        .addVar('temps', innerWatch.literal({}))
                        .addVar('t')
                        .addVar('p');
                    forIn = innerCondition.addForIn(innerWatch.expression('p'), innerWatch.expression('freeze'));
                    forIn.addAssignment(forIn.expression('temps').element(forIn.raw('p')), forIn.expression('context').element(forIn.raw('p')));
                    forIn.addAssignment(forIn.expression('context').element(forIn.raw('p')), forIn.expression('freeze').element(forIn.raw('p')));
                    innerCondition.addAssignment('t', innerWatch.expression(newFunctionName).invoke());
                    innerCondition.addStatement(innerCondition
                        .expression('freezeNode')
                        .member('parentNode')
                        .member('replaceChild')
                        .invoke(innerCondition.expression('t'), innerCondition.expression('freezeNode')));
                    innerCondition
                        .addAssignment('freezeNode', innerWatch.expression('t'));
                    forIn = innerCondition.addForIn(innerWatch.expression('p'), innerWatch.expression('freeze'));
                    forIn.addAssignment(forIn.expression('context').element(forIn.raw('p')), forIn.expression('temps').element(forIn.raw('p')));
                    watchFn.addReturn(watchFn.expression('wfn'));
                    renderer.addAssignment(watchVariable, watchFn);
                    for (cnt = 0; cnt < len; cnt += 1) {
                        current = arr[cnt];
                        partLen = current.length;
                        renderer.addAssignment('ctxTemp', renderer.expression('context'));
                        for (partCnt = 0; partCnt < partLen - 1; partCnt += 1) {
                            part = current[partCnt];
                            renderer.addAssignment('ctxTemp', renderer.expression('ctxTemp').element(renderer.literal(part)));
                        }
                        renderer
                            .addCondition(renderer.expression('ctxTemp').member('watch'))
                            .renderer
                            .addStatement(renderer
                            .expression('ctxTemp')
                            .member('watch')
                            .invoke(renderer.literal(current[partLen - 1]), renderer.expression(watchVariable).invoke()));
                    }
                }
            }
            function checkRerenderingAttribute() {
                var newVarName, newFunctionName, innerCondition, arr = elementContext.reRenderTargets || [], cnt, partCnt, partLen, part, current, watchFn, watchVariable, innerWatch, forIn, len = arr.length;
                if (elementContext.needsRerenderer) {
                    renderer.addReturn(renderer.varName('node'));
                    renderer.comment('Here starts a live expression with attribute', true);
                    renderer.comment('Here ends the live expression');
                    newFunctionName = renderer.convertToFunctionCall(['node']);
                    newVarName = renderer.getNewVariable();
                    renderer.addVar(newVarName);
                    watchVariable = renderer.getNewVariable();
                    renderer.addVar(watchVariable);
                    renderer.addAssignment(newVarName, renderer.expression(newFunctionName).invoke(renderer.expression('node')));
                    renderer.comment('Add trigger events here');
                    watchFn = renderer.newFunction([]);
                    watchFn
                        .addVar('freeze', watchFn.literal({}))
                        .addVar('freezeNode', watchFn.expression(newVarName));
                    for (cnt = 0; cnt < forLoopVariableStack.length; cnt += 1) {
                        watchFn
                            .addAssignment(watchFn.expression('freeze').element(watchFn.literal(forLoopVariableStack[cnt])), watchFn.expression('context').element(watchFn.literal(forLoopVariableStack[cnt])));
                    }
                    innerWatch = watchFn.innerFunction('wfn');
                    innerWatch
                        .addParameter('name')
                        .addParameter('oldValue')
                        .addParameter('newValue');
                    innerCondition = innerWatch
                        .addCondition(innerWatch.not(innerWatch.expression('oldValue').equals('newValue').parenthesis())).renderer;
                    innerWatch
                        .addVar('temps', innerWatch.literal({}))
                        .addVar('p');
                    forIn = innerCondition.addForIn(innerWatch.expression('p'), innerWatch.expression('freeze'));
                    forIn.addAssignment(forIn.expression('temps').element(forIn.raw('p')), forIn.expression('context').element(forIn.raw('p')));
                    forIn.addAssignment(forIn.expression('context').element(forIn.raw('p')), forIn.expression('freeze').element(forIn.raw('p')));
                    innerCondition.addStatement(innerWatch.expression(newFunctionName).invoke(innerWatch.expression('freezeNode')));
                    forIn = innerCondition.addForIn(innerWatch.expression('p'), innerWatch.expression('freeze'));
                    forIn.addAssignment(forIn.expression('context').element(forIn.raw('p')), forIn.expression('temps').element(forIn.raw('p')));
                    watchFn.addReturn(watchFn.expression('wfn'));
                    renderer.addAssignment(watchVariable, watchFn);
                    for (cnt = 0; cnt < len; cnt += 1) {
                        current = arr[cnt];
                        partLen = current.length;
                        renderer.addAssignment('ctxTemp', renderer.expression('context'));
                        for (partCnt = 0; partCnt < partLen - 1; partCnt += 1) {
                            part = current[partCnt];
                            renderer.addAssignment('ctxTemp', renderer.expression('ctxTemp').element(renderer.literal(part)));
                        }
                        renderer
                            .addCondition(renderer.expression('ctxTemp').member('watch'))
                            .renderer
                            .addStatement(renderer
                            .expression('ctxTemp')
                            .member('watch')
                            .invoke(renderer.literal(current[partLen - 1]), renderer.expression(watchVariable).invoke()));
                        if (isAmdExtension(parentNode)) {
                            var amd2Way = renderer.newFunction([]), amdSetter = amd2Way.newFunction([]);
                            amdSetter
                                .addParameter('name')
                                .addParameter('old')
                                .addParameter('newv')
                                .addStatement(amdSetter.expression('ctxTemp').member('set').invoke(amdSetter.literal(current[partLen - 1]), amdSetter.expression('newv')));
                            amd2Way
                                .addParameter('ctxTemp')
                                .addReturn(amd2Way.expression(amdSetter));
                            renderer
                                .addCondition(renderer.expression('node').member('watch'))
                                .renderer
                                .addStatement(renderer
                                .expression('node')
                                .member('watch')
                                .invoke(renderer.literal(xmlNode.nodeName()), renderer.expression(amd2Way).parenthesis().invoke('ctxTemp')));
                        }
                    }
                }
            }
            function isAmdExtension(nodeParameter) {
                var nsUri = ((nodeParameter || xmlNode).namespaceUri() || '');
                return isAmdExtensionValue(nsUri);
            }
            function solveAmdExtension() {
                var amdPrefix = xmlNode.namespaceUri().substr(6), name = xmlNode.nodeLocalName(), mid = amdPrefix + '/' + name, amdModuleVar = amdPathMapping[mid], instanceName, defaultCondition;
                enableAmd();
                if (!amdModuleVar) {
                    amdModuleVar = renderer.getNewVariable();
                    amdPathMapping[mid] = amdModuleVar;
                    parentRenderer
                        .addVar(amdModuleVar, parentRenderer
                        .expression('require')
                        .invoke(parentRenderer.literal(mid)));
                    var chunk = new JavascriptRenderer_1.Chunk(parentRenderer);
                    defaultCondition = chunk.renderer.addCondition(renderer.expression(amdModuleVar).member('default'));
                    defaultCondition.renderer.addAssignment(amdModuleVar, renderer.expression(amdModuleVar).member('default'));
                    parentRenderer.addStatementAtBeginning(chunk);
                }
                instanceName = renderer.getNewVariable();
                renderer.addVar(instanceName);
                renderer.addAssignment(instanceName, renderer.createObject(amdModuleVar));
                renderer.addAssignment('node', renderer.expression(instanceName));
                return instanceName;
            }
            function showNjsWidget(instanceName) {
                var conditionRenderer, childWidgetConditionRenderer;
                conditionRenderer = renderer.addCondition(renderer.expression(instanceName).member('$njsWidget')).renderer;
                conditionRenderer
                    .addStatement(conditionRenderer
                    .expression(instanceName)
                    .member('show')
                    .invoke(conditionRenderer
                    .expression('nodes')
                    .element(conditionRenderer
                    .expression('nodes')
                    .member('length')
                    .minus(conditionRenderer.literal(1)))));
                childWidgetConditionRenderer = conditionRenderer
                    .addCondition(conditionRenderer
                    .expression('context')
                    .member('registerChildWidget')).renderer;
                childWidgetConditionRenderer
                    .addStatement(childWidgetConditionRenderer
                    .expression('context')
                    .member('registerChildWidget')
                    .invoke(childWidgetConditionRenderer.expression('node')));
            }
            if (!parentNode) {
                renderer
                    .addCondition(renderer.not(renderer.varName('document'))).renderer
                    .addAssignment('document', 'window.document');
                renderer
                    .addVar('nodes', renderer.raw('[]'))
                    .addVar('node')
                    .addVar('att')
                    .addVar('txn')
                    .addVar('attachTemp')
                    .addVar('putValue')
                    .addVar('x')
                    .addVar('ctxTemp')
                    .addVar('y')
                    .addVar('e', '(' + renderer.varName('fn') + '.tst()?' + renderer.varName('fn') + '.e:' + renderer.varName('fn') + '.ae)')
                    .addVar('ens', '(' + renderer.varName('fn') + '.tst()?' + renderer.varName('fn') + '.ens:' + renderer.varName('fn') + '.aens)')
                    .addVar('aens', renderer.varName('fn') + '.aens')
                    .addVar('a', renderer.varName('fn') + '.a')
                    .addVar('t', renderer.varName('fn') + '.t')
                    .addVar('av')
                    .addVar('result')
                    .addVar('v');
                solveTagName(xmlNode, true, elementContext);
                renderer
                    .addStatement(renderer.expression('nodes').member('push').invoke(renderer.expression('node')));
                visitChildNodes();
                checkRerendering();
                renderer.addAssignment('node', renderer.expression('nodes').member('pop').invoke());
                renderer.addAssignment(renderer.expression('r').member('domNode'), renderer.expression('node'));
            }
            else {
                if (nodeType(xmlNode) === 1) {
                    renderer
                        .addStatement(renderer.expression('nodes').member('push').invoke(renderer.expression('node')));
                    renderer = pushRenderer(renderer.chunk().renderer);
                    if (isAmdExtension(xmlNode)) {
                        elementContext.mode = 'amdExtension';
                        amdInstanceName = solveAmdExtension();
                        visitChildNodes();
                        showNjsWidget(amdInstanceName);
                        renderer.addAssignment('node', renderer.expression('node').member('domNode'));
                    }
                    else {
                        solveTagName(xmlNode, false, elementContext);
                        visitChildNodes();
                        checkRerendering();
                    }
                    renderer.addAssignment('node', renderer.expression('nodes').member('pop').invoke());
                    renderer = popRenderer();
                }
                else if (nodeType(xmlNode) === 2) {
                    renderer = pushRenderer(renderer.chunk().renderer);
                    processAttributeAct(xmlNode, xmlNode.nodeName());
                    checkRerenderingAttribute();
                    renderer = popRenderer();
                }
                else if (nodeType(xmlNode) === 3) {
                    renderer.addAssignment('txn', renderer.expression('t').invoke('node', renderer.literal(''), renderer.expression('node').member('ownerDocument')));
                    processTextAct(nodeValue(xmlNode), renderer.expression('txn').member('nodeValue'), TargetType.Text);
                }
            }
        }
        var forLoopStack = [];
        var forLoopVariableStack = [];
        function processParsedResult(result, target, targetType, elementContext, compound) {
            var cnt, fName;
            if (result.type === 'mixed') {
                for (cnt = 0; cnt < result.content.length; cnt += 1) {
                    processParsedResult(result.content[cnt], target, targetType, elementContext, true);
                }
            }
            else if (result.type === 'expressionToken') {
                processExpressionToken(result, target, targetType, elementContext, compound);
            }
            else if (result.type === 'any') {
                renderer
                    .addAssignment(target, target.op('+', renderer.literal(baseProcessor_1.safeFilter(result.content))));
            }
            else if (result.type === 'beginFor') {
                fName = renderer.getNewVariable();
                forLoopStack.push(fName);
                forLoopVariableStack.push(result.identifier);
                renderer = pushRenderer(renderer.innerFunction(fName));
                renderer
                    .addParameter('context')
                    .addVar('arr')
                    .addVar('temp')
                    .addVar('cnt')
                    .addVar('ident', renderer.literal(result.identifier));
                renderer
                    .addAssignment('temp', renderer.expression('context').element('ident'));
                renderer
                    .addAssignment('arr', makePutValue(result.value.value, false)
                    .or(renderer.literal([])));
                renderer = pushRenderer(renderer
                    .addFor(renderer.newAssignment('cnt', renderer.literal(0)), renderer.expression('cnt')
                    .lessThan(renderer.expression('arr').member('length')), renderer.newAssignment('cnt', renderer.expression('cnt').plus(renderer.literal(1)))));
                renderer.addAssignment(renderer.expression('context').element(renderer.expression('ident')), renderer.expression('arr').element(renderer.expression('cnt')));
            }
            else if (result.type === 'endFor') {
                renderer = popRenderer();
                renderer
                    .addAssignment(renderer
                    .expression('context').member(renderer.expression('ident')), renderer.expression('temp'));
                renderer = popRenderer();
                fName = forLoopStack.pop();
                forLoopVariableStack.pop();
                renderer
                    .addStatement(renderer
                    .expression(fName)
                    .member('call')
                    .invoke(renderer.expression('this'), renderer.expression('context')));
            }
            else {
                throw new Error('unsupported token');
            }
        }
        function processTextFragment(content, target, targetType, elementContext) {
            content = baseProcessor_1.trim(content);
            if (content) {
                var parseResult = parser.parse(content);
                processParsedResult(parseResult, target, targetType, elementContext, false);
            }
        }
        function makePutValue(expression, inFunctionCall) {
            var exp, cnt, arr;
            if (expression.contentType === 'identifier') {
                if (expression.content && expression.content.content) {
                    return makePutValue(expression.content, false);
                }
                else {
                    arr = expression.content.split('.');
                    if (inFunctionCall) {
                        exp = renderer.expression('x');
                        for (cnt = 0; cnt < arr.length - 1; cnt += 1) {
                            exp = exp.element(renderer.literal(arr[cnt]));
                        }
                        if (arr.length > 1) {
                            exp = renderer.newAssignment('y', exp).member(arr[arr.length - 1]);
                        }
                    }
                    else {
                        exp = renderer.expression('context');
                        for (cnt = 0; cnt < arr.length; cnt += 1) {
                            exp = exp.element(renderer.literal(arr[cnt]));
                        }
                    }
                    return exp;
                }
            }
            else if (expression.contentType === 'functionCall') {
                return solveFunctionCall(expression, inFunctionCall);
            }
            else if (expression.contentType === 'string') {
                return renderer.literal(baseProcessor_1.safeFilter(expression.content));
            }
            else {
                throw new Error('unsupported content type ' + expression.contentType);
            }
        }
        var optimizerSortMap = { '9js': 1, 'Dijit': 2, 'DOM': 3, 'String': 4 };
        function optimizerSort(a, b) {
            return (optimizerSortMap[a] || 4) - (optimizerSortMap[b] || 4);
        }
        function processExpression(expression, target, targetType, elementContext, compound) {
            var optimized = expression.optimized || ['String', 'DOM', '9js', 'Dijit'];
            function putValue(targetType) {
                var cnt, condition;
                function testPut(opType) {
                    if (opType === 'String') {
                        return renderer.expression('putValue').notEquals(renderer.raw('undefined')).parenthesis();
                    }
                    else if (opType === 'DOM') {
                        return renderer.expression('putValue').member('tagName');
                    }
                    else if (opType === 'Dijit') {
                        return renderer.expression('putValue').member('domNode');
                    }
                    else if (opType === '9js') {
                        return renderer.expression('putValue').element(renderer.literal('$njsWidget'));
                    }
                }
                function processPut(opType) {
                    if (opType === 'String') {
                        renderer
                            .addAssignment(target, renderer
                            .expression(target)
                            .plus(renderer
                            .expression('putValue')
                            .notEquals(renderer.raw('undefined'))
                            .iif(renderer.expression('putValue'), renderer.literal(''))
                            .parenthesis()));
                    }
                    else if (opType === 'DOM') {
                        renderer.addStatement(renderer.expression('node').member('appendChild').invoke(renderer.expression('putValue')));
                        renderer
                            .addAssignment('txn', renderer
                            .expression('t')
                            .invoke(renderer.expression('node'), renderer.literal(''), renderer
                            .expression('node')
                            .member('ownerDocument')));
                    }
                    else if (opType === '9js') {
                        renderer
                            .addStatement(renderer
                            .expression('putValue')
                            .member('show')
                            .invoke(renderer.expression('node')));
                    }
                    else if (opType === 'Dijit') {
                        renderer
                            .addStatement(renderer
                            .expression('node')
                            .member('appendChild')
                            .invoke(renderer.expression('putValue').member('domNode')));
                    }
                }
                if (targetType === TargetType.Attr) {
                    var attrCondition, attrElse;
                    if (compound) {
                        attrCondition = renderer.addCondition(renderer.expression(target).notEquals(renderer.literal('')));
                        attrCondition.renderer.addAssignment(target, renderer.expression(target).op('+', renderer.expression('putValue').or(renderer.literal('')).parenthesis()));
                        attrElse = attrCondition.elseDo();
                        attrElse.addAssignment(target, renderer.expression('putValue').or(renderer.literal('')).parenthesis());
                    }
                    else {
                        var attrCondition = renderer.addCondition(renderer.expression('putValue').notEquals(renderer.raw('undefined')));
                        attrCondition.renderer.addAssignment(target, renderer.expression('putValue'));
                        var attrElse = attrCondition.elseDo();
                        attrElse.addAssignment(target, renderer.literal(''));
                    }
                }
                else if (targetType === TargetType.Text) {
                    if (optimized.length > 1) {
                        elementContext.needsDom = true;
                        renderer = pushRenderer(renderer.addCondition(renderer.expression('putValue')
                            .notEquals(renderer.raw('undefined'))
                            .parenthesis()
                            .and(renderer
                            .expression('putValue')
                            .notEquals(renderer.raw('null'))
                            .parenthesis()))
                            .renderer);
                        optimized = optimized.sort(optimizerSort);
                        for (cnt = 0; cnt < optimized.length; cnt += 1) {
                            if (cnt === 0) {
                                condition = renderer.addCondition(testPut(optimized[cnt]));
                                renderer = pushRenderer(condition.renderer);
                            }
                            else {
                                renderer = condition.elseIf(testPut(optimized[cnt]));
                            }
                            processPut(optimized[cnt]);
                            if ((cnt + 1) === optimized.length) {
                                renderer = popRenderer();
                            }
                        }
                        renderer = popRenderer();
                    }
                    else {
                        if (optimized[0] !== 'String') {
                            elementContext.needsDom = true;
                        }
                        processPut(optimized[0]);
                    }
                }
            }
            var r = '';
            if ((expression.contentType === 'identifier') || (expression.contentType === 'functionCall')) {
                renderer.addAssignment('putValue', makePutValue(expression, false));
                putValue(targetType);
            }
            else {
                console.log('unsupported expression content type: ');
                console.log(expression);
            }
            return r;
        }
        function processLiveExpression(expression, target, targetType, elementContext, compound) {
            elementContext.needsRerenderer = true;
            elementContext.needsDom = true;
            if (!elementContext.reRenderTargets) {
                elementContext.reRenderTargets = [];
            }
            if (expression.contentType === 'identifier') {
                elementContext.reRenderTargets.push((expression.content || '').split('.'));
            }
            return processExpression.apply(null, arguments);
        }
        function isAttachPoint(xmlNode) {
            return (/^data-(ninejs-attach|dojo-attach-point)$/).test(xmlNode.nodeName());
        }
        function processAttachPoint(xmlNode) {
            var condition, conditionRenderer, innerCondition, innerElse, elseRenderer;
            renderer
                .addAssignment('attachTemp', renderer
                .expression('r')
                .element(renderer.literal(xmlNode.value())));
            condition = renderer.addCondition(renderer.expression('attachTemp'));
            conditionRenderer = condition.renderer;
            innerCondition = conditionRenderer
                .addCondition(conditionRenderer
                .expression('Object')
                .member('prototype')
                .member('toString')
                .member('call')
                .invoke(conditionRenderer.expression('attachTemp'))
                .equals(conditionRenderer.literal('[object Array]')));
            innerCondition
                .renderer
                .addStatement(innerCondition.renderer
                .expression('attachTemp')
                .member('push')
                .invoke(innerCondition.renderer.expression('node')));
            innerElse = innerCondition.elseDo();
            innerElse
                .addAssignment(innerElse
                .expression('r')
                .element(innerElse.literal(xmlNode.value())), innerElse
                .array([])
                .add(innerElse.expression('attachTemp'))
                .add(innerElse.expression('node')));
            elseRenderer = condition.elseDo();
            elseRenderer
                .addAssignment(elseRenderer
                .expression('r')
                .element(elseRenderer.literal(xmlNode.value())), elseRenderer
                .expression('node'));
        }
        function isOnEvent(xmlNode) {
            return (/^data-ninejs-on-/).test(xmlNode.nodeName());
        }
        function processOnEvent(xmlNode) {
            var eventName = xmlNode.nodeName().substr('data-ninejs-on-'.length), methodName = xmlNode.value(), eventRenderer = renderer.newFunction([]);
            eventRenderer.addStatement(eventRenderer
                .expression('context')
                .member(methodName)
                .member('apply')
                .invoke(eventRenderer.expression('context'), eventRenderer.expression('arguments')));
            renderer.addStatement(renderer
                .expression('node')
                .member('addEventListener')
                .invoke(renderer.literal(eventName), eventRenderer));
        }
        function isSubscribeEvent(xmlNode) {
            return (/^data-ninejs-subscribe-/).test(xmlNode.nodeName());
        }
        function processSubscribeEvent(xmlNode) {
            var eventName = xmlNode.nodeName().substr('data-ninejs-subscribe-'.length), methodName = xmlNode.value(), eventRenderer = renderer.newFunction([]), subsFunction = renderer.newFunction([]), subsFunctionName = renderer.getNewVariable();
            subsFunction.addParameter('node');
            eventRenderer.addReturn(eventRenderer
                .expression('context')
                .element(eventRenderer.literal(methodName))
                .invoke(eventRenderer.expression('node'), eventRenderer.expression('context')));
            subsFunction.addStatement(renderer
                .expression('context')
                .member('subscribe')
                .invoke(subsFunction.literal(eventName), eventRenderer));
            renderer.addVar(subsFunctionName, subsFunction);
            renderer.addStatement(renderer.expression(subsFunctionName).invoke(renderer.expression('node')));
        }
        function isAmdPlugin(xmlNode) {
            return ((xmlNode.namespaceUri() || '').indexOf('amd://') === 0) && (xmlNode.nodeName().indexOf('__') < 0);
        }
        function processAmdPlugin(xmlNode) {
            var namespaceUri = xmlNode.namespaceUri(), amdPrefix = namespaceUri.substr(6), moduleName = xmlNode.nodeName(), mid = amdPrefix + '/' + moduleName, amdModuleVar = amdPathMapping[mid];
            enableAmd();
            if (!amdModuleVar) {
                amdModuleVar = renderer.getNewVariable();
                amdPathMapping[mid] = amdModuleVar;
                parentRenderer
                    .addVar(amdModuleVar, parentRenderer
                    .expression('require')
                    .invoke(parentRenderer.literal(mid)));
            }
            var options = {};
            xmlNode.parentNode().getAttributes().filter(function (at) {
                return at.namespaceUri() === namespaceUri && (at.nodeName().indexOf((moduleName + '__')) === 0);
            }).forEach(function (at) {
                options[at.nodeName().substr((moduleName + '__').length)] = at.value();
                at.set('skip', true);
            });
            renderer.addStatement(renderer
                .expression(amdModuleVar)
                .invoke(renderer.expression('node'), renderer.expression('context'), renderer.literal(xmlNode.value()), renderer.raw(JSON.stringify(options))));
        }
        function processExpressionToken(result, target, targetType, elementContext, compound) {
            if (result.modifier === 'live') {
                if (result.value.type === 'expression') {
                    processLiveExpression(result.value, target, targetType, elementContext, compound);
                }
                else {
                    console.log('unsupported expression token type: ');
                    console.log(result.value);
                }
            }
            else {
                if (result.value.type === 'expression') {
                    processExpression(result.value, target, targetType, elementContext, compound);
                }
                else {
                    console.log('unsupported expression token type: ');
                    console.log(result.value);
                }
            }
        }
        function getAppendStrategy(xmlNode) {
            if (xmlNode.namespaceUri() === svgNamespace) {
                return 'aens';
            }
            else {
                return 'ens';
            }
        }
        function solveFunctionCall(expression, inFunctionCall) {
            var arr = expression['arguments'];
            var cnt;
            var functionArgs = [];
            for (cnt = 0; cnt < arr.length; cnt += 1) {
                functionArgs.push(makePutValue(arr[cnt], inFunctionCall));
            }
            if (inFunctionCall) {
                renderer.addAssignment('x', makePutValue(expression.content, true));
                renderer
                    .addAssignment('x', renderer
                    .expression('x')
                    .member('apply')
                    .invoke(renderer.expression('y'), renderer.array(functionArgs)));
                return renderer.expression('x');
            }
            else {
                if (expression.content && expression.content.contentType !== 'functionCall') {
                    return renderer
                        .newAssignment('x', makePutValue(expression.content, false)
                        .member('apply')
                        .invoke(renderer.expression('context'), renderer.array(functionArgs)));
                }
                else {
                    return renderer
                        .newAssignment('x', makePutValue(expression.content, false)
                        .member('apply')
                        .invoke(renderer.expression('x'), renderer.array(functionArgs)));
                }
            }
        }
        function solveTagName(xmlNode, isRoot, elementContext) {
            if (xmlNode.hasVariableTagName()) {
                xmlNode.getVariableTagName(function (val) {
                    processTextFragment(val, renderer.expression('x'), TargetType.Attr, elementContext);
                });
                if (isRoot) {
                    renderer
                        .addAssignment('node', renderer
                        .expression('document')
                        .member('createElement')
                        .invoke(renderer.expression('putValue').or(renderer.literal(xmlNode.nodeName()))));
                }
                else {
                    renderer
                        .addAssignment('node', renderer
                        .expression('e')
                        .invoke(renderer.expression('node'), renderer.expression('putValue').or(renderer.literal(xmlNode.nodeName())), renderer.expression('node').member('ownerDocument')));
                }
            }
            else {
                if (isRoot) {
                    if (xmlNode.namespaceUri()) {
                        renderer
                            .addAssignment('node', renderer
                            .expression('document')
                            .member('createElementNS')
                            .invoke(renderer.literal(xmlNode.namespaceUri()), renderer.literal(xmlNode.nodeName())));
                    }
                    else {
                        renderer
                            .addAssignment('node', renderer
                            .expression('document')
                            .member('createElement')
                            .invoke(renderer.literal(xmlNode.nodeName())));
                    }
                }
                else {
                    if (xmlNode.namespaceUri()) {
                        renderer
                            .addAssignment('node', renderer
                            .expression(getAppendStrategy(xmlNode))
                            .invoke(renderer.expression('node'), renderer.literal(xmlNode.nodeName()), renderer.literal(xmlNode.namespaceUri()), renderer.expression('node').member('ownerDocument')));
                    }
                    else {
                        renderer
                            .addAssignment('node', renderer
                            .expression('e')
                            .invoke(renderer.expression('node'), renderer.literal(xmlNode.nodeName()), renderer.expression('node').member('ownerDocument')));
                    }
                }
            }
        }
        function processAttribute(xmlNode, attName, elementContext) {
            var attval;
            if (isAttachPoint(xmlNode) || attName === 'data-ninejs-tagName') {
                elementContext.needsDom = true;
                processAttachPoint(xmlNode);
            }
            else if (isOnEvent(xmlNode)) {
                elementContext.needsDom = true;
                processOnEvent(xmlNode);
            }
            else if (isAmdPlugin(xmlNode)) {
                elementContext.needsDom = true;
                processAmdPlugin(xmlNode);
            }
            else if (isSubscribeEvent(xmlNode)) {
                elementContext.needsDom = true;
                processSubscribeEvent(xmlNode);
            }
            else {
                renderer.addAssignment('av', renderer.literal(''));
                attval = xmlNode.value();
                processTextFragment(attval, renderer.expression('av'), TargetType.Attr, elementContext);
                if (elementContext.mode === 'amdExtension') {
                    renderer
                        .addStatement(renderer
                        .expression('node')
                        .member('set')
                        .invoke(renderer.literal(attName), renderer.expression('av')));
                }
                else {
                    if ((attName === 'class') && (!xmlNode.parentNode() || !xmlNode.parentNode().namespaceUri())) {
                        renderer
                            .addAssignment(renderer.expression('node').member('className'), renderer.expression('av'));
                    }
                    else {
                        if (!isAmdExtensionValue(attval)) {
                            renderer
                                .addStatement(renderer
                                .expression('node')
                                .member('setAttribute')
                                .invoke(renderer.literal(attName), renderer.expression('av')));
                        }
                    }
                }
            }
        }
        function assignDependencies(fn) {
            var p, r = [];
            for (p in amdPathMapping) {
                if (amdPathMapping.hasOwnProperty(p)) {
                    r.push(p);
                }
            }
            fn.amdDependencies = r;
        }
        var result, promise;
        renderer
            .addParameter('context')
            .addParameter('document')
            .init();
        if (options.standaloneTemplate) {
            renderer
                .addVar('fn', objUtils.deepToString(functions));
        }
        else {
            enableAmd();
            parentRenderer
                .addVar('fn', parentRenderer
                .expression('require')
                .invoke(parentRenderer.literal((options.ninejsPrefix || 'ninejs') + "/_nineplate/utils/functions")));
            amdPathMapping[((options.ninejsPrefix || 'ninejs') + "/_nineplate/utils/functions")] = 'fn';
        }
        renderer
            .addVar('r', renderer.raw('{}'));
        if (sync) {
            processDom();
            renderer.addReturn(renderer.varName('r'));
            result = renderer.getFunction();
            assignDependencies(result);
        }
        else {
            promise = processDom();
            return def.when(promise, function () {
                var result;
                renderer.addReturn('r');
                result = renderer.getFunction();
                assignDependencies(result);
                return result;
            }, function (error) {
                throw error;
            });
        }
        renderer = popRenderer();
        if (renderer) {
            throw new Error('syntax error. May be an unclosed control structure.');
        }
        return result;
    }
    exports.compileDom = compileDom;
});
//# sourceMappingURL=domProcessor.js.map