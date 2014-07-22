define(['../../modernizer'], function (modernizer) {
	'use strict';
	var ietrident = modernizer.ietrident;
	function localTrim() {
		/* jshint -W040 */
		return this.replace((/^\s+|\s+$/g),'');
	}
	var classProp = 'className',
	doTrim = String.prototype.trim || localTrim,
	trim;
	trim = function(str) {
		return doTrim.call(str);
	};
	function clSetClass(node, name) {
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
	}
	clSetClass.has = function(node, name) {
		return node.classList.contains(name);
	};
	function oldSetClass(node, clName) {
		var name = trim(clName), remove, className = ' ' + node[classProp] + ' ', toggle, idx, strip;
		if (name.indexOf('!!') === 0) {
			node[classProp] = '';
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
					node[classProp] = trim(className);
				}
			}
			else {
				if (className.indexOf(' ' + name + ' ') < 0) {
					node[classProp] += ' ' + name;
				}//else nothing happens as its already there
			}
		}
	}
	oldSetClass.has = function(node, name) {
		var className = ' ' + node[classProp] + ' ';
		return name && (className.indexOf(' ' + name + ' ') >= 0);
	};
	function unkSetClass(node, clName){
		var undef, hasClassList = node.classList && node.classList.length !== undef;
		if (hasClassList){
			doSetClass = clSetClass;
			setClass.has = clSetClass.has;
		}
		else {
			doSetClass = oldSetClass;
			setClass.has = oldSetClass.has;
		}
		return doSetClass(node, clName);
	}
	function unkHas(node, clName) {
		var undef, hasClassList = node.classList && node.classList.length !== undef;
		if (hasClassList){
			setClass.has = clSetClass.has;
		}
		else {
			setClass.has = oldSetClass.has;
		}
		return setClass.has(node, clName);
	}
	var doSetClass = ietrident ? oldSetClass : unkSetClass;
	var setClass = function(node) {
		var cnt = 1, clName;
		while ((clName = arguments[cnt])) {
			doSetClass(node, clName);
			cnt += 1;
		}
		return node;
	};
	setClass.has = ietrident ? oldSetClass.has : unkHas;
	return setClass;
});
