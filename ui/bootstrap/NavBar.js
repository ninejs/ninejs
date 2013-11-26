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
					setText(append(newItemNode, 'a'), item.label);
					if (item.action) {
						on(newItemNode, 'click', function() {
							if (self.activeItem) {
								setClass(self.activeItem, '!active');
							}
							item.action.apply(this, arguments);
							self.activeItem = this;
							setClass(self.activeItem, 'active');
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
		this.collapsed = true;
	});
	return NavBar;
});