define([], function() {
	/* global window */
	'use strict';

	var append = function(parentNode, node, position) {
		if (typeof(node) === 'string') {
			node = parentNode.ownerDocument.createElement(node);
		}
		parentNode.insertAdjacentElement(position || 'beforeEnd', node);
		return node;
	};
	if (!window.document.body || !window.document.body.insertAdjacentElement) {
		append = function(parentNode, node, position) {
			if (typeof(node) === 'string') {
				node = parentNode.ownerDocument.createElement(node);
			}
			if (!position) {
				parentNode.appendChild(node);
			}
			else {
				if (position === 'beforeBegin') {
					parentNode.parentNode.insertBefore(node, parentNode);
				}
			}
			return node;
		};
	}
	append.create = function (node) {
		return window.document.createElement(node);
	};
	append.remove = function (node) {
		if (node.parentNode) {
			node.parentNode.removeChild(node);
		}
	};

	return append;
});
