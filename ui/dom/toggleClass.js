(function (factory) {
	'use strict';
	var req = require,
		isAmd = typeof (define) === 'function' && define.amd;
	if (isAmd) {
		define(['../../core/on', '../utils/setClass', '../../core/objUtils'], factory);
	}
	else if (typeof(exports) === 'object') {
		module.exports = factory.apply(null, ['../../core/on', '../utils/setClass', '../../core/objUtils'].map(req));
	}
})(function (on, setClass, objUtils) {
	return function (node, context, value, options) {
		var classes = (value || '').split(/,| /).filter(function (s) {
			return s;
		});
		var target = options.target || '';
		if (!target) {
			target = [function () { return node; }];
		}
		else {
			target = target.split(/,| /).filter(function (s) {
				return s;
			}).map(function (t) {
				if (t[0] === '#') {
					return function () {
						return Array.prototype.slice.call(window.document.getElementById(t.substr(1)), 0);
					};
				}
				else if (t[0] === '.') {
					return function () {
						return Array.prototype.slice.call(context.domNode.querySelectorAll(t), 0);
					};
				}
				else {
					if (objUtils.isArray(context[t])) {
						return function () {
							return context[t];
						};
					}
					else {
						return function () {
							return [context[t]];
						};
					}
				}
			});
		}
		var setClasses = function (t) {
			classes.forEach(function (c) {
				setClass(t, '~' + c);
			});
		};
		var handler = on(node, 'click', function (e) {
			target.reduce(function (previous, f) {
				var t = f(),
					cnt,
					len;
				if (objUtils.isArray(t)) {
					len = t.length;
					for (cnt = 0; cnt < len; cnt += 1) {
						previous.push(t[cnt]);
					}
				}
				else {
					previous.push(t);
				}
				return previous;
			}, []).forEach(setClasses);
			e.stopPropagation();
		});
		if (context.own) {
			context.own(handler);
		}
	};
});