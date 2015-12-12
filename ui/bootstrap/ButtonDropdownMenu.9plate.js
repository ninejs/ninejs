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
    v,
    _0 = 	function (node) {
/* Here starts a live expression with attribute */ 
av = '';
av = av + 'btn ';
putValue = context['labelClass'];
if (av !== ''){
	av = av + ((putValue) || '');

} else {
	av = ((putValue) || '');

}
av = av + ' dropdown-toggle';
node.className = av;
return node;
/* Here ends the live expression */ 

},
    _1,
    _2;
if (!document){
	document = window.document;

}
node = document.createElement('div');
nodes.push(node);
av = '';
av = av + 'btn-group ButtonDropdownMenu ';
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
_1 = _0(node);
/* Add trigger events here */ 
_2 = 	function () {
	var freeze = {},
	    freezeNode = _1,
	    wfn = 		function (name,oldValue,newValue) {
		var temps = {},
		    p;
		if (!(oldValue === newValue)){
			for (p in freeze){
			if (freeze.hasOwnProperty(p)) {
				temps[p] = context[p];
				context[p] = freeze[p];

			}
			}			_0(freezeNode);
			for (p in freeze){
			if (freeze.hasOwnProperty(p)) {
				context[p] = temps[p];

			}
			}
		}

};
	return wfn;

};
ctxTemp = context;
if (ctxTemp.watch){
	ctxTemp.watch('labelClass',_2());

}
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
nodes.push(node);
node = e(node,'span',node.ownerDocument);
attachTemp = r['labelNode'];
if (attachTemp){
	if (Object.prototype.toString.call(attachTemp) === '[object Array]'){
		attachTemp.push(node);

	} else {
		r['labelNode'] = [attachTemp,node];

	}

} else {
	r['labelNode'] = node;

}
txn = t(node,'',node.ownerDocument);
putValue = context['label'];
if (((putValue !== undefined)) && (putValue !== null)){
	if (putValue['$njsWidget']){
		putValue.show(node);

	} else 	if (putValue.domNode){
		node.appendChild(putValue.domNode);

	}
 else 	if (putValue.tagName){
		node.appendChild(putValue);
		txn = t(node,'',node.ownerDocument);

	}
 else 	if ((putValue !== undefined)){
		txn.nodeValue = txn.nodeValue + ((putValue !== undefined)? putValue:'');

	}


}
node = nodes.pop();
nodes.push(node);
node = e(node,'b',node.ownerDocument);
av = '';
av = av + 'caret';
node.className = av;
node = nodes.pop();
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
