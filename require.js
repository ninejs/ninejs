/*
 Just a require wrapper
 */
(function() {
	'use strict';
	var isAmd = (typeof(define) !== 'undefined') && define.amd;
	var isNode = (typeof(window) === 'undefined');
	var req = require;

	if (isAmd) { //AMD
		define([], function() {
			return require;
		});
	} else if (isNode) { //Server side
		module.exports = req;
	} else {
		// plain script in a browser
		throw new Error('Non AMD environments are not supported');
	}
})(this);