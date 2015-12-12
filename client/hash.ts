'use strict';

export default function hash(newHash?: string, replace?: boolean) {
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