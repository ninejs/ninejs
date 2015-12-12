define(['../../core/extend', '../Widget', '../Skin', './NavList.9plate', '../utils/setClass', '../utils/append', '../utils/setText', '../../core/array', '../../core/on', './NavList.ncss'], function(extend, Widget, Skin, template, setClass, append, setText, array, on, css) {
	'use strict';
	extend = extend.default;
	Widget = Widget.default;
	Skin = Skin.default;
	setClass = setClass.default;
	append = append.default;
	setText = setText.default;
	on = on.default;
	css.enable();
	var NavList = extend(Widget, {
		skin: new Skin({ template: template, cssList: [] }),
		autoSelectFirst: true,
		navClass: 'nav-list',
		updateSkin: extend.after(function() {
			if (this.autoSelectFirst && this.items[0]) {
				this.onItemClick({ item: this.items[0] });
			}
		}),
		selectedItemSetter: function(val) {
			var found;
			if (typeof(val) === 'string'){
				array.some(this.items, function(item) {
					if (item.id === val) {
						found = item;
					}
					return !!found;
				});
			}
			else {
				found = this.items[val];
			}
			if (found) {
				this.onItemClick({ item: found });
			}
		},
		/* item can have label, tooltip, id (defaults to label), action, type (divider, parent, header), children */
		addItem: function(item, parentNode) {
			if (!parentNode) {
				if (!this.domNode) {
					this.show();
				}
				parentNode = this.domNode;
			}
			var addCommand = this.itemConstructMap[item.type || 'item'];
			var node = addCommand.call(this, parentNode, item);
			item.domNode = node;
			this.items.push(item);
			return node;
		},
		addParent: function(parentNode, item) {
			var self = this;
			if (item.label) {
				this.addItem({ label: item.label, type: 'header' }, parentNode);
			}
			var node = setClass(append(parentNode, 'ul'), 'nav', 'nav-list');
			array.forEach(item.children, function(child) {
				self.addItem(child, node);
			});
			return node;
		},
		addNormalItem: function(parentNode, item) {
			var node = setClass(append(parentNode, 'li'), 'normalMenuItem');
			var anchor = setText(append(node, 'a'), item.label);
			var self = this;
			on(anchor, 'click', function() {
				self.onItemClick({ item: item });
			});
			return node;
		},
		addDivider: function(parentNode) {
			return setClass(append(parentNode, 'li'), 'divider');
		},
		addHeader: function(parentNode, item) {
			return setText(setClass(append(parentNode, 'li'), 'nav-header'), item.label);
		},
		onItemClick: function(data) {
			var item = data.item;
			var items = this.items;
			array.forEach(items, function(item) {
				setClass(item.domNode, '!active');
			});
			setClass(item.domNode, 'active');
			if (item.action) {
				item.action.call(this);
			}

		}
	}, extend.postConstruct(function() {
		this.items = [];
		this.itemConstructMap = {
			divider: this.addDivider,
			item: this.addNormalItem,
			parent: this.addParent,
			header: this.addHeader
		};
	}));
	return NavList;
});