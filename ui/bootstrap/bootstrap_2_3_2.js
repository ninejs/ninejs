define(['./BootstrapProto', '../../css!./less/responsive_2_3_2.css', '../../css!./less/bootstrap_2_3_2.css'], function(Bootstrap, responsiveCss, bootstrapCss) {
	'use strict';
	var bootstrap = new Bootstrap();
	bootstrap.map.responsive = 'enableResponsive';
	bootstrap.map.css = 'enableCss232';
	bootstrap.enableResponsive = function(val) {
		if (!this.responsiveCss) {
			if (val) {
				this.responsiveCss = responsiveCss.enable();
			}
		}
		else {
			if (val) {
				this.responsiveCss.enable();
			}
			else {
				this.responsiveCss.disable();
			}
		}
	};
	bootstrap.enableCss232 = function(val) {
		if (!this.bootstrapCss) {
			if (val) {
				this.bootstrapCss = bootstrapCss.enable();
			}
		}
		else {
			if (val) {
				this.bootstrapCss.enable();
			}
			else {
				this.bootstrapCss.disable();
			}
		}
	};
	bootstrap.enable('css');
	return bootstrap;
});