define([], function() {
	'use strict';

	function emptyNode(node) {
		var c = node.lastChild;
		while (c) {
			node.removeChild(c);
			c = node.lastChild;
		}
	}

	function appendText(element, text) {
		if (element && element.ownerDocument) {
			element.appendChild(element.ownerDocument.createTextNode(text));
		}
	}

	var setText = function(node, text) {
		emptyNode(node);
		appendText(node, text);
		return node;
	};
	setText.emptyNode = emptyNode;
	return setText;
});
