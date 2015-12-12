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
av = av + 'weFilterBuilder mainNode';
node.className = av;
av = '';
av = av + '{id}';
node.setAttribute('id',av);
nodes.push(node);
node = e(node,'div',node.ownerDocument);
av = '';
av = av + 'weFilterBuilder mainToolBar';
node.className = av;
attachTemp = r['defaultToolbarNode'];
if (attachTemp){
	if (Object.prototype.toString.call(attachTemp) === '[object Array]'){
		attachTemp.push(node);

	} else {
		r['defaultToolbarNode'] = [attachTemp,node];

	}

} else {
	r['defaultToolbarNode'] = node;

}
node = nodes.pop();
nodes.push(node);
node = e(node,'div',node.ownerDocument);
av = '';
av = av + 'weFilterBuilder mainContent';
node.className = av;
nodes.push(node);
node = e(node,'div',node.ownerDocument);
av = '';
av = av + 'weFilterBuilder singleExpressionHolder';
node.className = av;
attachTemp = r['singleExpressionHolderNode'];
if (attachTemp){
	if (Object.prototype.toString.call(attachTemp) === '[object Array]'){
		attachTemp.push(node);

	} else {
		r['singleExpressionHolderNode'] = [attachTemp,node];

	}

} else {
	r['singleExpressionHolderNode'] = node;

}
nodes.push(node);
node = e(node,'div',node.ownerDocument);
av = '';
av = av + 'weFilterBuilder checkBoxHolder';
node.className = av;
attachTemp = r['checkBoxHolderNode'];
if (attachTemp){
	if (Object.prototype.toString.call(attachTemp) === '[object Array]'){
		attachTemp.push(node);

	} else {
		r['checkBoxHolderNode'] = [attachTemp,node];

	}

} else {
	r['checkBoxHolderNode'] = node;

}
nodes.push(node);
node = e(node,'div',node.ownerDocument);
attachTemp = r['checkBoxNode'];
if (attachTemp){
	if (Object.prototype.toString.call(attachTemp) === '[object Array]'){
		attachTemp.push(node);

	} else {
		r['checkBoxNode'] = [attachTemp,node];

	}

} else {
	r['checkBoxNode'] = node;

}
node = nodes.pop();
node = nodes.pop();
nodes.push(node);
node = e(node,'div',node.ownerDocument);
av = '';
av = av + 'weFilterBuilder summaryListHolder';
node.className = av;
attachTemp = r['summaryListHolderNode'];
if (attachTemp){
	if (Object.prototype.toString.call(attachTemp) === '[object Array]'){
		attachTemp.push(node);

	} else {
		r['summaryListHolderNode'] = [attachTemp,node];

	}

} else {
	r['summaryListHolderNode'] = node;

}
nodes.push(node);
node = e(node,'div',node.ownerDocument);
attachTemp = r['selectedSummarySelectNode'];
if (attachTemp){
	if (Object.prototype.toString.call(attachTemp) === '[object Array]'){
		attachTemp.push(node);

	} else {
		r['selectedSummarySelectNode'] = [attachTemp,node];

	}

} else {
	r['selectedSummarySelectNode'] = node;

}
node = nodes.pop();
node = nodes.pop();
nodes.push(node);
node = e(node,'div',node.ownerDocument);
av = '';
av = av + 'weFilterBuilder fieldListHolder';
node.className = av;
attachTemp = r['fieldListHolderNode'];
if (attachTemp){
	if (Object.prototype.toString.call(attachTemp) === '[object Array]'){
		attachTemp.push(node);

	} else {
		r['fieldListHolderNode'] = [attachTemp,node];

	}

} else {
	r['fieldListHolderNode'] = node;

}
av = '';
av = av + 'display: none; opacity: 0';
node.setAttribute('style',av);
nodes.push(node);
node = e(node,'div',node.ownerDocument);
av = '';
av = av + 'fieldSelectHolder';
node.className = av;
attachTemp = r['selectedFieldSelectNode'];
if (attachTemp){
	if (Object.prototype.toString.call(attachTemp) === '[object Array]'){
		attachTemp.push(node);

	} else {
		r['selectedFieldSelectNode'] = [attachTemp,node];

	}

} else {
	r['selectedFieldSelectNode'] = node;

}
node = nodes.pop();
nodes.push(node);
node = e(node,'div',node.ownerDocument);
av = '';
av = av + 'funnelHolder';
node.className = av;
nodes.push(node);
node = e(node,'div',node.ownerDocument);
attachTemp = r['funnelNode'];
if (attachTemp){
	if (Object.prototype.toString.call(attachTemp) === '[object Array]'){
		attachTemp.push(node);

	} else {
		r['funnelNode'] = [attachTemp,node];

	}

} else {
	r['funnelNode'] = node;

}
node = nodes.pop();
node = nodes.pop();
node = nodes.pop();
nodes.push(node);
node = e(node,'div',node.ownerDocument);
av = '';
av = av + 'weFilterBuilder operatorListHolder';
node.className = av;
attachTemp = r['operatorListHolder'];
if (attachTemp){
	if (Object.prototype.toString.call(attachTemp) === '[object Array]'){
		attachTemp.push(node);

	} else {
		r['operatorListHolder'] = [attachTemp,node];

	}

} else {
	r['operatorListHolder'] = node;

}
av = '';
av = av + 'display: none; opacity: 0';
node.setAttribute('style',av);
nodes.push(node);
node = e(node,'div',node.ownerDocument);
attachTemp = r['selectedOperatorSelectNode'];
if (attachTemp){
	if (Object.prototype.toString.call(attachTemp) === '[object Array]'){
		attachTemp.push(node);

	} else {
		r['selectedOperatorSelectNode'] = [attachTemp,node];

	}

} else {
	r['selectedOperatorSelectNode'] = node;

}
node = nodes.pop();
node = nodes.pop();
nodes.push(node);
node = e(node,'div',node.ownerDocument);
av = '';
av = av + 'weFilterBuilder valueListHolder';
node.className = av;
attachTemp = r['valueListHolder'];
if (attachTemp){
	if (Object.prototype.toString.call(attachTemp) === '[object Array]'){
		attachTemp.push(node);

	} else {
		r['valueListHolder'] = [attachTemp,node];

	}

} else {
	r['valueListHolder'] = node;

}
av = '';
av = av + 'display: none; opacity: 0';
node.setAttribute('style',av);
nodes.push(node);
node = e(node,'div',node.ownerDocument);
attachTemp = r['selectedValueSelectNode'];
if (attachTemp){
	if (Object.prototype.toString.call(attachTemp) === '[object Array]'){
		attachTemp.push(node);

	} else {
		r['selectedValueSelectNode'] = [attachTemp,node];

	}

} else {
	r['selectedValueSelectNode'] = node;

}
node = nodes.pop();
node = nodes.pop();
nodes.push(node);
node = e(node,'div',node.ownerDocument);
av = '';
av = av + 'weFilterBuilder deleteButtonHolder';
node.className = av;
attachTemp = r['deleteButtonHolderNode'];
if (attachTemp){
	if (Object.prototype.toString.call(attachTemp) === '[object Array]'){
		attachTemp.push(node);

	} else {
		r['deleteButtonHolderNode'] = [attachTemp,node];

	}

} else {
	r['deleteButtonHolderNode'] = node;

}
nodes.push(node);
node = e(node,'span',node.ownerDocument);
av = '';
av = av + 'weFilterBuilder negativeButton';
node.className = av;
attachTemp = r['negativeButtonNode'];
if (attachTemp){
	if (Object.prototype.toString.call(attachTemp) === '[object Array]'){
		attachTemp.push(node);

	} else {
		r['negativeButtonNode'] = [attachTemp,node];

	}

} else {
	r['negativeButtonNode'] = node;

}
av = '';
av = av + 'onclick: _onNegativeButtonClick';
node.setAttribute('data-dojo-attach-event',av);
av = '';
av = av + 'javascript:;';
node.setAttribute('href',av);
node = nodes.pop();
nodes.push(node);
node = e(node,'span',node.ownerDocument);
av = '';
av = av + 'weFilterBuilder resetButton';
node.className = av;
attachTemp = r['resetButtonNode'];
if (attachTemp){
	if (Object.prototype.toString.call(attachTemp) === '[object Array]'){
		attachTemp.push(node);

	} else {
		r['resetButtonNode'] = [attachTemp,node];

	}

} else {
	r['resetButtonNode'] = node;

}
av = '';
av = av + 'onclick: _onResetButtonClick';
node.setAttribute('data-dojo-attach-event',av);
av = '';
av = av + 'javascript:;';
node.setAttribute('href',av);
node = nodes.pop();
nodes.push(node);
node = e(node,'span',node.ownerDocument);
av = '';
av = av + 'weFilterBuilder deleteButton';
node.className = av;
attachTemp = r['deleteButtonNode'];
if (attachTemp){
	if (Object.prototype.toString.call(attachTemp) === '[object Array]'){
		attachTemp.push(node);

	} else {
		r['deleteButtonNode'] = [attachTemp,node];

	}

} else {
	r['deleteButtonNode'] = node;

}
av = '';
av = av + 'onclick: _onDeleteButtonClick';
node.setAttribute('data-dojo-attach-event',av);
av = '';
av = av + 'javascript:;';
node.setAttribute('href',av);
node = nodes.pop();
node = nodes.pop();
nodes.push(node);
node = e(node,'div',node.ownerDocument);
av = '';
av = av + 'weFilterBuilder addExpressionButtonHolder';
node.className = av;
attachTemp = r['addExpressionButtonSingleNode'];
if (attachTemp){
	if (Object.prototype.toString.call(attachTemp) === '[object Array]'){
		attachTemp.push(node);

	} else {
		r['addExpressionButtonSingleNode'] = [attachTemp,node];

	}

} else {
	r['addExpressionButtonSingleNode'] = node;

}
node = nodes.pop();
node = nodes.pop();
nodes.push(node);
node = e(node,'div',node.ownerDocument);
av = '';
av = av + 'weFilterBuilder multiExpressionHolder';
node.className = av;
attachTemp = r['multiExpressionHolderNode'];
if (attachTemp){
	if (Object.prototype.toString.call(attachTemp) === '[object Array]'){
		attachTemp.push(node);

	} else {
		r['multiExpressionHolderNode'] = [attachTemp,node];

	}

} else {
	r['multiExpressionHolderNode'] = node;

}
node = nodes.pop();
node = nodes.pop();
node = nodes.pop();
r.domNode = node;
return r;

};
module.exports = r;	});
