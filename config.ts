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
if (isDojo) {
	dojoConfig = req('dojo/_base/config');
}
/**
 config module
 @exports config
 */
var r: any;
if (dojoConfig) {
	r = dojoConfig;
}
else if (global.requirejs) {
	r = global.requirejs.s.contexts._.config;
}
else {
	r = {};
}
r.ninejs = r.ninejs || {};
extend.mixinRecursive(r.ninejs, global.ninejsConfig || {});
extend.mixinRecursive(r.ninejs, moduleConfig || {});
export default r;