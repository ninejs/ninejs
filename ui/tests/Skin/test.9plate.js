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
node = document.createElement('html');
nodes.push(node);
nodes.push(node);
node = e(node,'head',node.ownerDocument);
nodes.push(node);
node = e(node,'script',node.ownerDocument);
txn = t(node,'',node.ownerDocument);
txn.nodeValue = txn.nodeValue + 'var dojoConfig = {				baseUrl : \'../../../..\',				packages: [					{ name: \'dojo\', location: \'dojo\' },					{ name: \'ninejs\', location: \'ninejs\' }				]			};';
node = nodes.pop();
nodes.push(node);
node = e(node,'script',node.ownerDocument);
av = '';
av = av + '../../../../dojo/dojo.js';
node.setAttribute('src',av);
node = nodes.pop();
nodes.push(node);
node = e(node,'script',node.ownerDocument);
av = '';
av = av + 'text/javascript';
node.setAttribute('type',av);
txn = t(node,'',node.ownerDocument);
txn.nodeValue = txn.nodeValue + 'require([\'ninejs/ui/Widget\', \'ninejs/ui/Skin\', \'ninejs/nineplate\', \'ninejs/css\', \'dojo/has\'], function(Widget, Skin, nineplate, css, has) {				Widget = Widget.default;				Skin = Skin.default;				var ieTemplate = nineplate.buildTemplate(\'';
nodes.push(node);
node = e(node,'div',node.ownerDocument);
nodes.push(node);
node = e(node,'span',node.ownerDocument);
txn = t(node,'',node.ownerDocument);
txn.nodeValue = txn.nodeValue + 'This is being shown in IE';
node = nodes.pop();
node = nodes.pop();
txn = t(node,'',node.ownerDocument);
txn.nodeValue = txn.nodeValue + '\');				var otherTemplate = nineplate.buildTemplate(\'';
nodes.push(node);
node = e(node,'div',node.ownerDocument);
nodes.push(node);
node = e(node,'span',node.ownerDocument);
txn = t(node,'',node.ownerDocument);
txn.nodeValue = txn.nodeValue + 'This is being shown in another browser';
node = nodes.pop();
node = nodes.pop();
txn = t(node,'',node.ownerDocument);
txn.nodeValue = txn.nodeValue + '\');				var skin1 = new Skin({ template: ieTemplate.compileDom(), applies: function() {					return has(\'ie\');				}});				var skin2 = new Skin({ template: otherTemplate.compileDom() });				var widget1 = new Widget({					skin: [skin1, skin2]				});				widget1.show();				setTimeout(function() {					document.getElementById(\'target\').appendChild(widget1.domNode);				});			});';
node = nodes.pop();
node = nodes.pop();
nodes.push(node);
node = e(node,'body',node.ownerDocument);
nodes.push(node);
node = e(node,'div',node.ownerDocument);
av = '';
av = av + 'target';
node.setAttribute('id',av);
node = nodes.pop();
node = nodes.pop();
node = nodes.pop();
r.domNode = node;
return r;

};
module.exports = r;	});
