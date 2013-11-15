define(['../../ui/Widget', './Skin/FullScreenFrame', '../../ui/utils/append', '../../ui/utils/setClass', 'dojo/query'], function(Widget, defaultSkin, append, setClass, query) {
	'use strict';
	function isNumber(n) {
		return !isNaN(parseFloat(n)) && isFinite(n);
	}
	var FullScreenFrame = Widget.extend({
		skin: defaultSkin,
		selectedSetter: function(idx) {
			var cnt,
				arr = query('> *', this.containerNode),
				len = arr.length,
				target,
				current;
			if (isNumber(idx)) {
				target = arr[idx];
			}
			else if (idx.domNode) {
				target = idx.domNode;
			}
			else {
				target = idx;
			}
			for (cnt = 0; cnt < len; cnt += 1) {
				current = arr[cnt];
				setClass(current, '!active');
				if (current === target) {
					setClass(arr[cnt], 'active');
				}
			}
		},
		addChild: function(child) {
			append(this.containerNode, child);
			return query('> *', this.containerNode).length - 1;
		}
	});
	return FullScreenFrame;
});