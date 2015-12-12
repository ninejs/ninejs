(function (deps, factory) { 
	if (typeof module === 'object' && typeof module.exports === 'object') { 
		var v = factory(require, exports); if (v !== undefined) module.exports = v; 
	} 
	else if (typeof define === 'function' && define.amd) { 
		define(deps, factory); 
	} 
})(['require', 'module', 'ninejs/_nineplate/utils/functions','ninejs/_nineplate/utils/functions'], function (require, module) {
/* jshint -W074 */
/* globals window: true */
'use strict';
var r = function anonymous(context,document
/**/) {
'use strict';
var fn = require('ninejs/_nineplate/utils/functions'),
    r = {},
    nodes = [],
    node,
    att,
    txn,
    attachTemp,
    putValue,
    x,
    ctxTemp,
    y,
    e = (fn.tst()?fn.e:fn.ae),
    ens = (fn.tst()?fn.ens:fn.aens),
    aens = fn.aens,
    a = fn.a,
    t = fn.t,
    av,
    result,
    v;
if (!document){
	document = window.document;

}
putValue = context['tagName'];
if (putValue !== undefined){
	x = putValue;

} else {
	x = '';

}
node = document.createElement((putValue) || 'div');
nodes.push(node);
av = '';
av = av + 'dropdown ';
putValue = context['class'];
if (av !== ''){
	av = av + ((putValue) || '');

} else {
	av = ((putValue) || '');

}
node.className = av;
attachTemp = r['${tagName}'];
if (attachTemp){
	if (Object.prototype.toString.call(attachTemp) === '[object Array]'){
		attachTemp.push(node);

	} else {
		r['${tagName}'] = [attachTemp,node];

	}

} else {
	r['${tagName}'] = node;

}
nodes.push(node);
node = e(node,'a',node.ownerDocument);
av = '';
putValue = context['labelClass'];
if (av !== ''){
	av = av + ((putValue) || '');

} else {
	av = ((putValue) || '');

}
av = av + ' dropdown-toggle';
node.className = av;
av = '';
av = av + '#';
node.setAttribute('href',av);
attachTemp = r['anchor'];
if (attachTemp){
	if (Object.prototype.toString.call(attachTemp) === '[object Array]'){
		attachTemp.push(node);

	} else {
		r['anchor'] = [attachTemp,node];

	}

} else {
	r['anchor'] = node;

}
nodes.push(node);
node = e(node,'span',node.ownerDocument);
txn = t(node,'',node.ownerDocument);
putValue = context['label'];
txn.nodeValue = txn.nodeValue + ((putValue !== undefined)? putValue:'');
node = nodes.pop();
nodes.push(node);
node = e(node,'span',node.ownerDocument);
av = '';
av = av + 'caret';
node.className = av;
node = nodes.pop();
node = nodes.pop();
nodes.push(node);
node = e(node,'ul',node.ownerDocument);
av = '';
av = av + 'dropdown-menu';
node.className = av;
attachTemp = r['itemsParent'];
if (attachTemp){
	if (Object.prototype.toString.call(attachTemp) === '[object Array]'){
		attachTemp.push(node);

	} else {
		r['itemsParent'] = [attachTemp,node];

	}

} else {
	r['itemsParent'] = node;

}
av = '';
av = av + 'menu';
node.setAttribute('role',av);
av = '';
av = av + 'dropdownMenu';
node.setAttribute('aria-labelledby',av);
node = nodes.pop();
node = nodes.pop();
r.domNode = node;
return r;

};
module.exports = r;	});
