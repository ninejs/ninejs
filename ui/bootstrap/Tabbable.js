define(['../../core/extend', '../Widget', '../Skin', './Tabbable.9plate', '../utils/setClass', '../utils/append', '../utils/setText', '../../core/array', '../../core/on'], function(extend, Widget, Skin, template, setClass, append, setText, array, on) {
	'use strict';
	extend = extend.default;
	Widget = Widget.default;
	Skin = Skin.default;
	setClass = setClass.default;
	append = append.default;
	setText = setText.default;
	on = on.default;
	var Tabbable = extend(Widget, {
		skin: new Skin({ template: template, cssList: [] }),
		autoSelectFirst: true,
		tabsPositionSetter: function(val) {
			setClass(this.domNode, '!tabs-below', '!tabs-left', '!tabs-right');
			if (val === 'left') {
				setClass(this.domNode, 'tabs-left');
				append(this.domNode, this.tabsNode, 'afterBegin');
			}
			else if (val === 'right') {
				setClass(this.domNode, 'tabs-right');
				append(this.domNode, this.tabsNode, 'afterBegin');
			}
			else if (val === 'bottom') {
				setClass(this.domNode, 'tabs-below');
				append(this.domNode, this.tabsNode, 'beforeend');
			}
			else {
				append(this.domNode, this.tabsNode, 'afterBegin');
			}
		},
		onUpdatedSkin: extend.after(function() {
			this.set('tabsPosition', this.tabsPosition);
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
		addChild: function(item) {
			if (!item.domNode) {
				item.show();
			}
			var node = setClass(item.domNode, 'tab-pane');
			if (item.tabEffect) {
				setClass(node, item.tabEffect);
			}
			this.tabContainerNode.appendChild(item.domNode);
			var tabHeader = append(this.tabsNode, 'li');
			var anchor = setText(append(tabHeader, 'a'), item.title);
			anchor.setAttribute('data-toggle', 'tab');
			item.tabHeader = tabHeader;
			var self = this;
			on(anchor, 'click', function() {
				self.onItemClick({ item: item });
			});
			this.items.push(item);
			if ((this.autoSelectFirst) && (this.items.length === 1)) {
				this.onItemClick({ item: item });
			}
			return node;
		},
		onItemClick: function(data) {
			var item = data.item;
			var items = this.items;
			array.forEach(items, function(item) {
				setClass(item.tabHeader, '!active');
				setClass(item.domNode, '!active', '!in');
			});
			setClass(item.tabHeader, 'active');
			setClass(item.domNode, 'active', 'in');
		}
	}, extend.postConstruct(function() {
		/* globals window: true */
		this.items = [];
		this.tabsNode = window.document.createElement('ul');
		setClass(this.tabsNode, 'nav', 'nav-tabs');
	}));
	return Tabbable;
});