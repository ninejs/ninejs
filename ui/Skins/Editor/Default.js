define(['../../Skin', '../../../nineplate!./Default.html', '../../../css!./Default.css'], function(Skin, template, css) {
	'use strict';
	return new Skin({
		template: template,
		cssList: [css]
	});
});