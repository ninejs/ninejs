/*
Dojo Toolkit's dojo/text as of jan 2014
*/
(function() {
	'use strict';
	var isAmd = (typeof(define) !== 'undefined') && define.amd;
	var isDojo = isAmd && define.amd.vendor === 'dojotoolkit.org';
	var isNode = (typeof(window) === 'undefined');
	var req = require;

	if (isAmd) { //AMD
		if (isDojo) {
			define(['dojo/request'], function(request) {
				return request;
			});
		}
		else if (isNode) {
			define(['request'], function(request) {
				return request;
			});
		}
		else {
			throw new Error('Not implemented');
		}
	} else if (isNode) { //Server side
		module.exports = req('request');
	} else {
		// plain script in a browser
		throw new Error('Non AMD environments are not supported');
	}
})(this);