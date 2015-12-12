'use strict';

import Widget from '../../ui/Widget';
import defaultSkin from './Skin/FullScreenFrame';
import append from '../../ui/utils/append';
import setClass from '../../ui/utils/setClass';
import on from '../../core/on';
import { when, PromiseType } from '../../core/deferredUtils';
import { filter } from '../../core/array';


function isNumber(n: any) {
	return !isNaN(parseFloat(n)) && isFinite(n);
}
class FullScreenFrame extends Widget {
	init: PromiseType<HTMLElement>
	containerNode: HTMLElement
	selectedSetter (idx: any) {
		var cnt: number,
			arr = filter(this.containerNode.childNodes, (node: Element) => { return node.nodeType === 1; /* Element */ }),
			len = arr.length,
			target: any,
			current: HTMLElement;
		if (isNumber(idx)) {
			target = arr[idx];
		}
		else if (idx.domNode) {
			target = idx.domNode;
		}
		else if (idx['$njsWidget'] && (typeof(idx.show) === 'function')) {
			idx.show();
			target = idx.domNode;
		}
		else {
			target = idx;
		}
		function deactivate(node: HTMLElement) {
			return function() {
				on.emit(node, 'njsDeactivated', { bubbles: false, cancelable: false });
			};
		}
		function activate(target: any) {
			setTimeout(function() {
				on.emit(target, 'njsActivated', { bubbles: false, cancelable: false });
			}, 10);
		}
		var foundIdx: number;
		for (cnt = 0; cnt < len; cnt += 1) {
			current = arr[cnt];
			if (setClass.has(current, 'active')) {
				setTimeout(deactivate(current), 10);
			}
			setClass(current, '!active');
			if (current === target) {
				foundIdx = cnt;
			}
		}
		if (foundIdx !== undefined) {
			setClass(arr[foundIdx], 'active');
			activate(arr[foundIdx]);
		}
	}
	addChild (child: any): any {
		var self = this;
		function doAddChild(container: HTMLElement, child: any) {
			if (child.domNode) {
				child.set('parentContainer', self);
				child = child.domNode;
			}
			append(container, child);
			return filter(container.childNodes, function (node) { return node.nodeType === 1; /* Element */ }).length - 1;
		}
		if (((!child.domNode) || (typeof(child.domNode.nodeType) === 'undefined')) && (typeof(child.show) === 'function')) {
			return when(child.show(), function() {
				doAddChild(self.containerNode, child);
			});
		}
		else {
			return doAddChild(this.containerNode, child);
		}
	}
}

FullScreenFrame.prototype.skin = defaultSkin;
export default FullScreenFrame;