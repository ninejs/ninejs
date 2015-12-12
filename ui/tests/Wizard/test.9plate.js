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
txn.nodeValue = txn.nodeValue + 'require([\'ninejs/ui/Wizard\', \'ninejs/ui/TransitionPanel\', \'ninejs/nineplate\', \'ninejs/ui/Skin\', \'dojo/domReady!\'], function(Wizard, TransitionPanel, nineplate, Skin) {				TransitionPanel = TransitionPanel.default;				Skin = Skin.default;				var wizard = new Wizard();				var step1 = new TransitionPanel({					skin: new Skin({						template: nineplate.buildTemplate(\'';
nodes.push(node);
node = e(node,'div',node.ownerDocument);
txn = t(node,'',node.ownerDocument);
txn.nodeValue = txn.nodeValue + 'Configure your step 1';
node = nodes.pop();
txn = t(node,'',node.ownerDocument);
txn.nodeValue = txn.nodeValue + '\').compileDom()					}),					label: \'Step 1\'				});				var step2 = new TransitionPanel({					skin: new Skin({						template: nineplate.buildTemplate(\'';
nodes.push(node);
node = e(node,'div',node.ownerDocument);
txn = t(node,'',node.ownerDocument);
txn.nodeValue = txn.nodeValue + 'Configure your step 2';
node = nodes.pop();
txn = t(node,'',node.ownerDocument);
txn.nodeValue = txn.nodeValue + '\').compileDom()					}),					label: \'Step 2\'				});				var step1_5 = new TransitionPanel({					skin: new Skin({						template: nineplate.buildTemplate(\'';
nodes.push(node);
node = e(node,'div',node.ownerDocument);
txn = t(node,'',node.ownerDocument);
txn.nodeValue = txn.nodeValue + 'Configure your step 1.5';
node = nodes.pop();
txn = t(node,'',node.ownerDocument);
txn.nodeValue = txn.nodeValue + '\').compileDom()					}),					label: \'Step 1.5\'				});				wizard.addStep(step1);				wizard.addStep(step2);				wizard.addStep(step1_5, step2);				wizard.show(window.document.body);			});';
node = nodes.pop();
nodes.push(node);
node = e(node,'style',node.ownerDocument);
node = nodes.pop();
node = nodes.pop();
nodes.push(node);
node = e(node,'body',node.ownerDocument);
node = nodes.pop();
node = nodes.pop();
r.domNode = node;
return r;

};
module.exports = r;	});
