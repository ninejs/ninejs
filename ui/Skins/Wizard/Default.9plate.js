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
av = av + 'njsWizard container ';
putValue = context['class'];
if (av !== ''){
	av = av + ((putValue) || '');

} else {
	av = ((putValue) || '');

}
node.className = av;
nodes.push(node);
node = e(node,'div',node.ownerDocument);
av = '';
av = av + 'row col-lg-12';
node.className = av;
nodes.push(node);
node = e(node,'div',node.ownerDocument);
av = '';
av = av + 'col-lg-2 njsSteps';
node.className = av;
attachTemp = r['stepsNode'];
if (attachTemp){
	if (Object.prototype.toString.call(attachTemp) === '[object Array]'){
		attachTemp.push(node);

	} else {
		r['stepsNode'] = [attachTemp,node];

	}

} else {
	r['stepsNode'] = node;

}
node = nodes.pop();
nodes.push(node);
node = e(node,'div',node.ownerDocument);
av = '';
av = av + 'col-lg-10 njsTransitionPanelContainer';
node.className = av;
attachTemp = r['containerNode'];
if (attachTemp){
	if (Object.prototype.toString.call(attachTemp) === '[object Array]'){
		attachTemp.push(node);

	} else {
		r['containerNode'] = [attachTemp,node];

	}

} else {
	r['containerNode'] = node;

}
node = nodes.pop();
node = nodes.pop();
nodes.push(node);
node = e(node,'div',node.ownerDocument);
av = '';
av = av + 'row col-lg-12 buttonsHolder';
node.className = av;
nodes.push(node);
node = e(node,'div',node.ownerDocument);
av = '';
av = av + 'col-lg-2';
node.className = av;
txn = t(node,'',node.ownerDocument);
putValue = context['helpButton'];
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
node = e(node,'div',node.ownerDocument);
av = '';
av = av + 'col-lg-6 col-lg-offset-4';
node.className = av;
txn = t(node,'',node.ownerDocument);
putValue = context['previousButton'];
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
txn.nodeValue = txn.nodeValue + '			';
putValue = context['nextButton'];
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
txn.nodeValue = txn.nodeValue + '			';
putValue = context['finishButton'];
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
txn.nodeValue = txn.nodeValue + '			';
putValue = context['cancelButton'];
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
node = nodes.pop();
node = nodes.pop();
r.domNode = node;
return r;

};
module.exports = r;	});
