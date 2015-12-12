define(['../../core/extend', '../Widget', '../Skin', './Dropdown.9plate', '../utils/append', '../utils/setClass', '../utils/setText', '../../core/on'], function(extend, Widget, Skin, template, append, setClass, setText, on) {
	'use strict';
	extend = extend.default;
	Widget = Widget.default;
	Skin = Skin.default;
	append = append.default;
	setClass = setClass.default;
	setText = setText.default;
	on = on.default;
	function getChildElement(parent, idx) {
		var cnt, children = parent.childNodes, i = -1;
		for (cnt = 0; cnt < children.length; cnt += 1) {
			if (children[cnt].nodeType === 1) {
				i += 1;
			}
			if (i === idx) {
				return children[cnt];
			}
		}
		return null;
	}
	var Dropdown = Widget.extend({
		skin: new Skin({ template: template, cssList: [] }),
		pullRightSetter: function(val) {
			if (!!val) {
				setClass(this.domNode, 'pull-right');
			}
			else {
				setClass(this.domNode, '!pull-right');
			}
		},
		addItem: function(item, parent, idx) {
			var undef,
				li,
				refNode,
				types,
				a,
				iconNode,
				childrenUl;
			types = {
				divider: function(li/*, item*/) {
					return setClass(li, 'divider');
				},
				header: function(li, item) {
					return setText(setClass(li, 'dropdown-header'), item.label);
				},
				parent: function(li, item) {
					setClass(li, 'dropdown-submenu', 'cursor-pointer');
					if (item['class']){
						setClass(li, item['class']);
					}
					childrenUl = setClass(append(li, 'ul'), 'dropdown-menu');
					a = append(li, 'a');
					a.tabindex = -1;
					if (this.hasIcons) {
						iconNode = setClass(append(a, 'span'), 'icon');
					}
					setText(append(a, 'span'), item.label);
					var cnt, current;
					for (cnt = 0; cnt < item.children.length; cnt += 1) {
						current = item.children[cnt];
						this.addItem(current, childrenUl);
					}
					return li;
				},
				'default': function(li, item) {
					a = setClass(append(li, 'a'), 'cursor-pointer');
					a.tabindex = -1;
					if (this.hasIcons) {
						iconNode = setClass(append(a, 'span'), 'icon');
					}
					setText(append(a, 'span'), item.label);
					if (item.action) {
						var clickEvent = function() {
							item.action.apply(item, arguments);
						};
						on(li, 'mousedown', clickEvent);
					}
				}
			};
			parent = parent || this.itemsParent;
			if (idx !== undef){
				refNode = getChildElement(parent, idx);
				if (refNode) {
					li = append(refNode, 'li', 'beforeBegin');
				}
				else {
					li = append(parent, 'li');
				}
			}
			else {
				li = append(parent, 'li');
			}
			types[item.type || 'default'].call(this, li, item);

			return { listItem: li, anchor: a, iconNode: iconNode, childrenListNode: childrenUl, item: item };
		},
		updateSkin: extend.after(function() {
			var anchor = this.anchor, self = this;
			on(anchor, 'click', function() {
				setClass(self.domNode, '~open');
				anchor.focus();
				return false;
			});
			on(anchor, 'blur', function() {
				setClass(self.domNode, '!open');
			});
		})
	}, function() {
		extend.mixin(this, {
			hasIcons: false
		});
	});
	return Dropdown;
});