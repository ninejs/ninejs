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
txn.nodeValue = txn.nodeValue + 'var dojoConfig = {				baseUrl : \'../../../../..\',				packages: [					{ name: \'dojo\', location: \'dojo\' },					{ name: \'ninejs\', location: \'ninejs\' }				]			};';
node = nodes.pop();
nodes.push(node);
node = e(node,'script',node.ownerDocument);
av = '';
av = av + '../../../../../dojo/dojo.js';
node.setAttribute('src',av);
node = nodes.pop();
nodes.push(node);
node = e(node,'script',node.ownerDocument);
av = '';
av = av + 'text/javascript';
node.setAttribute('type',av);
txn = t(node,'',node.ownerDocument);
txn.nodeValue = txn.nodeValue + 'require([\'ninejs/ui/utils/setClass\', \'dojo/query\', \'dojo/domReady!\'], function(setClass, query) {				setClass = setClass.default;				query(\'body div\').forEach(function(node) {					setClass(node, \'!hasBorder\');					setClass(node, \'!hasBorder\');					setClass(node, \'otherClass\');					setClass(node, \'otherClass\');					setClass(node, \'otherClass2\');					setClass(node, \'!!\');				});			});';
node = nodes.pop();
nodes.push(node);
node = e(node,'style',node.ownerDocument);
txn = t(node,'',node.ownerDocument);
txn.nodeValue = txn.nodeValue + '.hasBorder {				border-radius: 15px;				width: 500px;				height: 500px;				border-style: solid;			}';
node = nodes.pop();
node = nodes.pop();
nodes.push(node);
node = e(node,'body',node.ownerDocument);
nodes.push(node);
node = e(node,'div',node.ownerDocument);
av = '';
av = av + 'a hasBorder b';
node.className = av;
txn = t(node,'',node.ownerDocument);
txn.nodeValue = txn.nodeValue + 'This is some text';
node = nodes.pop();
nodes.push(node);
node = e(node,'div',node.ownerDocument);
av = '';
av = av + 'hasBorder b';
node.className = av;
txn = t(node,'',node.ownerDocument);
txn.nodeValue = txn.nodeValue + 'This is some text';
node = nodes.pop();
nodes.push(node);
node = e(node,'div',node.ownerDocument);
av = '';
av = av + 'hasBorder';
node.className = av;
txn = t(node,'',node.ownerDocument);
txn.nodeValue = txn.nodeValue + 'This is some text';
node = nodes.pop();
nodes.push(node);
node = e(node,'div',node.ownerDocument);
av = '';
av = av + 'a hasBorder';
node.className = av;
txn = t(node,'',node.ownerDocument);
txn.nodeValue = txn.nodeValue + 'This is some text';
node = nodes.pop();
nodes.push(node);
node = e(node,'div',node.ownerDocument);
av = '';
av = av + 'none';
node.className = av;
txn = t(node,'',node.ownerDocument);
txn.nodeValue = txn.nodeValue + 'This is some text';
node = nodes.pop();
nodes.push(node);
node = e(node,'div',node.ownerDocument);
av = '';
av = av + 'none hasBorder hasBorder hasBorder a';
node.className = av;
txn = t(node,'',node.ownerDocument);
txn.nodeValue = txn.nodeValue + 'This is some text';
node = nodes.pop();
node = nodes.pop();
node = nodes.pop();
r.domNode = node;
return r;

};
module.exports = r;	});
