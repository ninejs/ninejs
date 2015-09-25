import * as extend from '../core/extend';
import { InternalNode, parse } from './utils/node/xmlParser';

var isNode = typeof(window) === 'undefined';
function manualTrim(str: string) {
	str = str.replace(/^\s+/, '');
	for(var i = str.length - 1; i >= 0; i-= 1) {
		if(/\S/.test(str.charAt(i))) {
			str = str.substring(0, i + 1);
			break;
		}
	}
	return str;
}

export class XmlNode {
	node: InternalNode;
	nodeType () {
		return this.node.nodeType;
	}
	value () {
		return this.node.value;
	}
	nodeValue () {
		return this.node.nodeValue;
	}
	getAttributes () {
		var cnt: number,
			attributes = this.node.attributes,
			len = attributes.length,
			r: XmlNode[] = [];
		for (cnt = 0; cnt < len; cnt += 1) {
			r.push(new XmlNode(attributes[cnt]));
		}
		return r;
	}
	getChildNodes () {
		var cnt: number,
			children = isNode ? this.node.children : this.node.childNodes,
			len = children.length,
			r: XmlNode[] = [];
		for (cnt = 0; cnt < len; cnt += 1) {
			r.push(new XmlNode(children[cnt]));
		}
		return r;
	}
	hasVariableTagName () {
		var attributes = this.getAttributes(),
			cnt: number;
		for (cnt = 0; cnt < attributes.length; cnt += 1) {
			if (attributes[cnt].nodeName() === 'data-ninejs-tagName') {
				return true;
			}
		}
		return false;
	}
	getVariableTagName (callback: (v: string) => void) {
		var attributes = this.getAttributes(),
			found: XmlNode,
			cnt: number;
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
	nodeName () {
		return this.node.nodeName;
	}
	nodeLocalName () {
		return this.node.localName || this.node.nodeName;
	}
	namespaceUri () {
		return this.node.namespaceURI || this.node.namespaceUri || '';
	}
	parentNode () {
		if (!this.node.parentNode) {
			return null;
		}
		else {
			return new XmlNode(this.node.parentNode);
		}
	}
	set (n: string, v: any) {
		this.node[n] = v;
	}
	get (n: string) {
		return this.node[n];
	}
	constructor (parsedXmlNode: InternalNode) {
		this.node = parsedXmlNode;
	}
}
export class TextParseContext {
	r: string[];
	lineBuffer: string[];
	ignoreComments: boolean;
	append (line: string) {
		this.appendLine();
		this.r.push(line);
	}
	appendLine () {
		if (this.lineBuffer.length) {
			this.r.push('result.push(\'' + this.lineBuffer.join('') + '\');\n');
			this.lineBuffer = [];
		}
	}
	getText () {
		return this.r.join('');
	}
	constructor () {
		this.r = [];
		this.lineBuffer = [];
	}
}

/**
returns the string's internal trim result or does a manual trim otherwise
@param {String} content - the string to be trimmed
*/
export function trim (content: any): string {
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
export function safeFilter (content: string) {
	if (content) {
		content = content.replace(/(\'|\")/g, function ($0, $1) {
			/* jshint unused: true */
			return '\\' + $1;
		}).replace(/\n/g, function () {
			return '';
		});
	}
	return content;
}
export function getParsedXml (text: string, sync: boolean): any {
	var xmlDoc: any;
	if (isNode) { //Node.js
		return parse(text, sync);
	} else if (typeof(window) !== 'undefined') {
		/* jshint -W003 */
		/* globals window: true */
		if (typeof(DOMParser) !== 'undefined') {
			var parser = new DOMParser();
			xmlDoc = parser.parseFromString(text, 'text/xml');
		} else { // Internet Explorer
			xmlDoc = new ActiveXObject('Microsoft.XMLDOM');
			xmlDoc.async = false;
			xmlDoc.loadXML(text);
		}
		return xmlDoc;
	}
}
export interface ExpressionToken {
	content: any;
	contentType: string;
	type: string;
	identifier: string;
	value: any;
	modifier: string;
	optimized: string[];
	arguments: ExpressionToken[];
}
export interface ParserType {
	parse: (content: string) => ExpressionToken;
}

export { InternalNode } from './utils/node/xmlParser';