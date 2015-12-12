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
putValue = context['baseClass'];
if (putValue !== undefined){
	av = putValue;

} else {
	av = '';

}
node.className = av;
nodes.push(node);
node = e(node,'div',node.ownerDocument);
av = '';
av = av + 'nineFbPanelCaption';
node.className = av;
nodes.push(node);
node = e(node,'div',node.ownerDocument);
av = '';
av = av + 'nineCloseIcon';
node.className = av;
attachTemp = r['closeIcon'];
if (attachTemp){
	if (Object.prototype.toString.call(attachTemp) === '[object Array]'){
		attachTemp.push(node);

	} else {
		r['closeIcon'] = [attachTemp,node];

	}

} else {
	r['closeIcon'] = node;

}
node = nodes.pop();
nodes.push(node);
node = e(node,'div',node.ownerDocument);
av = '';
av = av + 'nineRightSpacer';
node.className = av;
node = nodes.pop();
nodes.push(node);
node = e(node,'div',node.ownerDocument);
av = '';
av = av + 'nineHelpIcon';
node.className = av;
attachTemp = r['helpIcon'];
if (attachTemp){
	if (Object.prototype.toString.call(attachTemp) === '[object Array]'){
		attachTemp.push(node);

	} else {
		r['helpIcon'] = [attachTemp,node];

	}

} else {
	r['helpIcon'] = node;

}
node = nodes.pop();
node = nodes.pop();
nodes.push(node);
node = e(node,'div',node.ownerDocument);
nodes.push(node);
node = e(node,'div',node.ownerDocument);
nodes.push(node);
node = e(node,'span',node.ownerDocument);
av = '';
av = av + 'nineAdvancedOptionsTitle';
node.className = av;
attachTemp = r['titleNode'];
if (attachTemp){
	if (Object.prototype.toString.call(attachTemp) === '[object Array]'){
		attachTemp.push(node);

	} else {
		r['titleNode'] = [attachTemp,node];

	}

} else {
	r['titleNode'] = node;

}
node = nodes.pop();
node = nodes.pop();
nodes.push(node);
node = e(node,'div',node.ownerDocument);
av = '';
av = av + 'nineFbPadding';
node.className = av;
nodes.push(node);
node = e(node,'span',node.ownerDocument);
av = '';
av = av + 'nineAdvancedOptionsMessage';
node.className = av;
attachTemp = r['messageNode'];
if (attachTemp){
	if (Object.prototype.toString.call(attachTemp) === '[object Array]'){
		attachTemp.push(node);

	} else {
		r['messageNode'] = [attachTemp,node];

	}

} else {
	r['messageNode'] = node;

}
node = nodes.pop();
node = nodes.pop();
nodes.push(node);
node = e(node,'div',node.ownerDocument);
av = '';
av = av + 'nineFbPadding';
node.className = av;
nodes.push(node);
node = e(node,'fieldset',node.ownerDocument);
av = '';
av = av + 'nineAdvancedOptionsGroupBox';
node.className = av;
nodes.push(node);
node = e(node,'legend',node.ownerDocument);
attachTemp = r['conditionEvaluationMessageNode'];
if (attachTemp){
	if (Object.prototype.toString.call(attachTemp) === '[object Array]'){
		attachTemp.push(node);

	} else {
		r['conditionEvaluationMessageNode'] = [attachTemp,node];

	}

} else {
	r['conditionEvaluationMessageNode'] = node;

}
node = nodes.pop();
nodes.push(node);
node = e(node,'div',node.ownerDocument);
av = '';
av = av + 'nineFbPadding';
node.className = av;
nodes.push(node);
node = e(node,'span',node.ownerDocument);
av = '';
av = av + 'nineAdvancedOptionsMessage';
node.className = av;
attachTemp = r['conditionEvaluationDescriptionNode'];
if (attachTemp){
	if (Object.prototype.toString.call(attachTemp) === '[object Array]'){
		attachTemp.push(node);

	} else {
		r['conditionEvaluationDescriptionNode'] = [attachTemp,node];

	}

} else {
	r['conditionEvaluationDescriptionNode'] = node;

}
node = nodes.pop();
node = nodes.pop();
nodes.push(node);
node = e(node,'div',node.ownerDocument);
nodes.push(node);
node = e(node,'div',node.ownerDocument);
attachTemp = r['trueRbNode'];
if (attachTemp){
	if (Object.prototype.toString.call(attachTemp) === '[object Array]'){
		attachTemp.push(node);

	} else {
		r['trueRbNode'] = [attachTemp,node];

	}

} else {
	r['trueRbNode'] = node;

}
node = nodes.pop();
nodes.push(node);
node = e(node,'label',node.ownerDocument);
av = '';
av = av + 'nineFbHorizontalRb';
node.className = av;
attachTemp = r['trueNode'];
if (attachTemp){
	if (Object.prototype.toString.call(attachTemp) === '[object Array]'){
		attachTemp.push(node);

	} else {
		r['trueNode'] = [attachTemp,node];

	}

} else {
	r['trueNode'] = node;

}
node = nodes.pop();
nodes.push(node);
node = e(node,'div',node.ownerDocument);
attachTemp = r['falseRbNode'];
if (attachTemp){
	if (Object.prototype.toString.call(attachTemp) === '[object Array]'){
		attachTemp.push(node);

	} else {
		r['falseRbNode'] = [attachTemp,node];

	}

} else {
	r['falseRbNode'] = node;

}
node = nodes.pop();
nodes.push(node);
node = e(node,'label',node.ownerDocument);
av = '';
av = av + 'nineFbHorizontalRb';
node.className = av;
attachTemp = r['falseNode'];
if (attachTemp){
	if (Object.prototype.toString.call(attachTemp) === '[object Array]'){
		attachTemp.push(node);

	} else {
		r['falseNode'] = [attachTemp,node];

	}

} else {
	r['falseNode'] = node;

}
node = nodes.pop();
nodes.push(node);
node = e(node,'div',node.ownerDocument);
attachTemp = r['customRbNode'];
if (attachTemp){
	if (Object.prototype.toString.call(attachTemp) === '[object Array]'){
		attachTemp.push(node);

	} else {
		r['customRbNode'] = [attachTemp,node];

	}

} else {
	r['customRbNode'] = node;

}
node = nodes.pop();
nodes.push(node);
node = e(node,'label',node.ownerDocument);
av = '';
av = av + 'nineFbHorizontalRb';
node.className = av;
attachTemp = r['customNode'];
if (attachTemp){
	if (Object.prototype.toString.call(attachTemp) === '[object Array]'){
		attachTemp.push(node);

	} else {
		r['customNode'] = [attachTemp,node];

	}

} else {
	r['customNode'] = node;

}
node = nodes.pop();
node = nodes.pop();
node = nodes.pop();
node = nodes.pop();
nodes.push(node);
node = e(node,'div',node.ownerDocument);
av = '';
av = av + 'nineFbPadding';
node.className = av;
nodes.push(node);
node = e(node,'fieldset',node.ownerDocument);
av = '';
av = av + 'nineAdvancedOptionsGroupBox';
node.className = av;
nodes.push(node);
node = e(node,'legend',node.ownerDocument);
attachTemp = r['conditionModeMessageNode'];
if (attachTemp){
	if (Object.prototype.toString.call(attachTemp) === '[object Array]'){
		attachTemp.push(node);

	} else {
		r['conditionModeMessageNode'] = [attachTemp,node];

	}

} else {
	r['conditionModeMessageNode'] = node;

}
node = nodes.pop();
nodes.push(node);
node = e(node,'div',node.ownerDocument);
nodes.push(node);
node = e(node,'div',node.ownerDocument);
attachTemp = r['stepByStepRbNode'];
if (attachTemp){
	if (Object.prototype.toString.call(attachTemp) === '[object Array]'){
		attachTemp.push(node);

	} else {
		r['stepByStepRbNode'] = [attachTemp,node];

	}

} else {
	r['stepByStepRbNode'] = node;

}
node = nodes.pop();
nodes.push(node);
node = e(node,'label',node.ownerDocument);
attachTemp = r['strictNode'];
if (attachTemp){
	if (Object.prototype.toString.call(attachTemp) === '[object Array]'){
		attachTemp.push(node);

	} else {
		r['strictNode'] = [attachTemp,node];

	}

} else {
	r['strictNode'] = node;

}
node = nodes.pop();
nodes.push(node);
node = e(node,'div',node.ownerDocument);
av = '';
av = av + 'nineFbAdvancedRbOption';
node.className = av;
nodes.push(node);
node = e(node,'label',node.ownerDocument);
attachTemp = r['stepByStepDescriptionNode'];
if (attachTemp){
	if (Object.prototype.toString.call(attachTemp) === '[object Array]'){
		attachTemp.push(node);

	} else {
		r['stepByStepDescriptionNode'] = [attachTemp,node];

	}

} else {
	r['stepByStepDescriptionNode'] = node;

}
node = nodes.pop();
node = nodes.pop();
node = nodes.pop();
nodes.push(node);
node = e(node,'div',node.ownerDocument);
nodes.push(node);
node = e(node,'div',node.ownerDocument);
attachTemp = r['advancedModeRbNode'];
if (attachTemp){
	if (Object.prototype.toString.call(attachTemp) === '[object Array]'){
		attachTemp.push(node);

	} else {
		r['advancedModeRbNode'] = [attachTemp,node];

	}

} else {
	r['advancedModeRbNode'] = node;

}
node = nodes.pop();
nodes.push(node);
node = e(node,'label',node.ownerDocument);
attachTemp = r['unrestrictedNode'];
if (attachTemp){
	if (Object.prototype.toString.call(attachTemp) === '[object Array]'){
		attachTemp.push(node);

	} else {
		r['unrestrictedNode'] = [attachTemp,node];

	}

} else {
	r['unrestrictedNode'] = node;

}
node = nodes.pop();
nodes.push(node);
node = e(node,'div',node.ownerDocument);
av = '';
av = av + 'nineFbAdvancedRbOption';
node.className = av;
nodes.push(node);
node = e(node,'label',node.ownerDocument);
attachTemp = r['advancedModeDescriptionNode'];
if (attachTemp){
	if (Object.prototype.toString.call(attachTemp) === '[object Array]'){
		attachTemp.push(node);

	} else {
		r['advancedModeDescriptionNode'] = [attachTemp,node];

	}

} else {
	r['advancedModeDescriptionNode'] = node;

}
node = nodes.pop();
node = nodes.pop();
node = nodes.pop();
node = nodes.pop();
node = nodes.pop();
node = nodes.pop();
node = nodes.pop();
r.domNode = node;
return r;

};
module.exports = r;	});
