define(['../../core/extend', '../../css!./less/bootstrap.css', '../../css!./vresponsive.css', '../../css!./vresponsive-device.css', '../../css!../css/common.css', '../../css!./gridMax.css'], function(extend, bootstrapCss, verticalResponsiveCss, verticalResponsiveDeviceCss, commonCss, gridMaxCss) {
	'use strict';
	var Bootstrap = extend({
		enable: function(val) {
			var map = this.map;
			if (!val) {
				for (var p in map) {
					if (map.hasOwnProperty(p)) {
						this[map[p]].call(this, true);
					}
				}
			}
			else {
				var cnt;
				for (cnt = 0; cnt < arguments.length; cnt += 1) {
					if (this[map[arguments[cnt]]]) {
						this[map[arguments[cnt]]].call(this, true);
					}
				}
			}
		},
		disable: function (val) {
			var map = this.map;
			if (!val) {
				for (var p in map) {
					if (map.hasOwnProperty(p)) {
						this[map[p]].call(this);
					}
				}
			}
			else {
				var cnt;
				for (cnt = 0; cnt < arguments.length; cnt += 1) {
					if (this[map[arguments[cnt]]]) {
						this[map[arguments[cnt]]].call(this);
					}
				}
			}
		},
		enableCss: function (val) {
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
		},
		enableCommonCss: function (val) {
			if (!this.commonCss) {
				if (val) {
					this.commonCss = commonCss.enable();
				}
			}
			else {
				if (val) {
					this.commonCss.enable();
				}
				else {
					this.commonCss.disable();
				}
			}
		},
		enableVResponsiveDevice: function (val) {
			if (!this.verticalResponsiveDeviceCss) {
				if (val) {
					this.verticalResponsiveDeviceCss = verticalResponsiveDeviceCss.enable();
				}
			}
			else {
				if (val) {
					this.verticalResponsiveDeviceCss.enable();
				}
				else {
					this.verticalResponsiveDeviceCss.disable();
				}
			}
		},
		enableVResponsiveViewPort: function (val) {
			if (!this.verticalResponsiveCss) {
				if (val) {
					this.verticalResponsiveCss = verticalResponsiveCss.enable();
				}
			}
			else {
				if (val) {
					this.verticalResponsiveCss.enable();
				}
				else {
					this.verticalResponsiveCss.disable();
				}
			}
		},
		enableGridMax: function (val) {
			if (!this.gridMaxCss) {
				if (val) {
					this.gridMaxCss = gridMaxCss.enable();
				}
			}
			else {
				if (val) {
					this.gridMaxCss.enable();
				}
				else {
					this.gridMaxCss.disable();
				}
			}
		}
	}, function () {
		this.map = {
			css: 'enableCss',
			commonCss: 'enableCommonCss',
			vresponsive: 'enableVResponsiveDevice',
			vresponsiveViewPort: 'enableVResponsiveViewPort',
			gridMax: 'enableGridMax'
		};
		var cnt;
		for (cnt = 0; cnt < arguments.length; cnt += 1) {
			this.enable(arguments[cnt]);
		}
	});
	return Bootstrap;
});