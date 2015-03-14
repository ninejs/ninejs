define(['../../ui/Widget', './Skin/FullScreenFrame', '../../ui/utils/append', '../../ui/utils/setClass', '../../core/on', '../../core/deferredUtils', '../../core/array'], function(Widget, defaultSkin, append, setClass, on, def, array) {
	'use strict';
	function isNumber(n) {
		return !isNaN(parseFloat(n)) && isFinite(n);
	}
	var FullScreenFrame = Widget.extend({
		skin: defaultSkin,
		selectedSetter: function(idx) {
			var cnt,
				arr = array.filter(this.containerNode.childNodes, function (node) { return node.nodeType === 1; /* Element */ }),
				len = arr.length,
				target,
				current;
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
			function deactivate(node) {
				return function() {
					on.emit(node, 'njsDeactivated', { bubbles: false, cancelable: false });
				};
			}
			function activate(target) {
				setTimeout(function() {
					on.emit(target, 'njsActivated', { bubbles: false, cancelable: false });
				}, 10);
			}
			var foundIdx;
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
		},
		addChild: function(child) {
			var self = this;
			function doAddChild(container, child) {
				if (child.domNode) {
					child.set('parentContainer', self);
					child = child.domNode;
				}
				append(container, child);
				return array.filter(container.childNodes, function (node) { return node.nodeType === 1; /* Element */ }).length - 1;
			}
			if ((!child.domNode) && (typeof(child.show) === 'function')) {
				return def.when(child.show(), function() {
					doAddChild(self.containerNode, child);
				});
			}
			else {
				return doAddChild(this.containerNode, child);
			}
		}
	});
	return FullScreenFrame;
});