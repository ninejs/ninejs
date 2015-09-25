///<amd-dependency path="../../modernizer" />
declare var require: any;
var modernizer: any = require('../../modernizer');

var ietrident: boolean = modernizer.ietrident;
function localTrim(): string {
	/* jshint -W040 */
	return this.replace((/^\s+|\s+$/g),'');
}
var doTrim: () => string = String.prototype.trim || localTrim;
function trim (str: string) {
	return doTrim.call(str);
};
function clSetClass(node: HTMLElement, name: string) {
	if (name.indexOf('!!') === 0) {
		while(node.classList[0]) {
			node.classList.remove(node.classList[0]);
		}
	}
	else {
		if (name[0] === '!') {
			name = name.substr(1);
			node.classList.remove(name);
		}
		else if (name[0] === '~') {
			name = name.substr(1);
			node.classList.toggle(name);
		}
		else {
			node.classList.add(name);
		}
	}
	return node;
}
var clSetClassHas = function(node: HTMLElement, name: string) {
	return node.classList.contains(name);
};
function oldSetClass(node: HTMLElement, clName: string) {
	var name = trim(clName),
		remove: boolean,
		className = ' ' + node.className + ' ',
		toggle: boolean,
		idx: number,
		strip: boolean;
	if (name.indexOf('!!') === 0) {
		node.className = '';
	}
	else {
		remove = (name.charAt(0) === '!');
		toggle = (name.charAt(0) === '~');
		if (remove || toggle) {
			name = name.substr(1);
		}

		if (toggle && (className.indexOf(' ' + name + ' ') >= 0)) {
			remove = true;
		}
		if (remove) {
			idx = className.indexOf(' ' + name + ' ');
			while (idx >= 0) {
				className = className.substr(0, idx + 1) + className.substr(idx + 2 + name.length);
				idx = className.indexOf(' ' + name + ' ');
				strip = true;
			}
			if (strip) {
				node.className = trim(className);
			}
		}
		else {
			if (className.indexOf(' ' + name + ' ') < 0) {
				node.className += ' ' + name;
			}//else nothing happens as its already there
		}
	}
	return node;
}
var oldSetClassHas = function(node: HTMLElement, name: string) {
	var className = ' ' + node.className + ' ';
	return name && (className.indexOf(' ' + name + ' ') >= 0);
};
function unkSetClass(node: HTMLElement, clName: string){
	var hasClassList = node.classList && node.classList.length !== undefined;
	if (hasClassList){
		doSetClass = clSetClass;
		setClass.has = clSetClassHas;
	}
	else {
		doSetClass = oldSetClass;
		setClass.has = oldSetClassHas;
	}
	return doSetClass(node, clName);
}
function unkHas(node: HTMLElement, clName: string) {
	var hasClassList = node.classList && node.classList.length !== undefined;
	if (hasClassList){
		setClass.has = clSetClassHas;
	}
	else {
		setClass.has = oldSetClassHas;
	}
	return setClass.has(node, clName);
}
var doSetClass: (node: HTMLElement, cname: string) => HTMLElement = ietrident ? oldSetClass : unkSetClass;
var setClass: {
	(node: HTMLElement, ...clist: string[]): HTMLElement;
	has: (node: HTMLElement, ...clist: string[]) => boolean;
	temporary: (node: HTMLElement, delay: number, ...clist: string[]) => number;
}
setClass = (() => {
	var setClass: any = function(node: HTMLElement, ...clist: string[]) {
		var cnt = 0,
			clName: string;
		while ((clName = clist[cnt])) {
			doSetClass(node, clName);
			cnt += 1;
		}
		return node;
	};
	setClass.has = ietrident ? oldSetClassHas : unkHas;
	/*
	Arguments: node, delay, class1, class2, class3, ...
	 */
	setClass.temporary = function (node: HTMLElement, delay: number, ...clist: string[]) {
		var len = clist.length,
			cnt: number;
		for (cnt = 0; cnt < len; cnt += 1) {
			setClass(node, clist[cnt]);
		}
		return setTimeout(function () {
			for (cnt = 0; cnt < len; cnt += 1) {
				setClass(node, '!' + clist[cnt]);
			}
		}, delay);
	};
	return setClass;
})();
export default setClass;