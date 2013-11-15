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
	function moduleExport(parser, extend, deferredUtils, BaseProcessor) {

		var TextParseContext = extend({
			append: function(line) {
				this.appendLine();
				this.r.push(line);
			},
			appendLine: function() {
				if (this.lineBuffer.length) {
					this.r.push('result.push(\'' + this.lineBuffer.join('') + '\');\n');
					this.lineBuffer = [];
				}
			},
			getText: function() {
				return this.r.join('');
			}
		}, function() {
			this.r = [];
			this.lineBuffer = [];
		});

		var TextProcessor = BaseProcessor.extend({
			TextParseContext: TextParseContext,
			compileText: function(template, sync) {
				/* jshint evil: true */
				var result, buildString, promise;
				//Do some processing
				buildString = '\'use strict\';\n';
				buildString += 'var result = [], v, x, y;\n';
				if (isNode && !sync) {
					promise = this.processText(template, sync);
					return deferredUtils.when(promise, function(value){
						var result;
						buildString += value;
						buildString += 'return result.join(\'\');\n';
						result = new Function(['context'], buildString);
						return result;
					});
				}
				else {
					if (sync) {
						buildString += this.processText(template, true);
						buildString += 'return result.join(\'\');\n';
						result = new Function(['context'], buildString);
					}
					else {
						promise = this.processText(template, false);
						return promise.then(function(value) {
							var result;
							buildString += value;
							buildString += 'return result.join(\'\');\n';
							result = new Function(['context'], buildString);
							return result;
						});
					}
				}
				return result;
			},
			processText: function(text, sync) {
				var parsedXml = this.getParsedXml(text, sync),
					self = this,
					parseContext = new TextParseContext();
				if (isNode && !sync) {
					return deferredUtils.when(parsedXml, function(value) {
						self.processParsedXml(value, parseContext);
						parseContext.appendLine();
						return parseContext.getText();
					});
				}
				else {
					if (isNode) {
						this.processParsedXml(parsedXml, parseContext);
						parseContext.appendLine();
						return parseContext.getText();
					}
					else {
						this.processParsedXml(parsedXml.documentElement, parseContext);
						parseContext.appendLine();
						return parseContext.getText();
					}
				}
			},
			processParsedXml: function(xmlNode, parseContext) {
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
						return xmlNode.namespaces.map(function(item) {
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
				var processElement = function() {
					var nsList;
					parseContext.lineBuffer.push('<' + nodeName(xmlNode));
					nsList = namespaces(xmlNode);
					attributes = getAttributes(xmlNode);
					if (nsList || attributes.length) {
						parseContext.lineBuffer.push(' ');
					}
					if (nsList) {
						parseContext.lineBuffer.push(this.safeFilter(nsList));
						if (attributes.length) {
							parseContext.lineBuffer.push(' ');
						}
					}
					for (cnt = 0; cnt < attributes.length; cnt += 1) {
						if (cnt > 0) {
							parseContext.lineBuffer.push(' ');
						}
						TextProcessor.prototype.processParsedXml.call(this, attributes[cnt], parseContext);
					}
					childNodes = getChildNodes(xmlNode);
					if (childNodes.length || ((nodeName(xmlNode) === 'script') && (!namespaceUri(xmlNode)))) {
						parseContext.lineBuffer.push('>');
						for (cnt = 0; cnt < childNodes.length; cnt += 1) {
							TextProcessor.prototype.processParsedXml.call(this, childNodes[cnt], parseContext);
						}
						parseContext.lineBuffer.push('</' + nodeName(xmlNode) + '>');
					}
					else {
						parseContext.lineBuffer.push(' />');
					}
				};
				var attributes, cnt, childNodes;
				if (xmlNode.nodeType === 1 /* Element */ ) {
					processElement.call(this);
				} else if (xmlNode.nodeType === 2 /* Attribute */ ) {
					parseContext.lineBuffer.push(nodeName(xmlNode) + this.safeFilter('=\''));
					TextProcessor.prototype.processTextFragment.call(this, this.trim(xmlNode.value), parseContext);
					parseContext.lineBuffer.push(this.safeFilter('\''));
				} else if (xmlNode.nodeType === 3 /* Text */ ) {
					TextProcessor.prototype.processTextFragment.call(this, this.trim(xmlNode.nodeValue), parseContext);
				} else if ((xmlNode.nodeType === 4 /* Comment */) && (!parseContext.ignoreComments)) {
					this.processComment(xmlNode.nodeValue, parseContext);
				}
				return parseContext;
			},
			processComment: function(content, parseContext) {
				parseContext.lineBuffer.push('<!--');
				this.processTextFragment(content, parseContext);
				parseContext.lineBuffer.push('-->');
			},
			processTextFragment: function(content, parseContext) {
				if (content) {
					try {
						var parseResult = parser.parse(content);
						TextProcessor.prototype.processParsedResult.call(this, parseResult, parseContext);
					} catch (error) {
						console.log(error);
						throw new Error(error);
					}
				}
			},
			processParsedResult: function(result, parseContext) {
				var cnt;
				if (result.type === 'mixed'){
					for (cnt=0; cnt < result.content.length; cnt += 1){
						TextProcessor.prototype.processParsedResult.call(this, result.content[cnt], parseContext);
					}
				}
				else if (result.type === 'expressionToken'){
					TextProcessor.prototype.processExpressionToken.call(this, result, parseContext);
				}
				else if (result.type === 'any'){
					parseContext.lineBuffer.push(this.safeFilter(result.content));
				}
				else if (result.type === 'beginFor'){
					parseContext.appendLine();
					parseContext.append('(function(context) {\n');
					parseContext.append('var arr, temp, cnt, ident;\n');
					parseContext.append('ident = \'' + result.identifier + '\';\n');
					parseContext.append('temp = context[ident];\n');
					parseContext.append('arr = ' + TextProcessor.prototype.makePutValue.call(this, result.value.value, false, parseContext) + ' || [];\n');
					parseContext.append('for (cnt=0;cnt < arr.length; cnt += 1) {\n');
					parseContext.append('context[ident] = arr[cnt];\n');
				}
				else if (result.type === 'endFor'){
					parseContext.appendLine();
					parseContext.append('}\n');
					parseContext.append('context[ident] = temp;\n');
					parseContext.append('}).call(this, context);\n');
				}
			},
			processExpressionToken: function(result, parseContext) {
				if (result.value.type === 'expression'){
					TextProcessor.prototype.processExpression.call(this, result.value, parseContext);
				}
				else {
					console.log('unsupported expression token type: ');
					console.log(result.value);
				}
			},
			processExpression: function(expression, parseContext) {
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
				if (expression.contentType === 'identifier'){
					var putValueText = 'v = ' + TextProcessor.prototype.makePutValue.call(this, expression, false, parseContext) + ';\n';
					parseContext.append(putValueText);
					putValue();
				}
				else if (expression.contentType === 'functionCall') {
					var putValueText = 'v = ' + TextProcessor.prototype.makePutValue.call(this, expression, false, parseContext) + ';\n';
					parseContext.append(putValueText);
					putValue();
				}
				else {
					console.log('unsupported expression content type: ');
					console.log(expression);
				}
			},
			makePutValue: function(expression, inFunctionCall, parseContext) {
				function quoteSafe(identifier) {
					return '[\'' + identifier + '\']';
				}
				var cnt, t, arr;
				if (expression.contentType === 'identifier'){
					if (expression.content && expression.content.content) {
						return TextProcessor.prototype.makePutValue.call(this, expression.content, false, parseContext);
					}
					else {
						arr = expression.content.split('.');
						if (inFunctionCall) {
							arr.splice(arr.length - 1, 1);
						}
						t = 'context';
						for (cnt = 0; cnt < arr.length; cnt += 1){
							t += quoteSafe(arr[cnt]);
						}
						return t;
					}
				}
				else if (expression.contentType === 'functionCall'){
					return TextProcessor.prototype.solveFunctionCall.call(this, expression, parseContext);
				}
				else if (expression.contentType === 'string'){
					return '\'' + this.safeFilter(expression.content) + '\'';
				}
			},
			solveFunctionCall: function(expression, parseContext){
				var arr = expression['arguments'];
				var cnt;
				var functionArgs = [];
				for (cnt=0; cnt < arr.length; cnt += 1){
					functionArgs.push(TextProcessor.prototype.makePutValue.call(this, arr[cnt], false, parseContext));
				}
				return TextProcessor.prototype.makePutValue.call(this, expression.content, false, parseContext) + '(' + functionArgs.join(', ') + ')';
			}
		});

		return TextProcessor;
	}

	if (isAmd) { //AMD
		//Testing for dojo toolkit
		if (isDojo) {
			define(['./utils/parser/amd', '../core/extend', '../core/deferredUtils', './BaseProcessor'], moduleExport);
		} else {
			//Trying for RequireJS and hopefully every other (Assuming text module is in 'text/text' btw)
			define(['./utils/parser/amd', '../core/extend', '../core/deferredUtils', './BaseProcessor'], moduleExport);
		}
	} else if (isNode) { //Server side
		var parser, extend, deferredUtils, BaseProcessor;
		parser = req('./utils/parser/commonjs');
		extend = req('../core/extend');
		deferredUtils = req('../core/deferredUtils');
		BaseProcessor = req('./BaseProcessor');
		module.exports = moduleExport(parser, extend, deferredUtils, BaseProcessor);
	} else {
		// plain script in a browser
		throw new Error('Non AMD environments are not supported');
	}
})();