define(['../../core/extend', '../Widget', '../Skin', '../../nineplate!./Button.html'], function(extend, Widget, Skin, template) {
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