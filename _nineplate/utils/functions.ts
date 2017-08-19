'use strict';

export var t = function appendText(e: HTMLElement, text: string, doc: HTMLDocument) {
	return e.appendChild(doc.createTextNode(text));
}
export var tst = function appendTest() {
	/* global window */
	return window.document.body && (window.document.body.insertAdjacentElement);
}
export var ae = function alternateAppend(e:HTMLElement, name: string, doc: HTMLDocument) {
	var node = doc.createElement(name);
	e.appendChild(node);
	return node;
}
export var aens = function alternateAppendNs(e: HTMLElement, name: string, ns: string, doc: HTMLDocument) {
	var node = doc.createElementNS(ns, name);
	e.appendChild(node);
	return node;
}
export var e = function appendElement(e: HTMLElement, name: string, doc: HTMLDocument) {
	var node = doc.createElement(name);
	e.insertAdjacentElement('beforeend', node);
	return node;
}
export var ens = function appendElementNs(e: HTMLElement, name: string, ns: string, doc: HTMLDocument) {
	var node = doc.createElementNS(ns, name);
	e.insertAdjacentElement('beforeend', node);
	return node;
}