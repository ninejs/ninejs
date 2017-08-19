'use strict';

var append: {
	(parentNode: HTMLElement, node: any, position?: string): HTMLElement;
	create: (node: string) => HTMLElement;
	remove: (node: HTMLElement) => void;
	toIndex: (parentNode: HTMLElement, node: HTMLElement, index: number) => HTMLElement;
};
append = (() => {
	var append: any = function(parentNode: HTMLElement, node: any, position: InsertPosition) {
		if (typeof(node) === 'string') {
			node = parentNode.ownerDocument.createElement(node);
		}
		parentNode.insertAdjacentElement(position || 'beforeend', node);
		return node;
	};
	if (!window.document.body || !window.document.body.insertAdjacentElement) {
		append = function(parentNode: HTMLElement, node: any, position: string) {
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
	append.create = function (node: string) {
		return window.document.createElement(node);
	};
	append.remove = function (node: HTMLElement) {
		if (node.parentNode) {
			node.parentNode.removeChild(node);
		}
	};
	append.toIndex = function (parentNode: HTMLElement, node: HTMLElement, index: number) {
		var cur = 0,
			currentChild: Node;
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
})();

export var toIndex = append.toIndex;
export var remove = append.remove;
export var create = append.create;

export default append;