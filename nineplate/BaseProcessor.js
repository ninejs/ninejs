/** 
@module ninejs/nineplate/baseProcessor 
@author Eduardo Burgos <eburgos@gmail.com>
*/
(function() {
	'use strict';
	var isAmd = (typeof(define) !== 'undefined') && define.amd;
	var isDojo = isAmd && define.amd.vendor === 'dojotoolkit.org';
	var isNode = (typeof(window) === 'undefined');
	var req = (isDojo && isNode)? global.require : require;
	function manualTrim(str){
		str = str.replace(/^\s+/, '');
		for(var i = str.length - 1; i >= 0; i-= 1){
			if(/\S/.test(str.charAt(i))){
				str = str.substring(0, i + 1);
				break;
			}
		}
		return str;
	}
	function moduleExport(xmlParser, extend) {
		var XmlNode,
			TextParseContext;

		XmlNode = extend({
			nodeType: function() {
				return this.node.nodeType;
			},
			value: function() {
				return this.node.value;
			},
			nodeValue: function() {
				return this.node.nodeValue;
			},
			getAttributes: function() {
				var cnt,
					attributes = this.node.attributes,
					len = attributes.length,
					r = [];
				for (cnt = 0; cnt < len; cnt += 1){
					r.push(new XmlNode(attributes[cnt]));
				}
				return r;
			},
			getChildNodes: function() {
				var cnt,
					children = isNode? this.node.children : this.node.childNodes,
					len = children.length,
					r = [];
				for (cnt = 0; cnt < len; cnt += 1){
					r.push(new XmlNode(children[cnt]));
				}
				return r;
			},
			hasVariableTagName: function() {
				var attributes = this.getAttributes(),
					cnt;
				for (cnt = 0; cnt < attributes.length; cnt += 1) {
					if (attributes[cnt].nodeName() === 'data-ninejs-tagName') {
						return true;
					}
				}
				return false;
			},
			getVariableTagName: function(callback) {
				var attributes = this.getAttributes(),
					found,
					cnt;
				for (cnt = 0; cnt < attributes.length; cnt += 1) {
					if (attributes[cnt].nodeName() === 'data-ninejs-tagName') {
						found = attributes[cnt];
					}
				}
				if (found) {
					return callback(found.value());
				}
				return '';
			},
			nodeName: function() {
				return this.node.nodeName;
			}
		}, function(parsedXmlNode) {
			this.node = parsedXmlNode;
		});
		TextParseContext = extend({
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

		var baseProcessor = {
			XmlNode: XmlNode,
			TextParseContext: TextParseContext,
			/**
			returns the string's internal trim result or does a manual trim otherwise
			@param {String} content - the string to be trimmed
			*/
			trim: function(content) {
				if (!content){
					return null;
				}
				if (content.trim){
					return content.trim();
				}
				else {
					return manualTrim(content);
				}

			},
			safeFilter: function(content) {
				if (content) {
					content = content.replace(/(\'|\")/g, function($0, $1) {
						/* jshint unused: true */
						return '\\' + $1;
					}).replace(/\n/g, function() {
						return '';
					});
				}
				return content;
			},
			getParsedXml: function(text, sync) {
				var xmlDoc;
				if (isNode) { //Node.js
					var parse = xmlParser.parse;
					return parse(text, sync);
				} else if (typeof(window) !== 'undefined') {
					/* jshint -W003 */
					/* globals window: true */
					if (window.DOMParser) {
						var parser = new window.DOMParser();
						xmlDoc = parser.parseFromString(text, 'text/xml');
					} else // Internet Explorer
					{
						xmlDoc = new window.ActiveXObject('Microsoft.XMLDOM');
						xmlDoc.async = false;
						xmlDoc.loadXML(text);
					}
					return xmlDoc;
				}
			}
		};
		return baseProcessor;
	}

	if (isAmd) { //AMD
		//Testing for dojo toolkit
		if (isDojo) {
			define(['./utils/node/xmlParser', '../core/extend'], moduleExport);
		} else {
			//Trying for RequireJS and hopefully every other (Assuming text module is in 'text/text' btw)
			define(['./utils/node/xmlParser', '../core/extend'], moduleExport);
		}
	} else if (isNode) { //Server side
		var xmlParser = req('./utils/node/xmlParser'),
			extend = req('../core/extend');
		module.exports = moduleExport(xmlParser, extend);
	} else {
		// plain script in a browser
		throw new Error('Non AMD environments are not supported');
	}
})();