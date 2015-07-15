(function() {
	'use strict';
	function moduleExport() {
		function appendText(e, text, doc) {
			return e.appendChild(doc.createTextNode(text));
		}
		function appendTest() {
			/* global window */
			return window.document.body && (window.document.body.insertAdjacentElement);
		}
		function alternateAppend(e, name, doc) {
			var node = doc.createElement(name);
			e.appendChild(node);
			return node;
		}
		function alternateAppendNs(e, name, ns, doc) {
			var node = doc.createElementNS(ns, name);
			e.appendChild(node);
			return node;
		}
		function appendElement(e, name, doc) {
			var node = doc.createElement(name);
			e.insertAdjacentElement('beforeEnd', node);
			return node;
		}
		function appendElementNs(e, name, ns, doc) {
			var node = doc.createElementNS(ns, name);
			e.insertAdjacentElement('beforeEnd', node);
			return node;
		}

		return {
			t : appendText,
			e: appendElement,
			ens: appendElementNs,
			tst: appendTest,
			ae: alternateAppend,
			aens: alternateAppendNs
		};
	}

	if ( typeof define !== 'undefined') {//AMD
		define([], moduleExport);
	} else if ( typeof window === 'undefined') {//Server side
		module.exports = moduleExport();
	} else {
		// plain script in a browser
		throw new Error('Non AMD environments are not supported');
	}
})();