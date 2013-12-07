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
    y,
    e = (fn.tst()?fn.e:fn.ae),
    a = fn.a,
    t = fn.t,
    av,
    result,
    v,
    _0 = function anonymous(context) {
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
if (putValue){
if (putValue['$njsWidget']){
				putValue.show(node);

			} else if (putValue.domNode){
				node.appendChild(putValue.domNode);

			} else if (putValue.tagName){
				node.appendChild(putValue);
				txn = t(node,'',node.ownerDocument);

			} else if (putValue){
				txn.nodeValue = txn.nodeValue + putValue;

			}
		}		node = nodes.pop();
		txn = t(node,'',node.ownerDocument);

	}	context.ident = temp;

},
    _1 = function anonymous(context) {
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
		av = '';
		putValue = context['person']['name'];
		av = (putValue) || '';
		node.setAttribute('data-key',av);
		nodes.push(node);
		node = e(node,'div',node.ownerDocument);
		txn = t(node,'',node.ownerDocument);
		putValue = context['person']['name'];
if (putValue){
if (putValue['$njsWidget']){
				putValue.show(node);

			} else if (putValue.domNode){
				node.appendChild(putValue.domNode);

			} else if (putValue.tagName){
				node.appendChild(putValue);
				txn = t(node,'',node.ownerDocument);

			} else if (putValue){
				txn.nodeValue = txn.nodeValue + putValue;

			}
		}		node = nodes.pop();
		nodes.push(node);
		node = e(node,'div',node.ownerDocument);
		txn = t(node,'',node.ownerDocument);
		putValue = context['person']['gender'];
		txn.nodeValue = txn.nodeValue + putValue;
		txn = t(node,'',node.ownerDocument);
		putValue = context['person']['gender'];
		txn.nodeValue = txn.nodeValue + putValue;
		result = [];
		node.innerHTML = result.join('');
		node = nodes.pop();
		nodes.push(node);
		node = e(node,'div',node.ownerDocument);
		av = '';
		av = av + 'age';
		node.className = av;
		txn = t(node,'',node.ownerDocument);
		putValue = context['person']['age'];
		txn.nodeValue = txn.nodeValue + putValue;
		txn = t(node,'',node.ownerDocument);
		putValue = context['person']['age'];
		txn.nodeValue = txn.nodeValue + putValue;
		result = [];
		av = '';
		av = av + 'age';
		node.className = av;
		node.innerHTML = result.join('');
		node = nodes.pop();
		node = nodes.pop();
		txn = t(node,'',node.ownerDocument);

	}	context.ident = temp;

};
if (!document){
	document = window.document;

}putValue = context['tagName'];
x = (putValue) || '';
node = document.createElement((putValue) || 'div');
nodes.push(node);
av = '';
putValue = context['class'];
av = (putValue) || '';
node.className = av;
attachTemp = r['${tagName}'];
if (attachTemp){
if (Object.prototype.toString.call(attachTemp) === '[object Array]'){
		attachTemp.push(node);

	} 		r['${tagName}'] = [];

} 	r['${tagName}'] = node;
nodes.push(node);
node = e(node,'h1',node.ownerDocument);
attachTemp = r['titleNode'];
if (attachTemp){
if (Object.prototype.toString.call(attachTemp) === '[object Array]'){
		attachTemp.push(node);

	} 		r['titleNode'] = [];

} 	r['titleNode'] = node;
txn = t(node,'',node.ownerDocument);
putValue = context['title'];
if (putValue){
if (putValue['$njsWidget']){
		putValue.show(node);

	} else if (putValue.domNode){
		node.appendChild(putValue.domNode);

	} else if (putValue.tagName){
		node.appendChild(putValue);
		txn = t(node,'',node.ownerDocument);

	} else if (putValue){
		txn.nodeValue = txn.nodeValue + putValue;

	}
}node = nodes.pop();
nodes.push(node);
node = e(node,'div',node.ownerDocument);
attachTemp = r['contentNode'];
if (attachTemp){
if (Object.prototype.toString.call(attachTemp) === '[object Array]'){
		attachTemp.push(node);

	} 		r['contentNode'] = [];

} 	r['contentNode'] = node;
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
putValue = (x = context['fn'].apply(context,[]));
if (putValue){
if (putValue['$njsWidget']){
		putValue.show(node);

	} else if (putValue.domNode){
		node.appendChild(putValue.domNode);

	} else if (putValue.tagName){
		node.appendChild(putValue);
		txn = t(node,'',node.ownerDocument);

	} else if (putValue){
		txn.nodeValue = txn.nodeValue + putValue;

	}
}txn.nodeValue = txn.nodeValue + 'more data';
node = nodes.pop();
node = nodes.pop();
nodes.push(node);
node = e(node,'div',node.ownerDocument);
attachTemp = r['multiAttach'];
if (attachTemp){
if (Object.prototype.toString.call(attachTemp) === '[object Array]'){
		attachTemp.push(node);

	} 		r['multiAttach'] = [];

} 	r['multiAttach'] = node;
txn = t(node,'',node.ownerDocument);
putValue = (x = (x = context['doubleFunction'].apply(context,[])).apply(x,[]));
if (putValue){
if (putValue['$njsWidget']){
		putValue.show(node);

	} else if (putValue.domNode){
		node.appendChild(putValue.domNode);

	} else if (putValue.tagName){
		node.appendChild(putValue);
		txn = t(node,'',node.ownerDocument);

	} else if (putValue){
		txn.nodeValue = txn.nodeValue + putValue;

	}
}node = nodes.pop();
nodes.push(node);
node = e(node,'div',node.ownerDocument);
attachTemp = r['multiAttach'];
if (attachTemp){
if (Object.prototype.toString.call(attachTemp) === '[object Array]'){
		attachTemp.push(node);

	} 		r['multiAttach'] = [];

} 	r['multiAttach'] = node;
txn = t(node,'',node.ownerDocument);
txn.nodeValue = txn.nodeValue + 'This is a number: ';
putValue = context['number'];
if (putValue){
if (putValue['$njsWidget']){
		putValue.show(node);

	} else if (putValue.domNode){
		node.appendChild(putValue.domNode);

	} else if (putValue.tagName){
		node.appendChild(putValue);
		txn = t(node,'',node.ownerDocument);

	} else if (putValue){
		txn.nodeValue = txn.nodeValue + putValue;

	}
}txn.nodeValue = txn.nodeValue + '.';
node = nodes.pop();
nodes.push(node);
node = e(node,'h1',node.ownerDocument);
txn = t(node,'',node.ownerDocument);
txn.nodeValue = txn.nodeValue + 'Another h1';
txn = t(node,'',node.ownerDocument);
txn.nodeValue = txn.nodeValue + 'Another h1';
result = [];
node.innerHTML = result.join('');
node = nodes.pop();
nodes.push(node);
node = e(node,'div',node.ownerDocument);
txn = t(node,'',node.ownerDocument);
txn.nodeValue = txn.nodeValue + 'Another div';
txn = t(node,'',node.ownerDocument);
txn.nodeValue = txn.nodeValue + 'Another div';
result = [];
node.innerHTML = result.join('');
node = nodes.pop();
nodes.push(node);
node = e(node,'div',node.ownerDocument);
av = '';
av = av + 'testANumberInAnObject';
node.className = av;
txn = t(node,'',node.ownerDocument);
putValue = context['anObject']['aNumber'];
if (putValue){
if (putValue['$njsWidget']){
		putValue.show(node);

	} else if (putValue.domNode){
		node.appendChild(putValue.domNode);

	} else if (putValue.tagName){
		node.appendChild(putValue);
		txn = t(node,'',node.ownerDocument);

	} else if (putValue){
		txn.nodeValue = txn.nodeValue + putValue;

	}
}node = nodes.pop();
nodes.push(node);
node = e(node,'div',node.ownerDocument);
txn = t(node,'',node.ownerDocument);
txn.nodeValue = txn.nodeValue + 'This is a widget';
putValue = context['button'];
if (putValue){
if (putValue['$njsWidget']){
		putValue.show(node);

	} else if (putValue.domNode){
		node.appendChild(putValue.domNode);

	} else if (putValue.tagName){
		node.appendChild(putValue);
		txn = t(node,'',node.ownerDocument);

	} else if (putValue){
		txn.nodeValue = txn.nodeValue + putValue;

	}
}node = nodes.pop();
txn = t(node,'',node.ownerDocument);
_0.call(this,context);
nodes.push(node);
node = e(node,'hi',node.ownerDocument);
txn = t(node,'',node.ownerDocument);
txn.nodeValue = txn.nodeValue + 'Hello';
txn = t(node,'',node.ownerDocument);
txn.nodeValue = txn.nodeValue + 'Hello';
result = [];
node.innerHTML = result.join('');
node = nodes.pop();
nodes.push(node);
node = e(node,'hi',node.ownerDocument);
txn = t(node,'',node.ownerDocument);
txn.nodeValue = txn.nodeValue + 'Hi there!';
txn = t(node,'',node.ownerDocument);
txn.nodeValue = txn.nodeValue + 'Hi there!';
result = [];
node.innerHTML = result.join('');
node = nodes.pop();
nodes.push(node);
node = e(node,'div',node.ownerDocument);
av = '';
putValue = context['tagName'];
av = (putValue) || '';
av = av + ' ';
putValue = context['class'];
av = (putValue) || '';
node.className = av;
nodes.push(node);
node = e(node,'span',node.ownerDocument);
txn = t(node,'',node.ownerDocument);
txn.nodeValue = txn.nodeValue + 'This is some static text that should be';
txn = t(node,'',node.ownerDocument);
txn.nodeValue = txn.nodeValue + 'This is some static text that should be';
result = [];
node.innerHTML = result.join('');
node = nodes.pop();
nodes.push(node);
node = e(node,'span',node.ownerDocument);
txn = t(node,'',node.ownerDocument);
txn.nodeValue = txn.nodeValue + 'rendered';
txn = t(node,'',node.ownerDocument);
txn.nodeValue = txn.nodeValue + 'rendered';
result = [];
node.innerHTML = result.join('');
node = nodes.pop();
nodes.push(node);
node = e(node,'span',node.ownerDocument);
txn = t(node,'',node.ownerDocument);
txn.nodeValue = txn.nodeValue + 'as innerHTML in a DOM rendered environment. Even though it has variables such as ';
putValue = context['number'];
txn.nodeValue = txn.nodeValue + putValue;
txn.nodeValue = txn.nodeValue + ' it should be able to render as innerHTML because those variables like ';
putValue = context['title'];
txn.nodeValue = txn.nodeValue + putValue;
txn.nodeValue = txn.nodeValue + ' are not bound and do not represent an attach point node.';
txn = t(node,'',node.ownerDocument);
txn.nodeValue = txn.nodeValue + 'as innerHTML in a DOM rendered environment. Even though it has variables such as ';
putValue = context['number'];
txn.nodeValue = txn.nodeValue + putValue;
txn.nodeValue = txn.nodeValue + ' it should be able to render as innerHTML because those variables like ';
putValue = context['title'];
txn.nodeValue = txn.nodeValue + putValue;
txn.nodeValue = txn.nodeValue + ' are not bound and do not represent an attach point node.';
result = [];
node.innerHTML = result.join('');
node = nodes.pop();
nodes.push(node);
node = e(node,'span',node.ownerDocument);
txn = t(node,'',node.ownerDocument);
txn.nodeValue = txn.nodeValue + 'This is some static text that should be';
txn = t(node,'',node.ownerDocument);
txn.nodeValue = txn.nodeValue + 'This is some static text that should be';
result = [];
node.innerHTML = result.join('');
node = nodes.pop();
nodes.push(node);
node = e(node,'span',node.ownerDocument);
txn = t(node,'',node.ownerDocument);
txn.nodeValue = txn.nodeValue + 'rendered';
txn = t(node,'',node.ownerDocument);
txn.nodeValue = txn.nodeValue + 'rendered';
result = [];
node.innerHTML = result.join('');
node = nodes.pop();
nodes.push(node);
node = e(node,'span',node.ownerDocument);
txn = t(node,'',node.ownerDocument);
txn.nodeValue = txn.nodeValue + 'as innerHTML in a DOM rendered environment. Even though it has variables such as ';
putValue = context['number'];
txn.nodeValue = txn.nodeValue + putValue;
txn.nodeValue = txn.nodeValue + ' it should be able to render as innerHTML because those variables like ';
putValue = context['title'];
txn.nodeValue = txn.nodeValue + putValue;
txn.nodeValue = txn.nodeValue + ' are not bound and do not represent an attach point node.';
txn = t(node,'',node.ownerDocument);
txn.nodeValue = txn.nodeValue + 'as innerHTML in a DOM rendered environment. Even though it has variables such as ';
putValue = context['number'];
txn.nodeValue = txn.nodeValue + putValue;
txn.nodeValue = txn.nodeValue + ' it should be able to render as innerHTML because those variables like ';
putValue = context['title'];
txn.nodeValue = txn.nodeValue + putValue;
txn.nodeValue = txn.nodeValue + ' are not bound and do not represent an attach point node.';
result = [];
node.innerHTML = result.join('');
node = nodes.pop();
result = [];
av = '';
putValue = context['tagName'];
av = (putValue) || '';
av = av + ' ';
putValue = context['class'];
av = (putValue) || '';
node.className = av;
node.innerHTML = result.join('');
node = nodes.pop();
nodes.push(node);
node = e(node,'div',node.ownerDocument);
attachTemp = r['emptyNode'];
if (attachTemp){
if (Object.prototype.toString.call(attachTemp) === '[object Array]'){
		attachTemp.push(node);

	} 		r['emptyNode'] = [];

} 	r['emptyNode'] = node;
node = nodes.pop();
nodes.push(node);
node = e(node,'div',node.ownerDocument);
nodes.push(node);
node = e(node,'div',node.ownerDocument);
av = '';
av = av + 'persons';
node.className = av;
attachTemp = r['personsNode'];
if (attachTemp){
if (Object.prototype.toString.call(attachTemp) === '[object Array]'){
		attachTemp.push(node);

	} 		r['personsNode'] = [];

} 	r['personsNode'] = node;
txn = t(node,'',node.ownerDocument);
_1.call(this,context);
node = nodes.pop();
node = nodes.pop();
node = nodes.pop();
r.domNode = node;
return r;

};
return r;
});
