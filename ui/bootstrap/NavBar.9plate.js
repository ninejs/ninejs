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
    _0 = 	function () {
/* Here starts a live expression */ 
node = e(node,'a',node.ownerDocument);
av = '';
av = av + 'navbar-brand';
node.className = av;
av = '';
putValue = context['brandHref'];
if (putValue !== undefined){
	av = putValue;

} else {
	av = '';

}
node.setAttribute('href',av);
attachTemp = r['brandNode'];
if (attachTemp){
	if (Object.prototype.toString.call(attachTemp) === '[object Array]'){
		attachTemp.push(node);

	} else {
		r['brandNode'] = [attachTemp,node];

	}

} else {
	r['brandNode'] = node;

}
txn = t(node,'',node.ownerDocument);
putValue = context['brand'];
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
return node;
/* Here ends the live expression */ 

},
    _1,
    _2;
if (!document){
	document = window.document;

}
node = document.createElement('nav');
nodes.push(node);
av = '';
av = av + 'NavBar navbar ';
putValue = context['navClass'];
if (av !== ''){
	av = av + ((putValue) || '');

} else {
	av = ((putValue) || '');

}
av = av + ' ';
putValue = context['class'];
if (av !== ''){
	av = av + ((putValue) || '');

} else {
	av = ((putValue) || '');

}
av = av + ' vpan12';
node.className = av;
av = '';
putValue = context['role'];
if (putValue !== undefined){
	av = putValue;

} else {
	av = '';

}
node.setAttribute('role',av);
nodes.push(node);
node = e(node,'div',node.ownerDocument);
av = '';
av = av + 'navbar-header ';
putValue = context['headerClass'];
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
av = av + 'navbar-toggle';
node.className = av;
attachTemp = r['barToggle'];
if (attachTemp){
	if (Object.prototype.toString.call(attachTemp) === '[object Array]'){
		attachTemp.push(node);

	} else {
		r['barToggle'] = [attachTemp,node];

	}

} else {
	r['barToggle'] = node;

}
nodes.push(node);
node = e(node,'span',node.ownerDocument);
av = '';
av = av + 'sr-only';
node.className = av;
txn = t(node,'',node.ownerDocument);
txn.nodeValue = txn.nodeValue + 'Toggle navigation';
node = nodes.pop();
nodes.push(node);
node = e(node,'span',node.ownerDocument);
av = '';
av = av + 'icon-bar';
node.className = av;
node = nodes.pop();
nodes.push(node);
node = e(node,'span',node.ownerDocument);
av = '';
av = av + 'icon-bar';
node.className = av;
node = nodes.pop();
nodes.push(node);
node = e(node,'span',node.ownerDocument);
av = '';
av = av + 'icon-bar';
node.className = av;
node = nodes.pop();
node = nodes.pop();
nodes.push(node);
_1 = _0();
/* Add trigger events here */ 
_2 = 	function () {
	var freeze = {},
	    freezeNode = _1,
	    wfn = 		function (name,oldValue,newValue) {
		var temps = {},
		    t,
		    p;
		if (!(oldValue === newValue)){
			for (p in freeze){
			if (freeze.hasOwnProperty(p)) {
				temps[p] = context[p];
				context[p] = freeze[p];

			}
			}			t = _0();
			freezeNode.parentNode.replaceChild(t,freezeNode);
			freezeNode = t;
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
	ctxTemp.watch('brand',_2());

}
node = nodes.pop();
node = nodes.pop();
nodes.push(node);
node = e(node,'div',node.ownerDocument);
av = '';
av = av + 'navbar-collapse collapse ';
putValue = context['navCollapseClass'];
if (av !== ''){
	av = av + ((putValue) || '');

} else {
	av = ((putValue) || '');

}
av = av + ' nav-collapse-scrollable bs-navbar-scroll-collapse navbar-responsive-collapse';
node.className = av;
attachTemp = r['collapseTarget'];
if (attachTemp){
	if (Object.prototype.toString.call(attachTemp) === '[object Array]'){
		attachTemp.push(node);

	} else {
		r['collapseTarget'] = [attachTemp,node];

	}

} else {
	r['collapseTarget'] = node;

}
nodes.push(node);
node = e(node,'ul',node.ownerDocument);
av = '';
av = av + 'nav navbar-nav  ';
putValue = context['navContainerClass'];
if (av !== ''){
	av = av + ((putValue) || '');

} else {
	av = ((putValue) || '');

}
node.className = av;
attachTemp = r['itemContainer'];
if (attachTemp){
	if (Object.prototype.toString.call(attachTemp) === '[object Array]'){
		attachTemp.push(node);

	} else {
		r['itemContainer'] = [attachTemp,node];

	}

} else {
	r['itemContainer'] = node;

}
node = nodes.pop();
node = nodes.pop();
node = nodes.pop();
r.domNode = node;
return r;

};
module.exports = r;	});
