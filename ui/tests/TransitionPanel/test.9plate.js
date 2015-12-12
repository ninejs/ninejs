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
txn.nodeValue = txn.nodeValue + 'require([\'ninejs/ui/TransitionPanel\', \'ninejs/ui/Skin\', \'ninejs/nineplate\', \'ninejs/core/on\', \'dojo/domReady!\'], function(TransitionPanel, Skin, nineplate, on) {				TransitionPanel = TransitionPanel.default;				Skin = Skin.default;				on = on.default;				var firstStepTemplate = nineplate.buildTemplate(\'';
nodes.push(node);
node = e(node,'div',node.ownerDocument);
av = '';
av = av + 'target';
node.setAttribute('id',av);
av = '';
av = av + 'block';
node.className = av;
txn = t(node,'',node.ownerDocument);
txn.nodeValue = txn.nodeValue + 'This is a text that is about to be transitioned with the panel';
node = nodes.pop();
txn = t(node,'',node.ownerDocument);
txn.nodeValue = txn.nodeValue + '\');				var template = nineplate.buildTemplate(\'';
nodes.push(node);
node = e(node,'div',node.ownerDocument);
av = '';
av = av + 'block';
node.className = av;
nodes.push(node);
node = e(node,'span',node.ownerDocument);
txn = t(node,'',node.ownerDocument);
txn.nodeValue = txn.nodeValue + 'This is being shown in a TransitionPanel';
node = nodes.pop();
node = nodes.pop();
txn = t(node,'',node.ownerDocument);
txn.nodeValue = txn.nodeValue + '\');				var firstStepSkin = new Skin({					template: firstStepTemplate.compileDom()				});				var skin1 = new Skin({					template: template.compileDom()				});				var firstStep = new TransitionPanel({					skin: firstStepSkin				});				firstStep.show(window.document.getElementById(\'container\'));				var panel = new TransitionPanel({					previousPanel: firstStep,					skin: skin1				});				var currentPanel = firstStep;				on(window.document.getElementById(\'transitionButton\'), \'click\', function() {					currentPanel = currentPanel.next();				});				on(window.document.getElementById(\'transitionOutButton\'), \'click\', function() {					currentPanel = currentPanel.previous();				});			});';
node = nodes.pop();
nodes.push(node);
node = e(node,'style',node.ownerDocument);
txn = t(node,'',node.ownerDocument);
txn.nodeValue = txn.nodeValue + '#container {				width: 500px;				height: 500px;			}			.block {				border-radius: 15px;				width: 494px;				height: 494px;				border-style: solid;			}			button {							}';
node = nodes.pop();
node = nodes.pop();
nodes.push(node);
node = e(node,'body',node.ownerDocument);
nodes.push(node);
node = e(node,'div',node.ownerDocument);
av = '';
av = av + 'container';
node.setAttribute('id',av);
av = '';
av = av + 'njsTransitionPanelContainer';
node.className = av;
node = nodes.pop();
nodes.push(node);
node = e(node,'button',node.ownerDocument);
av = '';
av = av + 'transitionOutButton';
node.setAttribute('id',av);
txn = t(node,'',node.ownerDocument);
txn.nodeValue = txn.nodeValue + 'Previous';
node = nodes.pop();
nodes.push(node);
node = e(node,'button',node.ownerDocument);
av = '';
av = av + 'transitionButton';
node.setAttribute('id',av);
txn = t(node,'',node.ownerDocument);
txn.nodeValue = txn.nodeValue + 'Next';
node = nodes.pop();
node = nodes.pop();
node = nodes.pop();
r.domNode = node;
return r;

};
module.exports = r;	});
