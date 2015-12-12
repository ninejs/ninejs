'use strict';

declare var define:{
	(deps:string[], callback:(...rest:any[]) => any): void;
	amd: any;
};
declare var require: any;
declare var global: any;
import * as extend from './core/extend';
import * as moduleConfig from './modules/config';
var isAmd = (typeof(define) !== 'undefined') && define.amd;
var isDojo = isAmd && define.amd.vendor === 'dojotoolkit.org';
var isNode = (typeof(window) === 'undefined');
var req = (isDojo && isNode) ? global.require : require;
var dojoConfig: any;
let _global: any = ((typeof(global) !== 'undefined') ? global : window) || {};
if (isDojo) {
	if (!isNode) {
		dojoConfig = _global.dojoConfig || {};
	}
	else {
		dojoConfig = req('dojo/_base/config');
	}
}
/**
 config module
 @exports config
 */
var r: any;
if (!isNode) {
	_global = window;
}
if (dojoConfig) {
	r = dojoConfig;
}
else if (_global.requirejs) {
	r = _global.requirejs.s.contexts._.config;
}
else {
	r = {};
}
r.ninejs = r.ninejs || {};
extend.mixinRecursive(r.ninejs, _global.ninejsConfig || {});
extend.mixinRecursive(r.ninejs, moduleConfig || {});
export default r;