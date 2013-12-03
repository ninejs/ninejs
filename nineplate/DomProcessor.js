/** 
@module ninejs/nineplate/domProcessor 
@author Eduardo Burgos <eburgos@gmail.com>
*/
(function() {
	'use strict';
	var isAmd = (typeof(define) !== 'undefined') && define.amd;
	var isDojo = isAmd && define.amd.vendor === 'dojotoolkit.org';
	var isNode = (typeof(window) === 'undefined');
	var req = (isDojo && isNode)? global.require : require;

	/** 
	@exports domProcessor
	*/
	function moduleExport(functions, parser, def, baseProcessor, objUtils/*, renderer*/) {
		/**
		Takes a template object and transforms it into a function that renders that xml (or html)
		@param {string} template - XML text that we want to be compiled.
		@param {bool} sync - Tells wether or not the compilation is evented (Node.js) or synchronous (The template is compiled as soon as it returns).
		@param {Object} options - Options object used to modify the compilers behavior.
		*/
		function compileDom(template, sync, options) {
			/*
			Transforms xml text into an object model that the compiler understands
			@param {string} template - Nineplate's template object that we want to be compiled.
			*/
			function processDom() {
				var text = template,
					parsedXml = baseProcessor.getParsedXml(text, sync),
					XmlNode = baseProcessor.XmlNode;
				if (isNode && !sync) {
					return def.when(parsedXml, function(value) {
						return processParsedXml(new XmlNode(value), null, {});
					});
				}
				else {
					if (isNode) {
						return processParsedXml(new XmlNode(parsedXml), null, {});
					}
					else {
						return processParsedXml(new XmlNode(parsedXml.documentElement), null, {});
					}
				}
			}
			/*
			returns rendered code for the supplied xmlNode
			@param {XmlNode} template - Nineplate's template object that we want to be compiled.
			*/
			function processParsedXml(xmlNode, parentNode, elementContext) {
				var r = '',
					childrenString = '',
					cnt,
					attributes,
					childNodes,
					TextParseContext,
					textParseContext;
				function act(callback) {
					var tempCtx = {},
						r;
					r = callback.call(null, tempCtx);
					if (tempCtx.needsDom) {
						elementContext.needsDom = true;
					}
					return r;
				}
				function nodeAct(xmlNode, parentXmlNode) {
					return act.call(null, function(tempCtx) {
						return processParsedXml(xmlNode, parentXmlNode, tempCtx);
					});
				}
				function processAttributeAct(xmlNode, nodeName) {
					return act.call(null, function(tempCtx) {
						return processAttribute(xmlNode, nodeName, tempCtx);
					});
				}
				function processTextAct(nodeValue, target, targetType) {
					return act.call(null, function(tempCtx) {
						return processTextFragment(nodeValue, target, targetType, null, null, tempCtx);
					});
				}
				function visitChildNodes() {
					attributes = xmlNode.getAttributes();
					for (cnt = 0; cnt < attributes.length; cnt += 1) {
						childrenString += nodeAct(attributes[cnt], xmlNode);
					}
					childNodes = xmlNode.getChildNodes();
					for (cnt = 0; cnt < childNodes.length; cnt += 1) {
						childrenString += nodeAct(childNodes[cnt], xmlNode);
					}
					if (!elementContext.needsDom && !options.ignoreHtmlOptimization) { //Taking the innerHTML route instead
						TextParseContext = baseProcessor.TextParseContext;
						textParseContext = new TextParseContext();
						for (cnt = 0; cnt < childNodes.length; cnt += 1) {
							processParsedXml(childNodes[cnt], xmlNode, elementContext);
						}
						textParseContext.appendLine();
						r += 'result = [];\n';
						childrenString = '';
						attributes = xmlNode.getAttributes();
						for (cnt = 0; cnt < attributes.length; cnt += 1) {
							childrenString += nodeAct(attributes[cnt], xmlNode);
						}
						r += childrenString;
						r += textParseContext.getText();
						if (childNodes.length) {
							r += 'node.innerHTML = result.join("");\n';
						}
					}
					else {
						r += childrenString;
					}
				}
				function nodeType(xmlNode) {
					return xmlNode.nodeType();
				}
				function nodeValue(xmlNode) {
					return xmlNode.nodeValue();
				}
				if (!parentNode) {
					r += 'if (!document) {\ndocument = window.document;\n}\n';
					r += 'var nodes = [], node, att, txn, attachTemp, putValue, x, y, e = (fn.tst()?fn.e:fn.ae), a = fn.a, t = fn.t, av, result, v;\n';
					r += solveTagName(xmlNode, true, elementContext);
					r += 'nodes.push(node);\n';
					visitChildNodes();
					r += 'node = nodes.pop();\n';
					r += 'r.domNode = node;\n';
				} else {
					if (nodeType(xmlNode) === 1 /* Element */ ) {
						r += 'nodes.push(node);\n';
						r += solveTagName(xmlNode, false, elementContext);
						visitChildNodes();
						r += 'node = nodes.pop();\n';
					} else if (nodeType(xmlNode) === 2 /* Attribute */ ) {
						r += processAttributeAct(xmlNode, xmlNode.nodeName());
					} else if (nodeType(xmlNode) === 3 /* Text */ ) {
						r += 'txn = t(node, \'\', node.ownerDocument);\n';
						r += processTextAct(nodeValue(xmlNode), 'txn.nodeValue', 'text');
					}
				}

				return r;
			}
			var result,
				buildString,
				promise;
			//Do some processing
			buildString = '\'use strict\';\n';
			buildString += 'var fn, r = {};\n';
			buildString += 'fn = ' + objUtils.deepToString(functions) + ';\n';

			if (sync) {
				/* jshint evil: true */
				buildString += processDom();
				buildString += 'return r;\n';
				result = new Function(['context', 'document'], buildString);
			}
			else {
				promise = processDom();
				return def.when(promise, function(value) {
					/* jshint evil: true */
					var result;
					buildString += value;
					buildString += 'return r;\n';
					result = new Function(['context', 'document'], buildString);
					return result;
				});
			}
			return result;
		}
		function makePutValue(expression, inFunctionCall) {
			var r = '', cnt, t, arr;
			if (expression.contentType === 'identifier'){
				if (expression.content && expression.content.content) {
					r += makePutValue(expression.content);
				}
				else {
					arr = expression.content.split('.');
					if (inFunctionCall) {
						t = '';
						for (cnt = 0; cnt < arr.length; cnt += 1){
							if (cnt === arr.length - 1){
								t += 'y = x;\n';
							}
							t += 'x = x[\'' + arr[cnt] + '\'];\n';
						}
					}
					else {
						t = 'context';
						for (cnt = 0; cnt < arr.length; cnt += 1){
							t += '[\'' + arr[cnt] + '\']';
						}
					}
					r += t;
				}
			}
			else if (expression.contentType === 'functionCall'){
				r += solveFunctionCall(expression, inFunctionCall);
			}
			else if (expression.contentType === 'string'){
				r += '\'' + baseProcessor.safeFilter(expression.content) + '\'';
			}

			return r;
		}
		function processParsedResult(result, target, targetType, arr, idx, elementContext) {
			var r = '', cnt;
			if (result.type === 'mixed'){
				for (cnt=0; cnt < result.content.length; cnt += 1){
					r += processParsedResult(result.content[cnt], target, targetType, arr, idx, elementContext);
				}
			}
			else if (result.type === 'expressionToken'){
				r += processExpressionToken(result, target, targetType, elementContext);
			}
			else if (result.type === 'any'){
				r += target + ' += \'' + baseProcessor.safeFilter(result.content) + '\';\n';
			}
			else if (result.type === 'beginFor'){
				r += '(function(context) {\n';
				r += 'var arr, temp, cnt, ident;\n';
				r += 'ident = \'' + result.identifier + '\';\n';
				r += 'temp = context[ident];\n';
				r += 'arr = ' + makePutValue(result.value.value, false) + ' || [];\n';
				r += 'for (cnt=0;cnt < arr.length; cnt += 1) {\n';
				r += 'context[ident] = arr[cnt];\n';
			}
			else if (result.type === 'endFor'){
				r += '}\n';
				r += 'context[ident] = temp;\n';
				r += '}).call(this, context);\n';
			}
			return r;
		}
		function processExpression(expression, target, targetType, elementContext) {
			var optimized = expression.optimized || ['String', 'DOM', '9js', 'Dijit'];
			function putValue(targetType) {
				var r = '', cnt;
				function optimizerSort(a, b) {
					var map = { '9js': 1, 'Dijit': 2, 'DOM': 3, 'String' : 4};
					return (map[a] || 4) - (map[b] || 4);
				}
				function testPut(opType) {
					if (opType === 'String') {
						r += 'if (putValue) {\n';
					}
					else if (opType === 'DOM') {
						r += 'if (putValue.tagName) {\n';
					}
					else if (opType === 'Dijit') {
						r += 'if (putValue.domNode) {\n';
					}
					else if (opType === '9js') {
						r += 'if (putValue["$njsWidget"]) {\n';
					}
				}
				function processPut(opType) {
					if (opType === 'String') {
						r += target + ' += ' + 'putValue;\n';
					}
					else if (opType === 'DOM') {
						r += 'node.appendChild(putValue);\ntxn = t(node, \'\', node.ownerDocument);\n';
					}
					else if (opType === '9js') {
						r += 'putValue.show(node);\n';
					}
					else if (opType === 'Dijit') {
						r += 'node.appendChild(putValue.domNode);\n';
					}
				}
				if (targetType === 'attr'){
					r += target + ' += putValue || "";\n';
				}
				else if (targetType === 'text'){
					if (optimized.length > 1) {
						elementContext.needsDom = true;
						r += 'if (putValue) {\n';
						optimized = optimized.sort(optimizerSort);
						for (cnt = 0; cnt < optimized.length; cnt += 1) {
							if (cnt > 0) {
								r += 'else ';
							}
							testPut(optimized[cnt]);
							processPut(optimized[cnt]);
							r += '}\n';
						}
						r += '}\n';
					}
					else {
						if (optimized[0] !== 'String') {//Only String optimizers are elegible for an innerHTML solution
							elementContext.needsDom = true;
						}
						processPut(optimized[0]);
					}
				}
				return r;
			}
			var r = '';
			if (expression.contentType === 'identifier'){
				var putValueText = 'putValue = ' + makePutValue(expression) + ';\n';
				r += putValueText;
				r += putValue(targetType);
			}
			else if (expression.contentType === 'functionCall') {
				var putValueText = 'putValue = ' + makePutValue(expression) + ';\n';
				r += putValueText;
				r += putValue(targetType);
			}
			else {
				console.log('unsupported expression content type: ');
				console.log(expression);
			}
			return r;
		}
		function processLiveExpression(/*expression, target, targetType, elementContext*/) {
			return processExpression.apply(null, arguments);
		}
		function processTextFragment(content, target, targetType, arr, idx, elementContext) {
			var r = '';
			content = baseProcessor.trim(content);
			if (content) {
				var parseResult = parser.parse(content);
				r = processParsedResult(parseResult, target, targetType, arr, idx, elementContext);
			}
			return r;
		}
		/**
		Tells whether a given class attribute is representing an attach point
		@param {Object|Array|Function|String} obj - the object to be represented
		*/
		function isAttachPoint(xmlNode) {
			return (/^data-(ninejs-attach|dojo-attach-point)$/).test(xmlNode.nodeName());
		}
		function processAttachPoint(xmlNode) {
			return 'attachTemp = r[\'' + xmlNode.value() + '\'];\nif (attachTemp) {\nif ( Object.prototype.toString.call( attachTemp ) === \'[object Array]\' ) {\nattachTemp.push(node);\n}\nelse {\nr[\'' + xmlNode.value() + '\'] = [attachTemp, node];\n}\n}\nelse {\nr[\'' + xmlNode.value() + '\'] = node;\n}\n';
		}
		function processExpressionToken(result, target, targetType, elementContext) {
			var r = '';
			if (result.modifier === 'live') {//No me voy, me quedo aqui... 
				if (result.value.type === 'expression'){
					r += processLiveExpression(result.value, target, targetType, elementContext);
				}
				else {
					console.log('unsupported expression token type: ');
					console.log(result.value);
				}
			}
			else {
				if (result.value.type === 'expression'){
					r += processExpression(result.value, target, targetType, elementContext);
				}
				else {
					console.log('unsupported expression token type: ');
					console.log(result.value);
				}
			}
			return r;
		}
		function solveFunctionCall(expression, inFunctionCall){
			var r = '';
			var arr = expression['arguments'];
			var cnt;
			var functionArgs = [];
			for (cnt=0; cnt < arr.length; cnt += 1){
				functionArgs.push(makePutValue(arr[cnt]));
			}
			if (inFunctionCall) {
				r += makePutValue(expression.content, true);
				r += 'y = x;\nx = x.apply(y, [' + functionArgs.join(', ') + ']);\n';
			}
			else {
				r += 'null;\nx = context;\n';
				r += 'y = context;\n';
				r += makePutValue(expression.content, true) + 'y = x;\nputValue = x.apply(y, [' + functionArgs.join(', ') + ']);\n';
			}
			return r;
		}
		function solveTagName(xmlNode, isRoot, elementContext) {
			var	r = '';
			if (xmlNode.hasVariableTagName()) {
				r += xmlNode.getVariableTagName(function(val) {
					return processTextFragment(val, 'x', 'attr', null, null, elementContext);
				});
				if (isRoot) {
					r += 'node = document.createElement(putValue || \'' + xmlNode.nodeName() + '\');\n';
				}
				else {
					r += 'node = e(node, putValue || \'' + xmlNode.nodeName() + '\', node.ownerDocument);\n';
				}
			}
			else {
				if (isRoot) {
					r += 'node = document.createElement(\'' + xmlNode.nodeName() + '\');\n';
				}
				else {
					r += 'node = e(node, \'' + xmlNode.nodeName() + '\', node.ownerDocument);\n';
				}
			}
			return r;
		}
		function processAttribute(xmlNode, attName, elementContext) {
			var r = '';
			if (isAttachPoint(xmlNode) || attName === 'data-ninejs-tagName') {
				elementContext.needsDom = true;
				r += processAttachPoint(xmlNode);
			} else {
				r += 'av = \'\';\n';
				r += processTextFragment(xmlNode.value(), 'av', 'attr', null, null, elementContext);
				if (attName === 'class') {
					r += 'node.className = av;\n';
				}
				else {
					r += 'node.setAttribute(\'' + attName + '\', av);\n';
				}
			}
			return r;
		}
		/**
		nineplate's template DOM processor
		@exports domProcessor
		*/
		var domProcessor = {
			compileDom: compileDom
		};
		return domProcessor;
	}

	if (isAmd) { //AMD
		//Trying for RequireJS and hopefully every other (Assuming text module is in 'text/text' btw)
		define(['./utils/functions', './utils/parser/amd', '../core/deferredUtils', './BaseProcessor', '../core/objUtils', './renderers/javascript'], moduleExport);
	} else if (isNode) { //Server side
		module.exports = moduleExport(req('./utils/functions'), req('./utils/parser/commonjs'), req('../core/deferredUtils'), req('./BaseProcessor'), req('../core/objUtils'), req('./renderers/javascript'));
	} else {
		// plain script in a browser
		throw new Error('Non AMD environments are not supported');
	}
})();