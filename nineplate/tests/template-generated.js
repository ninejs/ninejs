define([], function() {
/* jshint -W074 */
/* globals window: true */
'use strict';
var r = function anonymous(context,document) {
'use strict';
var fn, r = {};
fn = {t:function (e, text, doc) {
			return e.appendChild(doc.createTextNode(text));
		},e:function (e, name, doc) {
			var node = doc.createElement(name);
			e.insertAdjacentElement('beforeEnd', node);
			return node;
		},tst:function () {
			/* global window */
			return (window.document.body.insertAdjacentElement);
		},ae:function (e, name, doc) {
			var node = doc.createElement(name);
			e.appendChild(node);
			return node;
		}};
if (!document) {
document = window.document;
}
var nodes = [], node, att, txn, attachTemp, putValue, x, y, e = (fn.tst()?fn.e:fn.ae), a = fn.a, t = fn.t, av, result, v;
putValue = context['tagName'];
x += putValue || "";
node = document.createElement(putValue || 'div');
nodes.push(node);
av = '';
putValue = context['class'];
av += putValue || "";
node.className = av;
attachTemp = r['${tagName}'];
if (attachTemp) {
if ( Object.prototype.toString.call( attachTemp ) === '[object Array]' ) {
attachTemp.push(node);
}
else {
r['${tagName}'] = [attachTemp, node];
}
}
else {
r['${tagName}'] = node;
}
nodes.push(node);
node = e(node, 'h1', node.ownerDocument);
attachTemp = r['titleNode'];
if (attachTemp) {
if ( Object.prototype.toString.call( attachTemp ) === '[object Array]' ) {
attachTemp.push(node);
}
else {
r['titleNode'] = [attachTemp, node];
}
}
else {
r['titleNode'] = node;
}
txn = t(node, '', node.ownerDocument);
putValue = context['title'];
if (putValue) {
if (putValue["$njsWidget"]) {
putValue.show(node);
}
else if (putValue.domNode) {
node.appendChild(putValue.domNode);
}
else if (putValue.tagName) {
node.appendChild(putValue);
txn = t(node, '', node.ownerDocument);
}
else if (putValue) {
txn.nodeValue += putValue;
}
}
node = nodes.pop();
nodes.push(node);
node = e(node, 'div', node.ownerDocument);
attachTemp = r['contentNode'];
if (attachTemp) {
if ( Object.prototype.toString.call( attachTemp ) === '[object Array]' ) {
attachTemp.push(node);
}
else {
r['contentNode'] = [attachTemp, node];
}
}
else {
r['contentNode'] = node;
}
av = '';
av += 'content';
node.className = av;
txn = t(node, '', node.ownerDocument);
txn.nodeValue += 'This is the content.';
node = nodes.pop();
nodes.push(node);
node = e(node, 'div', node.ownerDocument);
nodes.push(node);
node = e(node, 'span', node.ownerDocument);
txn = t(node, '', node.ownerDocument);
txn.nodeValue += 'More content';
putValue = null;
x = context;
y = context;
y = x;
x = x['fn'];
y = x;
putValue = x.apply(y, ['key']);
;
if (putValue) {
if (putValue["$njsWidget"]) {
putValue.show(node);
}
else if (putValue.domNode) {
node.appendChild(putValue.domNode);
}
else if (putValue.tagName) {
node.appendChild(putValue);
txn = t(node, '', node.ownerDocument);
}
else if (putValue) {
txn.nodeValue += putValue;
}
}
txn.nodeValue += 'more data';
node = nodes.pop();
node = nodes.pop();
nodes.push(node);
node = e(node, 'div', node.ownerDocument);
attachTemp = r['multiAttach'];
if (attachTemp) {
if ( Object.prototype.toString.call( attachTemp ) === '[object Array]' ) {
attachTemp.push(node);
}
else {
r['multiAttach'] = [attachTemp, node];
}
}
else {
r['multiAttach'] = node;
}
txn = t(node, '', node.ownerDocument);
putValue = null;
x = context;
y = context;
y = x;
x = x['doubleFunction'];
y = x;
x = x.apply(y, [context['title']]);
y = x;
putValue = x.apply(y, ['key']);
;
if (putValue) {
if (putValue["$njsWidget"]) {
putValue.show(node);
}
else if (putValue.domNode) {
node.appendChild(putValue.domNode);
}
else if (putValue.tagName) {
node.appendChild(putValue);
txn = t(node, '', node.ownerDocument);
}
else if (putValue) {
txn.nodeValue += putValue;
}
}
node = nodes.pop();
nodes.push(node);
node = e(node, 'div', node.ownerDocument);
attachTemp = r['multiAttach'];
if (attachTemp) {
if ( Object.prototype.toString.call( attachTemp ) === '[object Array]' ) {
attachTemp.push(node);
}
else {
r['multiAttach'] = [attachTemp, node];
}
}
else {
r['multiAttach'] = node;
}
txn = t(node, '', node.ownerDocument);
txn.nodeValue += 'This is a number: ';
putValue = context['number'];
if (putValue) {
if (putValue["$njsWidget"]) {
putValue.show(node);
}
else if (putValue.domNode) {
node.appendChild(putValue.domNode);
}
else if (putValue.tagName) {
node.appendChild(putValue);
txn = t(node, '', node.ownerDocument);
}
else if (putValue) {
txn.nodeValue += putValue;
}
}
txn.nodeValue += '.';
node = nodes.pop();
nodes.push(node);
node = e(node, 'h1', node.ownerDocument);
result = [];
node.innerHTML = result.join("");
node = nodes.pop();
nodes.push(node);
node = e(node, 'div', node.ownerDocument);
result = [];
node.innerHTML = result.join("");
node = nodes.pop();
nodes.push(node);
node = e(node, 'div', node.ownerDocument);
av = '';
av += 'testANumberInAnObject';
node.className = av;
txn = t(node, '', node.ownerDocument);
putValue = context['anObject']['aNumber'];
if (putValue) {
if (putValue["$njsWidget"]) {
putValue.show(node);
}
else if (putValue.domNode) {
node.appendChild(putValue.domNode);
}
else if (putValue.tagName) {
node.appendChild(putValue);
txn = t(node, '', node.ownerDocument);
}
else if (putValue) {
txn.nodeValue += putValue;
}
}
node = nodes.pop();
nodes.push(node);
node = e(node, 'div', node.ownerDocument);
txn = t(node, '', node.ownerDocument);
txn.nodeValue += 'This is a widget';
putValue = context['button'];
if (putValue) {
if (putValue["$njsWidget"]) {
putValue.show(node);
}
else if (putValue.domNode) {
node.appendChild(putValue.domNode);
}
else if (putValue.tagName) {
node.appendChild(putValue);
txn = t(node, '', node.ownerDocument);
}
else if (putValue) {
txn.nodeValue += putValue;
}
}
node = nodes.pop();
txn = t(node, '', node.ownerDocument);
(function(context) {
var arr, temp, cnt, ident;
ident = 'person';
temp = context[ident];
arr = context['persons'] || [];
for (cnt=0;cnt < arr.length; cnt += 1) {
context[ident] = arr[cnt];
nodes.push(node);
node = e(node, 'div', node.ownerDocument);
txn = t(node, '', node.ownerDocument);
putValue = context['person']['name'];
if (putValue) {
if (putValue["$njsWidget"]) {
putValue.show(node);
}
else if (putValue.domNode) {
node.appendChild(putValue.domNode);
}
else if (putValue.tagName) {
node.appendChild(putValue);
txn = t(node, '', node.ownerDocument);
}
else if (putValue) {
txn.nodeValue += putValue;
}
}
node = nodes.pop();
txn = t(node, '', node.ownerDocument);
}
context[ident] = temp;
}).call(this, context);
nodes.push(node);
node = e(node, 'hi', node.ownerDocument);
result = [];
node.innerHTML = result.join("");
node = nodes.pop();
nodes.push(node);
node = e(node, 'hi', node.ownerDocument);
result = [];
node.innerHTML = result.join("");
node = nodes.pop();
nodes.push(node);
node = e(node, 'div', node.ownerDocument);
result = [];
av = '';
putValue = context['tagName'];
av += putValue || "";
av += ' ';
putValue = context['class'];
av += putValue || "";
node.className = av;
node.innerHTML = result.join("");
node = nodes.pop();
nodes.push(node);
node = e(node, 'div', node.ownerDocument);
attachTemp = r['emptyNode'];
if (attachTemp) {
if ( Object.prototype.toString.call( attachTemp ) === '[object Array]' ) {
attachTemp.push(node);
}
else {
r['emptyNode'] = [attachTemp, node];
}
}
else {
r['emptyNode'] = node;
}
node = nodes.pop();
nodes.push(node);
node = e(node, 'div', node.ownerDocument);
nodes.push(node);
node = e(node, 'div', node.ownerDocument);
av = '';
av += 'persons';
node.className = av;
attachTemp = r['personsNode'];
if (attachTemp) {
if ( Object.prototype.toString.call( attachTemp ) === '[object Array]' ) {
attachTemp.push(node);
}
else {
r['personsNode'] = [attachTemp, node];
}
}
else {
r['personsNode'] = node;
}
txn = t(node, '', node.ownerDocument);
(function(context) {
var arr, temp, cnt, ident;
ident = 'person';
temp = context[ident];
arr = context['persons'] || [];
for (cnt=0;cnt < arr.length; cnt += 1) {
context[ident] = arr[cnt];
nodes.push(node);
node = e(node, 'div', node.ownerDocument);
av = '';
putValue = context['person']['name'];
av += putValue || "";
node.setAttribute('data-key', av);
nodes.push(node);
node = e(node, 'div', node.ownerDocument);
txn = t(node, '', node.ownerDocument);
putValue = context['person']['name'];
if (putValue) {
if (putValue["$njsWidget"]) {
putValue.show(node);
}
else if (putValue.domNode) {
node.appendChild(putValue.domNode);
}
else if (putValue.tagName) {
node.appendChild(putValue);
txn = t(node, '', node.ownerDocument);
}
else if (putValue) {
txn.nodeValue += putValue;
}
}
node = nodes.pop();
nodes.push(node);
node = e(node, 'div', node.ownerDocument);
result = [];
node.innerHTML = result.join("");
node = nodes.pop();
nodes.push(node);
node = e(node, 'div', node.ownerDocument);
result = [];
av = '';
av += 'age';
node.className = av;
node.innerHTML = result.join("");
node = nodes.pop();
node = nodes.pop();
txn = t(node, '', node.ownerDocument);
}
context[ident] = temp;
}).call(this, context);
node = nodes.pop();
node = nodes.pop();
node = nodes.pop();
r.domNode = node;
return r;

};
return r;
});
