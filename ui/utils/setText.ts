var setText: {
	(node: HTMLElement, text: string): HTMLElement;
	emptyNode: (node: HTMLElement) => void;
} = (() => {
	function emptyNode(node: HTMLElement) {
		var c = node.lastChild;
		while (c) {
			node.removeChild(c);
			c = node.lastChild;
		}
	}

	function appendText(element: HTMLElement, text: string) {
		if (element && element.ownerDocument) {
			element.appendChild(element.ownerDocument.createTextNode(text));
		}
	}

	var setText: any = function(node: HTMLElement, text: string) {
		emptyNode(node);
		appendText(node, text);
		return node;
	};
	setText.emptyNode = emptyNode;
	return setText;
})();
export default setText;


