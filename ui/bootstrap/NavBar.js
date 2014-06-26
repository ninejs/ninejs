define(['../../core/extend', '../Widget', '../Skin', '../../nineplate!./NavBar.html', '../../css!./NavBar.css', '../utils/append', '../utils/setText', '../utils/setClass', 'dojo/on'], function(extend, Widget, Skin, template, css, append, setText, setClass, on) {
	'use strict';
	var copyClasses = function (fromObj, toNode){
			var classArray,
				cnt,
				aClass;

			if (fromObj['class']) {
				if (Object.prototype.toString.call(fromObj['class']) === '[object Array]') {
					classArray = fromObj['class'];
				} else {
					classArray = fromObj['class'].split(' ');
				}

				for (cnt = 0; cnt < classArray.length; cnt += 1) {
					aClass = classArray[cnt];
					if (aClass) {
						setClass(toNode, aClass);
					}
				}
			}
		};

	var NavBar = extend(Widget, {
		skin: new Skin({ template: template, cssList: [css] }),
		role: 'navigation',
		brandHref: '#',
		brandSetter: function(val) {
			this.brand = val;
			on.once(this, 'updatedSkin', function() {
				if (!val) {
					setClass(this.brandNode, 'hidden');
				}
				else {
					setClass(this.brandNode, '!hidden');
				}
			});
		},
		updateSkin: extend.after(function() {
			var self = this;
			on(this.barToggle, 'click', function() {
				if (self.collapsed) {
					setClass(self.collapseTarget, '!collapse', 'collapsing');
					setClass(self.barToggle, '!collapsed');
					setTimeout(function() {
						setClass(self.collapseTarget, 'in');
					}, 10);
					setTimeout(function() {
						setClass(self.collapseTarget, '!collapsing');
					}, 350);
				}
				else {
					setClass(self.collapseTarget, '!in', 'collapsing');
					setClass(self.barToggle, 'collapsed');
					setTimeout(function() {
						setClass(self.collapseTarget, '!collapsing', 'collapse');
					}, 350);
				}
				self.collapsed = !self.collapsed;
			});
		}),
		deactivateItem: function() {
			if (this.activeItem) {
				setClass(this.activeItem, '!active');
			}
		},
		activateItem: function(item) {
			this.activeItem = item;
			setClass(this.activeItem, 'active');
		},
		addItem: function(item, parentNode) {
			var self = this;
			parentNode = parentNode || this.itemContainer;
			var newItemNode;
			if (item['$njsWidget']) {
				item.show(parentNode);
				newItemNode = item.domNode;
			}
			else {
				if (!item.domNode) {
					newItemNode = setClass(append(parentNode, 'li'), 'cursor-pointer');
					newItemNode.title = item.tooltip || '';
					if (item.id) {
						newItemNode.setAttribute('data-tabKey', item.id);
					}
					setText(append(newItemNode, 'a'), item.label);
					if (item.action) {
						on(newItemNode, 'click', function() {
							self.deactivateItem();
							item.action.apply(this, arguments);
							self.activateItem(this);
						});
					}
				}
				else {
					newItemNode = append(parentNode, item.domNode);
				}
				copyClasses.call(this, item, newItemNode);
			}

			return newItemNode;
		}
	}, function() {
		/* global window */
		var self = this;
		this.collapsed = true;
		this.own(
			on(window, '9jsRouteChanged', function(evt) {
				if (typeof(evt.tabKey) !== 'undefined') {
					self.deactivateItem();
					if ((evt.tabKey !== null) && (self.itemContainer)) {
						var nodes = self.itemContainer.childNodes,
							cnt,
							len = nodes.length,
							current;
						for (cnt = 0; cnt < len; cnt += 1) {
							current = nodes[cnt];
							if (current.getAttribute('data-tabKey') === evt.tabKey) {
								self.activateItem(current);
							}
						}
					}
				}
			})
		);
	});
	return NavBar;
});