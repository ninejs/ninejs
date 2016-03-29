'use strict';
import coreOn from '../../core/on'
import setClass from '../utils/setClass'
import { isArray } from '../../core/objUtils'
/* global window */
export default function (node: HTMLElement, context: any, value: string, options: { target?: string, event?: string }) {
	var classes = (value || '').split(/,| /).filter(function (s) {
		return !!s;
	});
	var target = options.target || '';
	let targetNodes: (() => HTMLElement | HTMLElement[])[];
	if (!target) {
		targetNodes = [function () { return node; }];
	}
	else {
		targetNodes = target.split(/,/).filter(function (s) {
			return !!s;
		}).map(function (t) {
			if (t[0] === '#') {
				return function () {
					return Array.prototype.slice.call(window.document.getElementById(t.substr(1)), 0);
				};
			}
			else if ((t.indexOf('.') >= 0) || (t.indexOf(' ') >= 0)) {
				return function () {
					return Array.prototype.slice.call(context.domNode.querySelectorAll(t), 0);
				};
			}
			else {
				if (isArray(context[t])) {
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
	var setClasses = function (t: HTMLElement) {
		classes.forEach(function (c) {
			setClass(t, '~' + c);
		});
	};
	(options.event || 'click').split(',').map(function (eventName) {
		return coreOn(node, eventName, function (e) {
			targetNodes.reduce(function (previous, f) {
				var t = f(),
					cnt: number,
					len: number;
				if (isArray(t)) {
					let arr = t as HTMLElement[];
					len = arr.length;
					for (cnt = 0; cnt < len; cnt += 1) {
						previous.push(arr[cnt]);
					}
				}
				else {
					previous.push(t);
				}
				return previous;
			}, []).forEach(setClasses);
			e.stopPropagation();
		});
	}).forEach(function (handler) {
		if (context.own) {
			context.own(handler);
		}
	});
};