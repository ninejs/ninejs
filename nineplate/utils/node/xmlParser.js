(function() {
	'use strict';
	var isAmd = (typeof(define) !== 'undefined') && define.amd;
	var isDojo = isAmd && define.amd.vendor === 'dojotoolkit.org';
	var isNode = (typeof(window) === 'undefined');
	var req = (isDojo && isNode)? global.require : require;

	function moduleExport(xml, Q) {
		var defer;
		if (isNode) {
			if (isDojo) {
				defer = function() {
					return new Q(); //dojo/Deferred
				};
			}
			else {
				defer = function() {
					return Q.defer();
				};
			}
		}
		var parse = function(text, sync) {
			var deferred = defer();
			var nodes = [];
			var node;
			var rootNode = null;
			var parser = new xml.SaxParser(function(cb) {
				cb.onStartDocument(function() {

				});
				cb.onEndDocument(function() {
					deferred.resolve(rootNode);
				});
				cb.onStartElementNS(function(elem, attrs, prefix, uri, namespaces) {
					var parentNode = node;
					node = {};
					node.nodeName = elem;
					node.prefix = prefix;
					node.namespaceUri = uri;
					node.namespaces = namespaces;
					node.nodeType = 1;
					node.attributes = attrs.map(function(item) {
						return {
							nodeName: item[0],
							value: item[1],
							nodeType: 2
						};
					});
					node.children = [];
					if (!rootNode) {
						rootNode = node;
					} else {
						parentNode.children.push(node);
					}
					nodes.push(node);
				});
				cb.onEndElementNS(function( /*elem, prefix, uri*/ ) {
					nodes.pop();
					node = nodes[nodes.length - 1];
				});
				cb.onCharacters(function(chars) {
					chars = chars.trim();
					if (node && chars) {
						node.children.push({
							nodeType: 3,
							nodeValue: chars
						});
					}
				});
				cb.onCdata(function( /*cdata*/ ) {

				});
				cb.onComment(function( msg ) {
					if (node && node.children) {
						node.children.push({
							nodeType: 4,
							nodeValue: msg
						});
					}
				});
				cb.onWarning(function( /*msg*/ ) {

				});
				cb.onError(function(msg) {
					deferred.reject(new Error(msg));
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
		return { parse: parse };
	}
	if (isNode) {
		if (isDojo) {
			define(['./node-xml', 'dojo/Deferred'], moduleExport);
		}
		else if (isAmd) {//RequireJS probably
			var def = define;
			def(['./node-xml', 'q'], moduleExport);
		}
		else {
			module.exports = moduleExport(req('./node-xml'), req('q'));
		}
	}
})();