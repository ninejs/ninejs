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
node = document.createElement('button');
nodes.push(node);
av = '';
putValue = context['type'];
if (putValue !== undefined){
	av = putValue;

} else {
	av = '';

}
node.setAttribute('type',av);
av = '';
av = av + 'btn ';
putValue = context['class'];
if (av !== ''){
	av = av + ((putValue) || '');

} else {
	av = ((putValue) || '');

}
node.className = av;
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
r.domNode = node;
return r;

};
module.exports = r;	});
