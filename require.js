/*
 Just a require wrapper
 */
(function (factory) {
	'use strict';
	if (typeof (define) === 'function' && define.amd) {
		define([], factory);
	}
	else if (typeof(exports) === 'object') {
		module.exports = factory();
	}
})(function() {
	'use strict';
	var isAmd = (typeof(define) === 'function') && define.amd;
	var isNode = (typeof(window) === 'undefined');

	if (isAmd) { //AMD
		if (isNode) {
			return global.require;
		}
		else {
			return require;
		}
	} else if (isNode) { //Server side
		module.exports = require;
	} else {
		// plain script in a browser
		throw new Error('Non AMD environments are not supported');
	}
});