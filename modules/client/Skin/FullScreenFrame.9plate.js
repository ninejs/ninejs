(function (factory) {
					if (typeof module === 'object' && typeof module.exports === 'object') { 

						var v = factory(require, exports); if (v !== undefined) module.exports = v; 

					} 

					else if (typeof define === 'function' && define.amd) { 

						define(['require', 'module', 'ninejs/_nineplate/utils/functions'], factory); 

					} 

				})(function (require, module) {
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
av = av + 'njsFullScreenFrame col-max ';
putValue = context['frameMode'];
if (av !== ''){
	av = av + ((putValue) || '');

} else {
	av = ((putValue) || '');

}
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
	ctxTemp.watch('frameMode',_2());

}
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
r.domNode = node;
return r;

};
module.exports = r;	});
