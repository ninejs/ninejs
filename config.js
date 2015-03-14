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
	function moduleExport(extend, dojoConfig) {
		var r = {};
		if (dojoConfig) {
			extend.mixinRecursive(r, dojoConfig.ninejs || {});
		}
		extend.mixinRecursive(r, global.ninejsConfig || {});
		return r;
	}

	if (isAmd) { //AMD
		define(['./core/extend', './modules/config'], moduleExport);
	} else if (isNode) { //Server side
		module.exports = moduleExport(req('./core/extend'), req('./modules/config'));
	} else {
		// plain script in a browser
		throw new Error('Non AMD environments are not supported');
	}
})(this);
