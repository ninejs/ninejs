/// <amd-dependency path="./less/bootstrap.ncss" />
/// <amd-dependency path="./vresponsive.ncss" />
/// <amd-dependency path="./vresponsive-device.ncss" />
/// <amd-dependency path="../css/common.ncss" />
/// <amd-dependency path="./gridMax.ncss" />

'use strict';

import { StyleObject, StyleInstance } from '../../css';

declare var require: any;

var bootstrapCss: StyleObject = require('./less/bootstrap.ncss'),
	verticalResponsiveCss: StyleObject = require('./vresponsive.ncss'),
	verticalResponsiveDeviceCss: StyleObject = require('./vresponsive-device.ncss'),
	commonCss: StyleObject = require('../css/common.ncss'),
	gridMaxCss: StyleObject = require('./gridMax.ncss');

export class BootstrapProto {
	map: { [name: string]: string };
	enable (...args: string[]) {
		var map = this.map,
			self: any = this;
		if (!args.length) {
			for (var p in map) {
				if (map.hasOwnProperty(p)) {
					self[map[p]].call(this, true);
				}
			}
		}
		else {
			var cnt: number;
			for (cnt = 0; cnt < args.length; cnt += 1) {
				if (self[map[arguments[cnt]]]) {
					self[map[arguments[cnt]]].call(this, true);
				}
			}
		}
	}
	disable (...args: string[]) {
		var map = this.map,
			self: any = this;
		if (!args.length) {
			for (var p in map) {
				if (map.hasOwnProperty(p)) {
					self[map[p]].call(this);
				}
			}
		}
		else {
			var cnt: number;
			for (cnt = 0; cnt < arguments.length; cnt += 1) {
				if (self[map[arguments[cnt]]]) {
					self[map[arguments[cnt]]].call(this);
				}
			}
		}
	}
	bootstrapCss: StyleInstance;
	enableCss (val: boolean) {
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
	}
	commonCss: StyleInstance;
	enableCommonCss (val: boolean) {
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
	}
	verticalResponsiveDeviceCss: StyleInstance;
	enableVResponsiveDevice (val: boolean) {
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
	}
	verticalResponsiveCss: StyleInstance;
	enableVResponsiveViewPort (val: boolean) {
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
	}
	gridMaxCss: StyleInstance;
	enableGridMax (val: boolean) {
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

	constructor () {
		this.map = {
			css: 'enableCss',
			commonCss: 'enableCommonCss',
			vresponsive: 'enableVResponsiveDevice',
			vresponsiveViewPort: 'enableVResponsiveViewPort',
			gridMax: 'enableGridMax'
		};
		var cnt: number;
		for (cnt = 0; cnt < arguments.length; cnt += 1) {
			this.enable(arguments[cnt]);
		}
	}
}

var bootstrap = new BootstrapProto();
//bootstrap.enable('css');
bootstrap.enable('commonCss');
bootstrap.enable('gridMax');

export default bootstrap;