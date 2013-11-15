define(['../../Skin', '../../../css!./Default.css', '../../../nineplate!./Default.html'], function(Skin, css, template) {
	'use strict';
	return new Skin({
		template: template.compileDom(),
		cssList: [css]
	});
});