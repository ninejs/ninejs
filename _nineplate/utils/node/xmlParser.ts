import * as xml from './node-xml';
import * as Q from '../../../core/bluebird';

var defer = function() {
	return Q.defer();
};
export class XmlParserError extends Error {
	line: number;
	column: number;
	xml: string;
}
export interface InternalNode {
	nodeType: number;
	prefix?: string;
	name?: string;
	nodeName?: string;
	localName?: string;
	parentNode?: InternalNode;
	namespaces?: string[],
	namespaceURI?: string;
	namespaceUri?: string;
	nodeValue?: any;
	value?: any;
	children?: InternalNode[];
	childNodes?: InternalNode[];
	attributes?: InternalNode[];
	[ name: string ]: any;
}
function getAttributeNS(node: InternalNode, prefix: string): string {
	if (node.namespaces.length) {
		var r = node.namespaces.filter(function (ns) {
			return ns[0] === prefix;
		});
		if (r.length) {
			return r[0][1];
		}
	}
	if (node.parentNode) {
		return getAttributeNS(node.parentNode, prefix);
	}
	else {
		return null;
	}
}
export function parse (text: string, sync: boolean): any {
	var deferred = defer();
	var nodes: InternalNode[] = [];
	var node: InternalNode;
	var rootNode: InternalNode = null;
	var parser = new xml.SaxParser(function(cb: any) {
		cb.onStartDocument(function() {

		});
		cb.onEndDocument(function() {
			deferred.resolve(rootNode);
		});
		cb.onStartElementNS(function(elem: string, attrs: { 0: string, 1: string }[], prefix: string, uri: string, namespaces: string[]) {
			var parentNode = node;
			node = {
				nodeName: elem,
				prefix: prefix,
				namespaceUri: uri,
				namespaces: namespaces,
				nodeType: 1,
				parentNode: parentNode,
				children: [],
				attributes: attrs.map(function (item: { 0: string, 1: string }): InternalNode {
					var nodeName = item[0],
						ns: string = null,
						idx = nodeName.indexOf(':');
					if (idx >= 0) {
						ns = getAttributeNS(node, nodeName.substr(0, idx));
						nodeName = nodeName.substr(idx + 1);
					}
					return {
						nodeName: nodeName,
						parentNode: node,
						value: item[1],
						nodeType: 2,
						namespaceUri: ns
					};
				})
			};
			if (!rootNode) {
				rootNode = node;
			} else {
				parentNode.children.push(node);
			}
			nodes.push(node);
		});
		cb.onEndElementNS(function ( /*elem, prefix, uri*/ ) {
			nodes.pop();
			node = nodes[nodes.length - 1];
		});
		cb.onCharacters(function (chars: string) {
			chars = chars.trim();
			if (node && chars) {
				node.children.push({
					nodeType: 3,
					nodeValue: chars
				});
			}
		});
		cb.onCdata(function (cdata: string) {
			if (node && cdata) {
				node.children.push({
					nodeType: 3,
					nodeValue: cdata
				});
			}
		});
		cb.onComment(function (msg: string) {
			if (node && node.children) {
				node.children.push({
					nodeType: 4,
					nodeValue: msg
				});
			}
		});
		cb.onWarning(function (/*msg*/) {

		});
		cb.onError(function (msg: string, parser: any) {
			var err = new XmlParserError(msg);
			if (parser) {
				err.line = parser.getLineNumber();
				err.column = parser.getColumnNumber();
				err.xml = parser['m_parser']['m_xml'];
			}
			deferred.reject(err);
		});
	});
	parser.sync = sync;
	parser.parseString(text);
	if (sync) {
		return rootNode;
	}
	else {
		return deferred.promise;
	}
};
