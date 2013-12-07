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
	function moduleExport(functions, parser, def, baseProcessor, objUtils, Renderer) {
		/**
		Takes a template object and transforms it into a function that renders that xml (or html)
		@param {string} template - XML text that we want to be compiled.
		@param {bool} sync - Tells wether or not the compilation is evented (Node.js) or synchronous (The template is compiled as soon as it returns).
		@param {Object} options - Options object used to modify the compilers behavior.
		*/
		function compileDom(template, sync, options) {
			var renderer = new Renderer(true);
			renderer
				.addGlobal('window')
				.addGlobal('Object')
				.addGlobal('Array');
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
				var cnt,
					attributes,
					childNodes,
					TextParseContext,
					textParseContext;
				function act(callback) {
					var tempCtx = {};
					callback.call(null, tempCtx);
					if (tempCtx.needsDom) {
						elementContext.needsDom = true;
					}
				}
				function nodeAct(xmlNode, parentXmlNode) {
					act.call(null, function(tempCtx) {
						processParsedXml(xmlNode, parentXmlNode, tempCtx);
					});
				}
				function processAttributeAct(xmlNode, nodeName) {
					act.call(null, function(tempCtx) {
						processAttribute(xmlNode, nodeName, tempCtx);
					});
				}
				function processTextAct(nodeValue, target, targetType) {
					act.call(null, function(tempCtx) {
						processTextFragment(nodeValue, target, targetType, null, null, tempCtx);
					});
				}
				function visitChildNodes() {
					attributes = xmlNode.getAttributes();
					for (cnt = 0; cnt < attributes.length; cnt += 1) {
						nodeAct(attributes[cnt], xmlNode);
					}
					childNodes = xmlNode.getChildNodes();
					for (cnt = 0; cnt < childNodes.length; cnt += 1) {
						nodeAct(childNodes[cnt], xmlNode);
					}
					if (!elementContext.needsDom && !options.ignoreHtmlOptimization) { //Taking the innerHTML route instead
						TextParseContext = baseProcessor.TextParseContext;
						textParseContext = new TextParseContext();
						for (cnt = 0; cnt < childNodes.length; cnt += 1) {
							processParsedXml(childNodes[cnt], xmlNode, elementContext);
						}
						textParseContext.appendLine();
						renderer.addAssignment('result', renderer.literal([]));
						
						attributes = xmlNode.getAttributes();
						for (cnt = 0; cnt < attributes.length; cnt += 1) {
							nodeAct(attributes[cnt], xmlNode);
						}
						//r += childrenString;
						//r += textParseContext.getText();
						if (childNodes.length) {
							renderer
								.addAssignment(
									renderer
										.expression('node')
										.member('innerHTML'),
									renderer
										.expression('result')
										.member('join')
										.invoke(
											renderer.literal('')
										)
									);
						}
					}
					// else {
					// 	r += childrenString;
					// }
				}
				function nodeType(xmlNode) {
					return xmlNode.nodeType();
				}
				function nodeValue(xmlNode) {
					return xmlNode.nodeValue();
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
						.addVar('y')
						.addVar('e', '(' + renderer.varName('fn') + '.tst()?' + renderer.varName('fn') + '.e:' + renderer.varName('fn') + '.ae)')
						.addVar('a', renderer.varName('fn') + '.a')
						.addVar('t', renderer.varName('fn') + '.t')
						.addVar('av')
						.addVar('result')
						.addVar('v');
					solveTagName(xmlNode, true, elementContext);
					renderer
						.addStatement(renderer.expression('nodes').member('push').invoke(renderer.expression('node')));
					visitChildNodes();
					renderer.addAssignment('node', renderer.expression('nodes').member('pop').invoke());
					renderer.addAssignment(renderer.expression('r').member('domNode'), renderer.expression('node'));
				} else {
					if (nodeType(xmlNode) === 1 /* Element */ ) {
						renderer
							.addStatement(renderer.expression('nodes').member('push').invoke(renderer.expression('node')));
						solveTagName(xmlNode, false, elementContext);
						visitChildNodes();
						renderer.addAssignment('node', renderer.expression('nodes').member('pop').invoke());
					} else if (nodeType(xmlNode) === 2 /* Attribute */ ) {
						processAttributeAct(xmlNode, xmlNode.nodeName());
					} else if (nodeType(xmlNode) === 3 /* Text */ ) {
						renderer.addAssignment('txn', renderer.expression('t').invoke('node', renderer.literal(''), renderer.expression('node').member('ownerDocument')));
						processTextAct(nodeValue(xmlNode), renderer.expression('txn').member('nodeValue'), 'text');
					}
				}
			}
			var forLoopStack = [];
			function processParsedResult(result, target, targetType, arr, idx, elementContext) {
				var cnt,
					fName;
				if (result.type === 'mixed'){
					for (cnt=0; cnt < result.content.length; cnt += 1){
						processParsedResult(result.content[cnt], target, targetType, arr, idx, elementContext);
					}
				}
				else if (result.type === 'expressionToken'){
					processExpressionToken(result, target, targetType, elementContext);
				}
				else if (result.type === 'any'){
					renderer
						.addAssignment(
							target,
							target.op('+', renderer.literal(baseProcessor.safeFilter(result.content)))
						);
//					r += target + ' += \'' + baseProcessor.safeFilter(result.content) + '\';\n';
				}
				else if (result.type === 'beginFor'){
					fName = renderer.getNewVariable();
					forLoopStack.push(fName);
					renderer = renderer.innerFunction(fName);
					renderer
						.addParameter('context')
						.addVar('arr')
						.addVar('temp')
						.addVar('cnt')
						.addVar('ident', renderer.literal(result.identifier));
					renderer
						.addAssignment(
							'temp',
							renderer.expression('context').element('ident')
						);
					renderer
						.addAssignment(
							'arr',
							makePutValue(result.value.value, false)
								.or(
									renderer.literal([])
								)
						);
					//r += '(function(context) {\n';
					// r += 'var arr, temp, cnt, ident;\n';
					// r += 'ident = \'' + result.identifier + '\';\n';
					//r += 'temp = context[ident];\n';
					//r += 'arr = ' + makePutValue(result.value.value, false) + ' || [];\n';
					renderer = renderer
								.addFor(
									renderer.newAssignment('cnt', renderer.literal(0)),
									renderer.expression('cnt')
										.lessThan(renderer.expression('arr').member('length')),
									renderer.newAssignment('cnt', renderer.expression('cnt').plus(renderer.literal(1)))
								);
					renderer.addAssignment(renderer.expression('context').element(renderer.expression('ident')), renderer.expression('arr').element(renderer.expression('cnt')));
//					r += 'for (cnt=0;cnt < arr.length; cnt += 1) {\n';
//					r += 'context[ident] = arr[cnt];\n';
				}
				else if (result.type === 'endFor'){
					renderer = renderer.getParentRenderer();
					renderer
						.addAssignment(
							renderer
								.expression('context').member(renderer.expression('ident')),
							renderer.expression('temp')
						);
					renderer = renderer.getParentRenderer();
					fName = forLoopStack.pop();
					renderer
						.addStatement(
							renderer
								.expression(fName)
								.member('call')
								.invoke(
									renderer.expression('this'),
									renderer.expression('context')
								)
							);
//					r += '}\n';
//					r += 'context[ident] = temp;\n';
//					r += '}).call(this, context);\n';
				}
			}
			function processTextFragment(content, target, targetType, arr, idx, elementContext) {
				content = baseProcessor.trim(content);
				if (content) {
					var parseResult = parser.parse(content);
					processParsedResult(parseResult, target, targetType, arr, idx, elementContext);
				}
			}
			//MUST RETURN Renderer::Expression
			function makePutValue(expression, inFunctionCall) {
				var exp,
					cnt,
					arr;
				if (expression.contentType === 'identifier'){
					if (expression.content && expression.content.content) {
						return makePutValue(expression.content);
					}
					else {
						arr = expression.content.split('.');
						if (inFunctionCall) {
							exp = renderer.expression('x');
							for (cnt = 0; cnt < arr.length - 1; cnt += 1){
								exp = exp.element(renderer.literal(arr[cnt]));
								// if (cnt === arr.length - 1){
								// 	t += 'y = x;\n';
								// }
								// t += 'x = x[\'' + arr[cnt] + '\'];\n';
							}
							if (arr.length > 1) {
								exp = renderer.newAssignment('y', exp).member(arr[arr.length-1]);
							}
						}
						else {
							exp = renderer.expression('context');
							for (cnt = 0; cnt < arr.length; cnt += 1){
								exp = exp.element(renderer.literal(arr[cnt]));
							}
						}
						return exp;
					}
				}
				else if (expression.contentType === 'functionCall'){
					return solveFunctionCall(expression, inFunctionCall);
				}
				else if (expression.contentType === 'string'){
					return renderer.literal(baseProcessor.safeFilter(expression.content));
				}
				else {
					throw new Error('unsupported content type ' + expression.contentType);
				}
			}
			function processExpression(expression, target, targetType, elementContext) {
				var optimized = expression.optimized || ['String', 'DOM', '9js', 'Dijit'],
					condition;
				function putValue(targetType) {
					var cnt;
					function optimizerSort(a, b) {
						var map = { '9js': 1, 'Dijit': 2, 'DOM': 3, 'String' : 4};
						return (map[a] || 4) - (map[b] || 4);
					}
					function testPut(opType) {
						if (opType === 'String') {
							return renderer.expression('putValue');
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
								.addAssignment(
									target,
									renderer.expression(target).plus(renderer.expression('putValue'))
								);
						}
						else if (opType === 'DOM') {
							renderer.addStatement(renderer.expression('node').member('appendChild').invoke(renderer.expression('putValue')));
							renderer
								.addAssignment(
									'txn',
									renderer
										.expression('t')
										.invoke(
											renderer.expression('node'),
											renderer.literal(''),
											renderer
												.expression('node')
												.member('ownerDocument')
										)
									);
//							r += 'node.appendChild(putValue);\ntxn = t(node, \'\', node.ownerDocument);\n';
						}
						else if (opType === '9js') {
							renderer
								.addStatement(
									renderer
										.expression('putValue')
										.member('show')
										.invoke(renderer.expression('node'))
								);
//							r += 'putValue.show(node);\n';
						}
						else if (opType === 'Dijit') {
							renderer
								.addStatement(
									renderer
										.expression('node')
										.member('appendChild')
										.invoke(renderer.expression('putValue').member('domNode'))
								);
//							r += 'node.appendChild(putValue.domNode);\n';
						}
					}
					if (targetType === 'attr'){
						renderer.addAssignment(target, renderer.expression('putValue').or(renderer.literal('')));
//						r += target + ' += putValue || "";\n';
					}
					else if (targetType === 'text'){
						if (optimized.length > 1) {
							elementContext.needsDom = true;
							renderer = renderer.addCondition(renderer.expression('putValue')).renderer;
							//r += 'if (putValue) {\n';
							optimized = optimized.sort(optimizerSort);
							for (cnt = 0; cnt < optimized.length; cnt += 1) {
								if (cnt === 0) {
									condition = renderer.addCondition(testPut(optimized[cnt]));
									renderer = condition.renderer;
								}
								else {
									renderer = condition.elseIf(testPut(optimized[cnt]));
								}
								processPut(optimized[cnt]);
							}
							renderer = renderer.getParentRenderer(); //out of inner if
							renderer = renderer.getParentRenderer(); //out of if(putValue)
							//r += '}\n';
						}
						else {
							if (optimized[0] !== 'String') {//Only String optimizers are elegible for an innerHTML solution
								elementContext.needsDom = true;
							}
							processPut(optimized[0]);
						}
					}
				}
				var r = '';
				if ((expression.contentType === 'identifier') || (expression.contentType === 'functionCall')){
					renderer.addAssignment('putValue', makePutValue(expression));
					putValue(targetType);
					//var putValueText = 'putValue = ' + makePutValue(expression) + ';\n';
					//r += putValueText;
					//r += putValue(targetType);
				// }
				// else if (expression.contentType === 'functionCall') {
				// 	var putValueText = 'putValue = ' + makePutValue(expression) + ';\n';
				// 	r += putValueText;
				// 	r += putValue(targetType);
				}
				else {
					console.log('unsupported expression content type: ');
					console.log(expression);
				}
				return r;
			}
			/**
			If the parser finds a live expression then it attempts to rewrite the whole element or attribute on change
			*/
			function processLiveExpression(/*expression, target, targetType, elementContext*/) {
				return processExpression.apply(null, arguments);
			}
			
			/**
			Tells whether a given class attribute is representing an attach point
			@param {Object|Array|Function|String} obj - the object to be represented
			*/
			function isAttachPoint(xmlNode) {
				return (/^data-(ninejs-attach|dojo-attach-point)$/).test(xmlNode.nodeName());
			}
			function processAttachPoint(xmlNode) {
				var condition,
					conditionRenderer,
					innerCondition,
					innerElse,
					elseRenderer;
				renderer
					.addAssignment(
						'attachTemp',
						renderer
							.expression('r')
							.element(renderer.literal(xmlNode.value()))
					);
				condition = renderer.addCondition(renderer.expression('attachTemp'));
				conditionRenderer = condition.renderer;
				innerCondition = conditionRenderer
					.addCondition(
						conditionRenderer
							.expression('Object')
							.member('prototype')
							.member('toString')
							.member('call')
							.invoke(conditionRenderer.expression('attachTemp'))
							.equals(
								conditionRenderer.literal('[object Array]')
							)
					);
				innerCondition
					.renderer
					.addStatement(
						innerCondition.renderer
							.expression('attachTemp')
							.member('push')
							.invoke(
								innerCondition.renderer.expression('node')
							)
					);
				innerElse = innerCondition.elseDo();
				innerElse
					.addAssignment(
						innerElse
							.expression('r')
							.element(innerElse.literal(xmlNode.value())),
						innerElse
							.array()
								.add(innerElse.expression('attachTemp'))
								.add(innerElse.expression('node'))
					);
				elseRenderer = condition.elseDo();
				elseRenderer
					.addAssignment(
						elseRenderer
							.expression('r')
							.element(elseRenderer.literal(xmlNode.value())),
						elseRenderer
							.expression('node')
					);
				//return 'attachTemp = r[\'' + xmlNode.value() + '\'];\nif (attachTemp) {\nif ( Object.prototype.toString.call( attachTemp ) === \'[object Array]\' ) {\nattachTemp.push(node);\n}\nelse {\nr[\'' + xmlNode.value() + '\'] = [attachTemp, node];\n}\n}\nelse {\nr[\'' + xmlNode.value() + '\'] = node;\n}\n';
			}
			function processExpressionToken(result, target, targetType, elementContext) {
				if (result.modifier === 'live') {
					if (result.value.type === 'expression'){
						processLiveExpression(result.value, target, targetType, elementContext);
					}
					else {
						console.log('unsupported expression token type: ');
						console.log(result.value);
					}
				}
				else {
					if (result.value.type === 'expression'){
						processExpression(result.value, target, targetType, elementContext);
					}
					else {
						console.log('unsupported expression token type: ');
						console.log(result.value);
					}
				}
			}
			//MUST return Renderer::Expression
			function solveFunctionCall(expression, inFunctionCall){
				var arr = expression['arguments'];
				var cnt;
				var functionArgs = [];
				for (cnt = 0; cnt < arr.length; cnt += 1){
					functionArgs.push(makePutValue(arr[cnt]));
				}
				if (inFunctionCall) {
					renderer.addAssignment('x', makePutValue(expression.content, true));
					renderer
						.addAssignment(
							'x',
							renderer
								.expression('x')
								.member('apply')
								.invoke(
									renderer.expression('y'),
									renderer.array(functionArgs)
								)
						);
					return renderer.expression('x');
//					r += 'y = x;\nx = x.apply(y, [' + functionArgs.join(', ') + ']);\n';
				}
				else {
					if (expression.content && expression.content.contentType !== 'functionCall') {
						return renderer
							.newAssignment(
								'x',
								makePutValue(expression.content, false)
									.member('apply')
									.invoke(renderer.expression('context'), renderer.array(functionArgs))
								);
					}
					else {
						return renderer
							.newAssignment(
								'x',
								makePutValue(expression.content, false)
									.member('apply')
									.invoke(renderer.expression('x'), renderer.array(functionArgs))
								);
					}
// 					renderer
// 						.addAssignment('x', renderer.expression('context'));
// //					r += 'null;\nx = context;\n';
// 					renderer
// 						.addAssignment('x', renderer.expression('context'));
// //					r += 'y = context;\n';
// ///////////////
// 					renderer.addAssignment('y', renderer.expression('x'));
// 					renderer.addAssignment(
// 						'putValue',
// 						renderer
// 							.expression('x')
// 							.member('apply')
// 							.invoke(
// 								renderer.expression('y'),
// 								renderer.array(functionArgs)
// 							)
// 					);
// 					return makePutValue(expression.content, true);
//					r += makePutValue(expression.content, true) + 'y = x;\nputValue = x.apply(y, [' + functionArgs.join(', ') + ']);\n';
				}
			}
			function solveTagName(xmlNode, isRoot, elementContext) {
				if (xmlNode.hasVariableTagName()) {
					xmlNode.getVariableTagName(function(val) {
						processTextFragment(val, renderer.expression('x'), 'attr', null, null, elementContext);
					});
					if (isRoot) {
						renderer
							.addAssignment(
								'node',
								renderer
									.expression('document')
									.member('createElement')
									.invoke(
										renderer.expression('putValue').or(renderer.literal(xmlNode.nodeName()))
									)
							);
//						r += 'node = document.createElement(putValue || \'' + xmlNode.nodeName() + '\');\n';
					}
					else {
						renderer
							.addAssignment(
								'node',
								renderer
									.expression('e')
									.invoke(
										renderer.expression('node'),
										renderer.expression('putValue').or(renderer.literal(xmlNode.nodeName())),
										renderer.expression('node').member('ownerDocument')
									)
							);
//						r += 'node = e(node, putValue || \'' + xmlNode.nodeName() + '\', node.ownerDocument);\n';
					}
				}
				else {
					if (isRoot) {
						renderer
							.addAssignment(
								'node',
								renderer
									.expression('document')
									.member('createElement')
									.invoke(
										renderer.literal(xmlNode.nodeName())
									)
							);
//						r += 'node = document.createElement(\'' + xmlNode.nodeName() + '\');\n';
					}
					else {
						renderer
							.addAssignment(
								'node',
								renderer
									.expression('e')
									.invoke(
										renderer.expression('node'),
										renderer.literal(xmlNode.nodeName()),
										renderer.expression('node').member('ownerDocument')
									)
							);
//						r += 'node = e(node, \'' + xmlNode.nodeName() + '\', node.ownerDocument);\n';
					}
				}
			}
			function processAttribute(xmlNode, attName, elementContext) {
				if (isAttachPoint(xmlNode) || attName === 'data-ninejs-tagName') {
					elementContext.needsDom = true;
					processAttachPoint(xmlNode);
				} else {
					renderer.addAssignment('av', renderer.literal(''));
//					r += 'av = \'\';\n';
					processTextFragment(xmlNode.value(), renderer.expression('av'), 'attr', null, null, elementContext);
					if (attName === 'class') {
						renderer
							.addAssignment(
								renderer.expression('node').member('className'),
								renderer.expression('av')
							);
//						r += 'node.className = av;\n';
					}
					else {
						renderer
							.addStatement(
								renderer
									.expression('node')
									.member('setAttribute')
									.invoke(
										renderer.literal(attName),
										renderer.expression('av')
									)
							);
//						r += 'node.setAttribute(\'' + attName + '\', av);\n';
					}
				}
//				return r;
			}
			var result,
				promise;
			//Do some processing
			renderer
				.addParameter('context')
				.addParameter('document')
				.init()
				.addVar('fn', objUtils.deepToString(functions))
				.addVar('r', renderer.raw('{}'));

			if (sync) {
				//buildString += processDom();
				processDom();
				renderer.addReturn(renderer.varName('r'));
				result = renderer.renderFunction();
			}
			else {
				promise = processDom();
				return def.when(promise, function(/*value*/) {
					var result;
					//buildString += value;
					renderer.addReturn('r');
					result = renderer.renderFunction();
					return result;
				});
			}
			return result;
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
		define(['./utils/functions', './utils/parser/amd', '../core/deferredUtils', './BaseProcessor', '../core/objUtils', './renderers/JavascriptRenderer'], moduleExport);
	} else if (isNode) { //Server side
		module.exports = moduleExport(req('./utils/functions'), req('./utils/parser/commonjs'), req('../core/deferredUtils'), req('./BaseProcessor'), req('../core/objUtils'), req('./renderers/JavascriptRenderer'));
	} else {
		// plain script in a browser
		throw new Error('Non AMD environments are not supported');
	}
})();