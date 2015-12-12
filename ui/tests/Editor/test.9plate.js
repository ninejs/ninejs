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
node = e(node,'style',node.ownerDocument);
node = nodes.pop();
node = nodes.pop();
nodes.push(node);
node = e(node,'body',node.ownerDocument);
nodes.push(node);
node = e(node,'div',node.ownerDocument);
av = '';
av = av + 'textEditor';
node.setAttribute('id',av);
node = nodes.pop();
nodes.push(node);
node = e(node,'div',node.ownerDocument);
av = '';
av = av + 'numberEditor';
node.setAttribute('id',av);
node = nodes.pop();
nodes.push(node);
node = e(node,'div',node.ownerDocument);
av = '';
av = av + 'dateEditor';
node.setAttribute('id',av);
node = nodes.pop();
nodes.push(node);
node = e(node,'div',node.ownerDocument);
av = '';
av = av + 'timeEditor';
node.setAttribute('id',av);
node = nodes.pop();
nodes.push(node);
node = e(node,'div',node.ownerDocument);
av = '';
av = av + 'listEditor';
node.setAttribute('id',av);
node = nodes.pop();
nodes.push(node);
node = e(node,'script',node.ownerDocument);
av = '';
av = av + 'text/javascript';
node.setAttribute('type',av);
txn = t(node,'',node.ownerDocument);
txn.nodeValue = txn.nodeValue + 'require([\'ninejs/ui/Editor\'], function(Editor) {				Editor = Editor.default;				setTimeout(function() {					var textEditor = new Editor({ dataType: \'alphanumeric\' }),						numberEditor = new Editor({ dataType: \'integer\' }),						dateEditor = new Editor({ dataType: \'date\' }),						timeEditor = new Editor({ dataType: \'time\' }),						listEditor = new Editor({ dataType: \'list\', options: [\'first\', \'second\', \'third\'] });					textEditor.show(\'textEditor\');					numberEditor.show(\'numberEditor\');					dateEditor.show(\'dateEditor\');					timeEditor.show(\'timeEditor\');					listEditor.show(\'listEditor\');				});			});';
node = nodes.pop();
node = nodes.pop();
node = nodes.pop();
r.domNode = node;
return r;

};
module.exports = r;	});
