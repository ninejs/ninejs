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
node = document.createElement('div');
nodes.push(node);
av = '';
av = av + 'btn-group SplitButtonDropdown ';
putValue = context['class'];
if (av !== ''){
	av = av + ((putValue) || '');

} else {
	av = ((putValue) || '');

}
node.className = av;
nodes.push(node);
node = e(node,'button',node.ownerDocument);
av = '';
av = av + 'button';
node.setAttribute('type',av);
av = '';
av = av + 'btn btn-default';
node.className = av;
attachTemp = r['action'];
if (attachTemp){
	if (Object.prototype.toString.call(attachTemp) === '[object Array]'){
		attachTemp.push(node);

	} else {
		r['action'] = [attachTemp,node];

	}

} else {
	r['action'] = node;

}
node = nodes.pop();
nodes.push(node);
node = e(node,'button',node.ownerDocument);
av = '';
av = av + 'button';
node.setAttribute('type',av);
av = '';
av = av + 'btn btn-default dropdown-toggle';
node.className = av;
av = '';
av = av + 'dropdown';
node.setAttribute('data-toggle',av);
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
av = '';
av = av + 'caret';
node.className = av;
node = nodes.pop();
nodes.push(node);
node = e(node,'span',node.ownerDocument);
av = '';
av = av + 'sr-only';
node.className = av;
txn = t(node,'',node.ownerDocument);
txn.nodeValue = txn.nodeValue + 'Toggle Dropdown';
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
node = nodes.pop();
node = nodes.pop();
r.domNode = node;
return r;

};
module.exports = r;	});
