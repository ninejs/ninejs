/**
 @module config
 @author Eduardo Burgos <eburgos@gmail.com>
 */
(function (global) {
	'use strict';
	global = global || {};
	var isAmd = (typeof(define) !== 'undefined') && define.amd;
	var isDojo = isAmd && define.amd.vendor === 'dojotoolkit.org';
	var isNode = (typeof(window) === 'undefined');
	var req = (isDojo && isNode) ? global.require : require;

	/**
	 config module
	 @exports config
	 */
	function moduleExport(extend, moduleConfig, dojoConfig) {
		var r;
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
		return r;
	}

	if (isAmd) { //AMD
		if (isDojo) {
			define(['./core/extend', './modules/config', 'dojo/_base/config'], moduleExport);
		}
		else {
			define(['./core/extend', './modules/config'], moduleExport);
		}
	} else if (isNode) { //Server side
		module.exports = moduleExport(req('./core/extend'), req('./modules/config'));
	} else {
		// plain script in a browser
		throw new Error('Non AMD environments are not supported');
	}
})(this);
