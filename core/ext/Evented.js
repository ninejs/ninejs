/** 
@module ninejs/core/ext/Evented 
@author Eduardo Burgos <eburgos@gmail.com>
This is just an abstraction that detects if it's running in client side to return dojo/_base/Deferred or server side to return kriskowal's Q
*/
(function() {
	'use strict';
	var isAmd = (typeof(define) !== 'undefined') && define.amd;
	var isDojo = isAmd && define.amd.vendor === 'dojotoolkit.org';
	var isNode = (typeof(window) === 'undefined');
	var req = (isDojo && isNode)? global.require : require;

	function evented(Evented) {
		return Evented;
	}

	if (isAmd) { //AMD
		//Testing for dojo toolkit
		if (isDojo) {
			define(['dojo/Evented'], evented);
		} else {
			throw new Error('Evented is unsupported in non-Dojo AMD');
		}
	} else if (isNode) { //Server side
		var Evented = req('events').EventEmitter;
		module.exports = evented(Evented);
	} else {
		// plain script in a browser
		throw new Error('Non AMD environments are not supported');
	}
})();