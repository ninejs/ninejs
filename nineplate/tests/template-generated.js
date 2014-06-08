define([], function() {
/* jshint -W074 */
/* globals window: true */
'use strict';
var r = function anonymous(context,document) {
'use strict';
var fn = {t:function (e, text, doc) {
			return e.appendChild(doc.createTextNode(text));
		},e:function (e, name, doc) {
			var node = doc.createElement(name);
			e.insertAdjacentElement('beforeEnd', node);
			return node;
		},tst:function () {
			/* global window */
			return (window.document.body.insertAdjacentElement);
		},ae:function (e, name, doc) {
			var node = doc.createElement(name);
			e.appendChild(node);
			return node;
		}},
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
    a = fn.a,
    t = fn.t,
    av,
    result,
    v,
    _0 = 	function (context) {
	var arr,
	    temp,
	    cnt,
	    ident = 'person';
	temp = context[ident];
	arr = (context['persons']) || [];
	for ((cnt = 0); cnt < arr.length; (cnt = cnt + 1)){
		context[ident] = arr[cnt];
		nodes.push(node);
		node = e(node,'div',node.ownerDocument);
		txn = t(node,'',node.ownerDocument);
		putValue = context['person']['name'];
		if (((putValue !== undefined)) && (putValue !== null)){
			if (putValue['$njsWidget']){
				putValue.show(node);

			} else 			if (putValue.domNode){
				node.appendChild(putValue.domNode);

			}
 else 			if (putValue.tagName){
				node.appendChild(putValue);
				txn = t(node,'',node.ownerDocument);

			}
 else 			if ((putValue !== undefined)){
				txn.nodeValue = txn.nodeValue + ((putValue !== undefined)? putValue:'');

			}


		}
		node = nodes.pop();
		txn = t(node,'',node.ownerDocument);

	}	context.ident = temp;

},
    _1 = 	function (node) {
/* Here starts a live expression with attribute */ 
av = '';
putValue = context['liveChanges']['val'];
if (av !== ''){
	av = av + ((putValue) || '');

} else {
	av = ((putValue) || '');

}
node.setAttribute('data-value',av);
return node;
/* Here ends the live expression */ 

},
    _2,
    _3,
    _4 = 	function () {
/* Here starts a live expression */ 
node = e(node,'div',node.ownerDocument);
av = '';
av = av + 'liveChanges';
node.className = av;
_2 = _1(node);
/* Add trigger events here */ 
_3 = 	function () {
	var freeze = {},
	    freezeNode = _2,
	    wfn = 		function (name,oldValue,newValue) {
		var temps = {},
		    p;
		if (!(oldValue === newValue)){
			for (p in freeze){
			if (freeze.hasOwnProperty(p)) {
				temps[p] = context[p];
				context[p] = freeze[p];

			}
			}			_1(freezeNode);
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
ctxTemp = ctxTemp['liveChanges'];
if (ctxTemp.watch){
	ctxTemp.watch('val',_3());

}
txn = t(node,'',node.ownerDocument);
putValue = context['liveChanges']['val'];
txn.nodeValue = txn.nodeValue + ((putValue !== undefined)? putValue:'');
return node;
/* Here ends the live expression */ 

},
    _5,
    _6,
    _7 = 	function (context) {
	var arr,
	    temp,
	    cnt,
	    ident = 'person',
	    _0 = 			function () {
		/* Here starts a live expression */ 
		node = e(node,'div',node.ownerDocument);
		txn = t(node,'',node.ownerDocument);
		putValue = context['person']['name'];
		if (((putValue !== undefined)) && (putValue !== null)){
			if (putValue['$njsWidget']){
				putValue.show(node);

			} else 			if (putValue.domNode){
				node.appendChild(putValue.domNode);

			}
 else 			if (putValue.tagName){
				node.appendChild(putValue);
				txn = t(node,'',node.ownerDocument);

			}
 else 			if ((putValue !== undefined)){
				txn.nodeValue = txn.nodeValue + ((putValue !== undefined)? putValue:'');

			}


		}
		return node;
		/* Here ends the live expression */ 

},
	    _1,
	    _2,
	    _3 = 			function () {
		/* Here starts a live expression */ 
		node = e(node,'div',node.ownerDocument);
		txn = t(node,'',node.ownerDocument);
		putValue = context['person']['gender'];
		txn.nodeValue = txn.nodeValue + ((putValue !== undefined)? putValue:'');
		return node;
		/* Here ends the live expression */ 

},
	    _4,
	    _5,
	    _6 = 			function () {
		/* Here starts a live expression */ 
		node = e(node,'div',node.ownerDocument);
		av = '';
		av = av + 'age';
		node.className = av;
		txn = t(node,'',node.ownerDocument);
		putValue = context['person']['age'];
		txn.nodeValue = txn.nodeValue + ((putValue !== undefined)? putValue:'');
		return node;
		/* Here ends the live expression */ 

},
	    _7,
	    _8;
	temp = context[ident];
	arr = (context['persons']) || [];
	for ((cnt = 0); cnt < arr.length; (cnt = cnt + 1)){
		context[ident] = arr[cnt];
		nodes.push(node);
		node = e(node,'div',node.ownerDocument);
		av = '';
		putValue = context['person']['name'];
		if (av !== ''){
			av = av + ((putValue) || '');

		} else {
			av = ((putValue) || '');

		}
		node.setAttribute('data-key',av);
		nodes.push(node);
		_1 = _0();
		/* Add trigger events here */ 
		_2 = 			function () {
			var freeze = {},
			    freezeNode = _1,
			    wfn = 				function (name,oldValue,newValue) {
				var temps = {},
				    t,
				    p;
				if (!(oldValue === newValue)){
					for (p in freeze){
					if (freeze.hasOwnProperty(p)) {
						temps[p] = context[p];
						context[p] = freeze[p];

					}
					}					t = _0();
					freezeNode.parentNode.replaceChild(t,freezeNode);
					freezeNode = t;
					for (p in freeze){
					if (freeze.hasOwnProperty(p)) {
						context[p] = temps[p];

					}
					}
				}

};
			freeze['person'] = context['person'];
			return wfn;

};
		ctxTemp = context;
		ctxTemp = ctxTemp['person'];
		if (ctxTemp.watch){
			ctxTemp.watch('name',_2());

		}
		node = nodes.pop();
		nodes.push(node);
		_4 = _3();
		/* Add trigger events here */ 
		_5 = 			function () {
			var freeze = {},
			    freezeNode = _4,
			    wfn = 				function (name,oldValue,newValue) {
				var temps = {},
				    t,
				    p;
				if (!(oldValue === newValue)){
					for (p in freeze){
					if (freeze.hasOwnProperty(p)) {
						temps[p] = context[p];
						context[p] = freeze[p];

					}
					}					t = _3();
					freezeNode.parentNode.replaceChild(t,freezeNode);
					freezeNode = t;
					for (p in freeze){
					if (freeze.hasOwnProperty(p)) {
						context[p] = temps[p];

					}
					}
				}

};
			freeze['person'] = context['person'];
			return wfn;

};
		ctxTemp = context;
		ctxTemp = ctxTemp['person'];
		if (ctxTemp.watch){
			ctxTemp.watch('gender',_5());

		}
		node = nodes.pop();
		nodes.push(node);
		_7 = _6();
		/* Add trigger events here */ 
		_8 = 			function () {
			var freeze = {},
			    freezeNode = _7,
			    wfn = 				function (name,oldValue,newValue) {
				var temps = {},
				    t,
				    p;
				if (!(oldValue === newValue)){
					for (p in freeze){
					if (freeze.hasOwnProperty(p)) {
						temps[p] = context[p];
						context[p] = freeze[p];

					}
					}					t = _6();
					freezeNode.parentNode.replaceChild(t,freezeNode);
					freezeNode = t;
					for (p in freeze){
					if (freeze.hasOwnProperty(p)) {
						context[p] = temps[p];

					}
					}
				}

};
			freeze['person'] = context['person'];
			return wfn;

};
		ctxTemp = context;
		ctxTemp = ctxTemp['person'];
		if (ctxTemp.watch){
			ctxTemp.watch('age',_8());

		}
		node = nodes.pop();
		node = nodes.pop();
		txn = t(node,'',node.ownerDocument);

	}	context.ident = temp;

};
if (!document){
	document = window.document;

}
putValue = context['tagName'];
if (x !== ''){
	x = x + ((putValue) || '');

} else {
	x = ((putValue) || '');

}
node = document.createElement((putValue) || 'div');
nodes.push(node);
av = '';
putValue = context['class'];
if (av !== ''){
	av = av + ((putValue) || '');

} else {
	av = ((putValue) || '');

}
node.className = av;
attachTemp = r['${tagName}'];
if (attachTemp){
	if (Object.prototype.toString.call(attachTemp) === '[object Array]'){
		attachTemp.push(node);

	} else {
		r['${tagName}'] = [attachTemp,node];

	}

} else {
	r['${tagName}'] = node;

}
nodes.push(node);
node = e(node,'h1',node.ownerDocument);
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
txn = t(node,'',node.ownerDocument);
putValue = context['title'];
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
attachTemp = r['contentNode'];
if (attachTemp){
	if (Object.prototype.toString.call(attachTemp) === '[object Array]'){
		attachTemp.push(node);

	} else {
		r['contentNode'] = [attachTemp,node];

	}

} else {
	r['contentNode'] = node;

}
av = '';
av = av + 'content';
node.className = av;
txn = t(node,'',node.ownerDocument);
txn.nodeValue = txn.nodeValue + 'This is the content.';
node = nodes.pop();
nodes.push(node);
node = e(node,'div',node.ownerDocument);
nodes.push(node);
node = e(node,'span',node.ownerDocument);
txn = t(node,'',node.ownerDocument);
txn.nodeValue = txn.nodeValue + 'More content';
putValue = (x = context['fn'].apply(context,['key']));
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
txn.nodeValue = txn.nodeValue + 'more data';
node = nodes.pop();
node = nodes.pop();
nodes.push(node);
node = e(node,'div',node.ownerDocument);
attachTemp = r['multiAttach'];
if (attachTemp){
	if (Object.prototype.toString.call(attachTemp) === '[object Array]'){
		attachTemp.push(node);

	} else {
		r['multiAttach'] = [attachTemp,node];

	}

} else {
	r['multiAttach'] = node;

}
txn = t(node,'',node.ownerDocument);
putValue = (x = (x = context['doubleFunction'].apply(context,[context['title']])).apply(x,['key']));
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
attachTemp = r['multiAttach'];
if (attachTemp){
	if (Object.prototype.toString.call(attachTemp) === '[object Array]'){
		attachTemp.push(node);

	} else {
		r['multiAttach'] = [attachTemp,node];

	}

} else {
	r['multiAttach'] = node;

}
txn = t(node,'',node.ownerDocument);
txn.nodeValue = txn.nodeValue + 'This is a number: ';
putValue = context['number'];
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
txn.nodeValue = txn.nodeValue + '.';
node = nodes.pop();
nodes.push(node);
node = e(node,'h1',node.ownerDocument);
txn = t(node,'',node.ownerDocument);
txn.nodeValue = txn.nodeValue + 'Another h1';
node = nodes.pop();
nodes.push(node);
node = e(node,'div',node.ownerDocument);
txn = t(node,'',node.ownerDocument);
txn.nodeValue = txn.nodeValue + 'Another div';
node = nodes.pop();
nodes.push(node);
node = e(node,'div',node.ownerDocument);
av = '';
av = av + 'testANumberInAnObject';
node.className = av;
txn = t(node,'',node.ownerDocument);
putValue = context['anObject']['aNumber'];
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
txn = t(node,'',node.ownerDocument);
txn.nodeValue = txn.nodeValue + 'This is a widget';
putValue = context['button'];
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
txn = t(node,'',node.ownerDocument);
_0.call(this,context);
nodes.push(node);
node = e(node,'hi',node.ownerDocument);
txn = t(node,'',node.ownerDocument);
txn.nodeValue = txn.nodeValue + 'Hello';
node = nodes.pop();
nodes.push(node);
node = e(node,'hi',node.ownerDocument);
txn = t(node,'',node.ownerDocument);
txn.nodeValue = txn.nodeValue + 'Hi there!';
node = nodes.pop();
nodes.push(node);
node = e(node,'div',node.ownerDocument);
av = '';
putValue = context['tagName'];
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
node.className = av;
nodes.push(node);
node = e(node,'span',node.ownerDocument);
txn = t(node,'',node.ownerDocument);
txn.nodeValue = txn.nodeValue + 'This is some static text that should be';
node = nodes.pop();
nodes.push(node);
node = e(node,'span',node.ownerDocument);
txn = t(node,'',node.ownerDocument);
txn.nodeValue = txn.nodeValue + 'rendered';
node = nodes.pop();
nodes.push(node);
node = e(node,'span',node.ownerDocument);
txn = t(node,'',node.ownerDocument);
txn.nodeValue = txn.nodeValue + 'as innerHTML in a DOM rendered environment. Even though it has variables such as ';
putValue = context['number'];
txn.nodeValue = txn.nodeValue + ((putValue !== undefined)? putValue:'');
txn.nodeValue = txn.nodeValue + ' it should be able to render as innerHTML because those variables like ';
putValue = context['title'];
txn.nodeValue = txn.nodeValue + ((putValue !== undefined)? putValue:'');
txn.nodeValue = txn.nodeValue + ' are not bound and do not represent an attach point node.';
node = nodes.pop();
node = nodes.pop();
nodes.push(node);
node = e(node,'div',node.ownerDocument);
attachTemp = r['emptyNode'];
if (attachTemp){
	if (Object.prototype.toString.call(attachTemp) === '[object Array]'){
		attachTemp.push(node);

	} else {
		r['emptyNode'] = [attachTemp,node];

	}

} else {
	r['emptyNode'] = node;

}
node = nodes.pop();
nodes.push(node);
node = e(node,'div',node.ownerDocument);
nodes.push(node);
_5 = _4();
/* Add trigger events here */ 
_6 = 	function () {
	var freeze = {},
	    freezeNode = _5,
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
			}			t = _4();
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
ctxTemp = ctxTemp['liveChanges'];
if (ctxTemp.watch){
	ctxTemp.watch('val',_6());

}
node = nodes.pop();
nodes.push(node);
node = e(node,'div',node.ownerDocument);
av = '';
av = av + 'persons';
node.className = av;
attachTemp = r['personsNode'];
if (attachTemp){
	if (Object.prototype.toString.call(attachTemp) === '[object Array]'){
		attachTemp.push(node);

	} else {
		r['personsNode'] = [attachTemp,node];

	}

} else {
	r['personsNode'] = node;

}
txn = t(node,'',node.ownerDocument);
_7.call(this,context);
node = nodes.pop();
node = nodes.pop();
node = nodes.pop();
r.domNode = node;
return r;

};
return r;
});
