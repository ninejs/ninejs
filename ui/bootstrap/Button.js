define(['../../core/extend', '../Widget', '../Skin', '../../nineplate!./Button.html', './bootstrap'], function(extend, Widget, Skin, template) {
	'use strict';
	var buttonSkin = new Skin({
		template: template
	});
	var Button = extend(Widget, {
		skin: buttonSkin,
		type: 'button'
	});
	return Button;
});