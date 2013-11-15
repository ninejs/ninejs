/** 
@module ninejs/nineplate/BaseProcessor 
@author Eduardo Burgos <eburgos@gmail.com>
*/
(function() {
	'use strict';
	var isAmd = (typeof(define) !== 'undefined') && define.amd;
	var isDojo = isAmd && define.amd.vendor === 'dojotoolkit.org';
	var isNode = (typeof(window) === 'undefined');
	var req = (isDojo && isNode)? global.require : require;
	function moduleExport(functions, parser, deferredUtils, TextProcessor) {
		/**
		@class DomProcessor
		@classdesc nineplate's template DOM processor
		*/
		var DomProcessor = TextProcessor.extend({
			compileDom: function(template, sync, options) {
				/* jshint evil: true */
				var result,
					buildString,
					promise,
					p;
				for (var p in options) {
					if (options.hasOwnProperty(p)) {
						this[p] = options[p];
					}
				}
				//Do some processing
				buildString = '\'use strict\';\n';
				buildString += 'var fn, r = {};\n';
				buildString += 'fn = ' + this.deepToString(functions) + ';\n';

				if (sync) {
					buildString += this.processDom(template, true);
					buildString += 'return r;\n';
					result = new Function(['context', 'document'], buildString);
				}
				else {
					promise = this.processDom(template, false);
					return deferredUtils.when(promise, function(value) {
						var result;
						buildString += value;
						buildString += 'return r;\n';
						result = new Function(['context', 'document'], buildString);
						return result;
					});
				}
				return result;
			},
			processDom: function(text, sync) {
				var parsedXml = this.getParsedXml(text, sync),
					self = this,
					XmlNode = this.XmlNode;
				if (isNode && !sync) {
					return deferredUtils.when(parsedXml, function(value) {
						return self.processParsedXml(new XmlNode(value), null, {});
					});
				}
				else {
					if (isNode) {
						return this.processParsedXml(new XmlNode(parsedXml), null, {});
					}
					else {
						return this.processParsedXml(new XmlNode(parsedXml.documentElement), null, {});
					}
				}
			},
			solveTagName: function(xmlNode, isRoot, elementContext) {
				var self,
					r = '';
				if (xmlNode.hasVariableTagName()) {
					self = this;
					r += xmlNode.getVariableTagName(function(val) {
						return self.processTextFragment(val, 'x', 'attr', null, null, elementContext);
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
			},
			processParsedXml: function(xmlNode, parentNode, elementContext) {
				var r = '',
					childrenString = '',
					cnt,
					attributes,
					childNodes,
					act,
					nodeAct,
					processAttributeAct,
					processTextAct,
					TextParseContext,
					textParseContext,
					visitChildNodes;
				act = function(callback) {
					var tempCtx = {},
						r;
					r = callback.call(this, tempCtx);
					if (tempCtx.needsDom) {
						elementContext.needsDom = true;
					}
					return r;
				};
				nodeAct = function(xmlNode, parentXmlNode) {
					return act.call(this, function(tempCtx) {
						return this.processParsedXml(xmlNode, parentXmlNode, tempCtx);
					});
				};
				processAttributeAct = function(xmlNode, nodeName) {
					return act.call(this, function(tempCtx) {
						return this.processAttribute(xmlNode, nodeName, tempCtx);
					});
				};
				processTextAct = function(nodeValue, target, targetType) {
					return act.call(this, function(tempCtx) {
						return this.processTextFragment(nodeValue, target, targetType, null, null, tempCtx);
					});
				};
				visitChildNodes = function() {
					attributes = xmlNode.getAttributes();
					for (cnt = 0; cnt < attributes.length; cnt += 1) {
						childrenString += nodeAct.call(this, attributes[cnt], xmlNode);
					}
					childNodes = xmlNode.getChildNodes();
					for (cnt = 0; cnt < childNodes.length; cnt += 1) {
						childrenString += nodeAct.call(this, childNodes[cnt], xmlNode);
					}
					if (!elementContext.needsDom && !this.ignoreHtmlOptimization) { //Taking the innerHTML route instead
						TextParseContext = this.TextParseContext;
						textParseContext = new TextParseContext();
						for (cnt = 0; cnt < childNodes.length; cnt += 1) {
							TextProcessor.prototype.processParsedXml.call(this, childNodes[cnt].node, textParseContext);
						}
						textParseContext.appendLine();
						r += 'result = [];\n';
						childrenString = '';
						attributes = xmlNode.getAttributes();
						for (cnt = 0; cnt < attributes.length; cnt += 1) {
							childrenString += nodeAct.call(this, attributes[cnt], xmlNode);
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
				};
				if (!parentNode) {
					r += 'if (!document) {\ndocument = window.document;\n}\n';
					r += 'var nodes = [], node, att, txn, attachTemp, putValue, x, y, e = (fn.tst()?fn.e:fn.ae), a = fn.a, t = fn.t, av, result, v;\n';
					r += this.solveTagName(xmlNode, true, elementContext);
					r += 'nodes.push(node);\n';
					visitChildNodes.call(this);
					r += 'node = nodes.pop();\n';
					r += 'r.domNode = node;\n';
				} else {
					if (xmlNode.nodeType() === 1 /* Element */ ) {
						r += 'nodes.push(node);\n';
						r += this.solveTagName(xmlNode, false, elementContext);
						visitChildNodes.call(this);
						r += 'node = nodes.pop();\n';
					} else if (xmlNode.nodeType() === 2 /* Attribute */ ) {
						r += processAttributeAct.call(this, xmlNode, xmlNode.nodeName());
					} else if (xmlNode.nodeType() === 3 /* Text */ ) {
						r += 'txn = t(node, \'\', node.ownerDocument);\n';
						r += processTextAct.call(this, xmlNode.nodeValue(), 'txn.nodeValue', 'text');
					}
				}

				return r;
			},
			/**
			returns the string representation of an object regardless of it's type
			@param {Object|Array|Function|String} obj - the object to be represented
			*/
			deepToString: function(obj) {
				/**
				strips out the function name after 'function '
				@param {String} fstring - the function as a string
				*/
				function stripFunctionName(fstring) {
					var idx = fstring.indexOf('(');
					if (idx > 9) {
						fstring = fstring.substr(0, 9) + fstring.substr(idx);
					}
					return fstring;
				}
				/**
				Iterates over an array to have the string representation of each element
				@param {Array} obj - the array
				*/
				function resolveArray(obj, self) {
					var result;
					result = '[';
					for (idx = 0; idx < obj.length; idx += 1) {
						if (idx > 0) {
							result += ',';
						}
						result += self.deepToString(obj[idx]);
					}
					result += ']';
					return result;
				}

				var result = 'null',
					o, idx;
				if (obj) {
					if (obj instanceof Array) {
						result = resolveArray(obj, this);
					} else if (typeof(obj) === 'string') {
						result = '\'' + obj.toString() + '\'';
					} else if (typeof(obj) === 'function') {
						result = stripFunctionName(obj.toString());
					} else if (obj instanceof Object) {
						result = '{';
						idx = 0;
						for (o in obj) {
							if (obj.hasOwnProperty(o)) {
								if (idx > 0) {
									result += ',';
								}
								result += o + ':' + this.deepToString(obj[o]);
								idx += 1;
							}
						}
						result += '}';
					} else {
						result = obj.toString();
					}
				}
				return result;
			},
			processAttribute: function(xmlNode, attName, elementContext) {
				var r = '';
				if (this.isAttachPoint(xmlNode) || attName === 'data-ninejs-tagName') {
					elementContext.needsDom = true;
					r += this.processAttachPoint(xmlNode);
				} else {
					r += 'av = \'\';\n';
					r += this.processTextFragment(xmlNode.value(), 'av', 'attr', null, null, elementContext);
					if (attName === 'class') {
						r += 'node.className = av;\n';
					}
					else {
						r += 'node.setAttribute(\'' + attName + '\', av);\n';
					}
				}
				return r;
			},
			/**
			Tells whether a given class attribute is representing an attach point
			@param {Object|Array|Function|String} obj - the object to be represented
			*/
			isAttachPoint: function(xmlNode) {
				return (/^data-(ninejs-attach|dojo-attach-point)$/).test(xmlNode.nodeName());
			},
			/**
			Tells whether a given class attribute is representing an attach point
			@param {Object|Array|Function|String} obj - the object to be represented
			*/
			processAttachPoint: function(xmlNode) {
				return 'attachTemp = r[\'' + xmlNode.value() + '\'];\nif (attachTemp) {\nif ( Object.prototype.toString.call( attachTemp ) === \'[object Array]\' ) {\nattachTemp.push(node);\n}\nelse {\nr[\'' + xmlNode.value() + '\'] = [attachTemp, node];\n}\n}\nelse {\nr[\'' + xmlNode.value() + '\'] = node;\n}\n';
			},
			solveFunctionCall: function(expression, inFunctionCall){
				var r = '';
				var arr = expression['arguments'];
				var cnt;
				var functionArgs = [];
				for (cnt=0; cnt < arr.length; cnt += 1){
					functionArgs.push(this.makePutValue(arr[cnt]));
				}
				if (inFunctionCall) {
					r += this.makePutValue(expression.content, true);
					r += 'y = x;\nx = x.apply(y, [' + functionArgs.join(', ') + ']);\n';
				}
				else {
					r += 'null;\nx = context;\n';
					r += 'y = context;\n';
					r += this.makePutValue(expression.content, true) + 'y = x;\nputValue = x.apply(y, [' + functionArgs.join(', ') + ']);\n';
				}
				return r;
			},
			makePutValue: function(expression, inFunctionCall) {
				var r = '', cnt, t, arr;
				if (expression.contentType === 'identifier'){
					if (expression.content && expression.content.content) {
						r += this.makePutValue(expression.content);
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
					r += this.solveFunctionCall(expression, inFunctionCall);
				}
				else if (expression.contentType === 'string'){
					r += '\'' + this.safeFilter(expression.content) + '\'';
				}

				return r;
			},
			processExpression: function(expression, target, targetType, elementContext) {
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
					var putValueText = 'putValue = ' + this.makePutValue(expression) + ';\n';
					r += putValueText;
					r += putValue(targetType);
				}
				else if (expression.contentType === 'functionCall') {
					var putValueText = 'putValue = ' + this.makePutValue(expression) + ';\n';
					r += putValueText;
					r += putValue(targetType);
				}
				else {
					console.log('unsupported expression content type: ');
					console.log(expression);
				}
				return r;
			},
			processLiveExpression: function(/*expression, target, targetType, elementContext*/) {
				return this.processExpression.apply(this, arguments);
			},
			processExpressionToken: function(result, target, targetType, elementContext) {
				var r = '';
				if (result.modifier === 'live') {//No me voy, me quedo aqui... 
					if (result.value.type === 'expression'){
						r += this.processLiveExpression(result.value, target, targetType, elementContext);
					}
					else {
						console.log('unsupported expression token type: ');
						console.log(result.value);
					}
				}
				else {
					if (result.value.type === 'expression'){
						r += this.processExpression(result.value, target, targetType, elementContext);
					}
					else {
						console.log('unsupported expression token type: ');
						console.log(result.value);
					}
				}
				return r;
			},
			processParsedResult: function(result, target, targetType, arr, idx, elementContext) {
				var r = '', cnt;
				if (result.type === 'mixed'){
					for (cnt=0; cnt < result.content.length; cnt += 1){
						r += this.processParsedResult(result.content[cnt], target, targetType, arr, idx, elementContext);
					}
				}
				else if (result.type === 'expressionToken'){
					r += this.processExpressionToken(result, target, targetType, elementContext);
				}
				else if (result.type === 'any'){
					r += target + ' += \'' + this.safeFilter(result.content) + '\';\n';
				}
				else if (result.type === 'beginFor'){
					r += '(function(context) {\n';
					r += 'var arr, temp, cnt, ident;\n';
					r += 'ident = \'' + result.identifier + '\';\n';
					r += 'temp = context[ident];\n';
					r += 'arr = ' + this.makePutValue(result.value.value, false) + ' || [];\n';
					r += 'for (cnt=0;cnt < arr.length; cnt += 1) {\n';
					r += 'context[ident] = arr[cnt];\n';
				}
				else if (result.type === 'endFor'){
					r += '}\n';
					r += 'context[ident] = temp;\n';
					r += '}).call(this, context);\n';
				}
				return r;
			},
			processTextFragment: function(content, target, targetType, arr, idx, elementContext) {
				var r = '';
				content = this.trim(content);
				if (content) {
					var parseResult = parser.parse(content);
					r = this.processParsedResult(parseResult, target, targetType, arr, idx, elementContext);
				}
				return r;
			}
		});
		return DomProcessor;
	}

	if (isAmd) { //AMD
		//Testing for dojo toolkit
		if (isDojo) {
			define(['./utils/functions', './utils/parser/amd', '../core/deferredUtils', './TextProcessor'], moduleExport);
		} else {
			//Trying for RequireJS and hopefully every other (Assuming text module is in 'text/text' btw)
			define(['./utils/functions', './utils/parser/amd', '../core/deferredUtils', './TextProcessor'], moduleExport);
		}
	} else if (isNode) { //Server side
		var functions = req('./utils/functions'),
			parser = req('./utils/parser/commonjs'),
			deferredUtils = req('../core/deferredUtils'),
			TextProcessor = req('./TextProcessor');
		module.exports = moduleExport(functions, parser, deferredUtils, TextProcessor);
	} else {
		// plain script in a browser
		throw new Error('Non AMD environments are not supported');
	}
})();