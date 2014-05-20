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
		extend.mixinRecursive(global.ninejsConfig || {});
		return r;
	}

	if (isAmd) { //AMD
		//Testing for dojo toolkit
		if (isDojo) {
			define(['./core/extend', 'dojo/_base/config'], moduleExport);
		} else {
			//Trying for RequireJS and hopefully every other
			define(['./core/extend'], moduleExport);
		}
	} else if (isNode) { //Server side
		module.exports = moduleExport(req('./core/extend'));
	} else {
		// plain script in a browser
		throw new Error('Non AMD environments are not supported');
	}
})(this);
