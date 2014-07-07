define(['../../core/extend', '../Widget', '../Skin', '../../nineplate!./ButtonDropdownMenu.html', '../utils/append', '../utils/setClass', '../utils/setText', 'dojo/on', '../../css!./ButtonDropdownMenu.css', '../../core/deferredUtils'], function(extend, Widget, Skin, template, append, setClass, setText, on, css, def) {
	'use strict';
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
	var ButtonDropdownMenu = extend(Widget, {
		skin: new Skin({ template: template, cssList: [css] }),
		labelSetter: function (v) {
			var self = this;
			this.label = v;
			def.when(this.domNode, function () {
				setText(self.labelNode, self.label);
			});
		},
		addItem: function(item, parent, idx) {
			var undef,
				li,
				refNode,
				self = this;
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
			function handleParent(self) {
				setClass(li, 'dropdown-submenu');
				if (item['class']){
					setClass(li, item['class']);
				}
				a = append(li, 'a');
				if (self.hasIcons) {
					iconNode = setClass(append(a, 'i'), 'icon');
				}
				setText(append(a, 'span'), item.label);
				childrenUl = setClass(append(li, 'ul'), 'dropdown-menu');
				var cnt, current;
				for (cnt = 0; cnt < item.children.length; cnt += 1) {
					current = item.children[cnt];
					self.addItem(current, childrenUl);
				}
			}
			var a, iconNode, childrenUl;
			if (item.type === 'divider') {
				setClass(li, 'divider');
			}
			else if (item.type === 'parent') {
				handleParent(this);
			}
			else {
				a = append(li, 'a');
				if (this.hasIcons) {
					iconNode = setClass(append(a, 'i'), 'icon');
				}
				setText(append(a, 'span'), item.label);
				var clickEvent = function() {
					if (self.selectable) {
						setText(self.labelNode, item.label);
					}
					self.set('value', item.value);
					var r;
					if (item.action) {
						r = item.action.apply(item, arguments);
					}
					setClass(self.domNode, '!open');
					return r;
				};
				on(li, 'mousedown', clickEvent);
			}
			return { listItem: li, anchor: a, iconNode: iconNode, childrenListNode: childrenUl, item: item };
		},
		updateSkin: extend.after(function() {
			var anchor = this.anchor, self = this;
			this.own(
				on(anchor, 'click', function() {
					setClass(self.domNode, '~open');
					anchor.focus();
					return false;
				}),
				on(this.domNode, 'click', function(evt) {
					//Just prevent clicks to myself from bubbling to document.body
					evt.stopPropagation();
					on.emit(self.domNode.ownerDocument.body, '9jsclosewidgets', { element: self.domNode });
					return false;
				}),
				on(this.domNode.ownerDocument.body, '9jsclosewidgets', function(data) {
					if (data.element !== self.domNode) {
						setClass(self.domNode, '!open');
					}
				})
			);
		})
	}, function() {
		extend.mixin(this, {
			hasIcons: false,
			value: null
		});
	});
	return ButtonDropdownMenu;
});