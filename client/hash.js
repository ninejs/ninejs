/* global window */
define([], function () {
	'use strict';
	var hash;
	hash = function (/* String? */ newHash, /* Boolean? */ replace) {
		// getter
		if (!arguments.length) {
			return window.location.hash;
		}
		// setter
		if (newHash.charAt(0) === '#') {
			newHash = newHash.substring(1);
		}
		if (replace) {
			window.location.replace('#' + newHash);
		} else {
			window.location.href = '#' + newHash;
		}
	};

	return hash;
});