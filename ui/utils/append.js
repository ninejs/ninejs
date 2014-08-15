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
	append.toIndex = function (parentNode, node, index) {
		var cur = 0,
			currentChild;
		if (typeof(index) === 'undefined') {
			return append(parentNode, node);
		}
		else {
			currentChild = parentNode.firstChild;
			while (currentChild && (cur < index)) {
				currentChild = currentChild.nextSibling;
				cur += 1;
			}
			if (!currentChild) {
				return append(parentNode, node);
			}
			else {
				parentNode.insertBefore(node, currentChild);
			}
		}
	};

	return append;
});
