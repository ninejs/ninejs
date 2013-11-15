define(['../../core/extend', '../Widget', '../Skin', '../../nineplate!./SplitButtonDropdown.html', '../utils/append', '../utils/setClass', '../utils/setText', 'dojo/on', '../../css!./SplitButtonDropdown.css'], function (extend, Widget, Skin, template, append, setClass, setText, on, css) {
	'use strict';
	var SplitButtonDropdown = extend(Widget, {
		skin: new Skin({ template: template, cssList: [css] }),
		addItem: function(item) {
			var parent = this.itemsParent;
			var li = append(parent, 'li');
			var a ;

			a = append(li, 'a');
			setClass( setText(append(a, 'span'), item.label), 'itemLabel');
			if (item.action) {
				var clickEvent = function() {
					item.action.apply(item, arguments);
				};
				on(li, 'click', clickEvent);
			}
			return { listItem: li, anchor: a, item: item };
		},
		updateSkin: extend.after(function() {
			var anchor = this.anchor, self = this;
			setText(self.action, self.label);
			this.own(
				on(self.action, 'click', function (evt) {
					self.emit('click', evt);
				}),
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
		});
	});
	return SplitButtonDropdown;
});