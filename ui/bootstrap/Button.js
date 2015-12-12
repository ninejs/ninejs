define(['../../core/extend', '../Widget', '../Skin', './Button.9plate'], function(extend, Widget, Skin, template) {
	'use strict';
	extend = extend.default;
	Widget = Widget.default;
	Skin = Skin.default;
	var buttonSkin = new Skin({
		template: template
	});
	var Button = extend(Widget, {
		skin: buttonSkin,
		type: 'button'
	});
	return Button;
});