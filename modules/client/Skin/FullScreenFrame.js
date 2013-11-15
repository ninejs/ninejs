define(['../../../ui/Skin', '../../../css!./FullScreenFrame.css', '../../../nineplate!./FullScreenFrame.html'], function (Skin, css, template) {
	'use strict';
	return new Skin({
		cssList: [css],
		template: template
	});
});