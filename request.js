/*
Dojo Toolkit's dojo/request as of jan 2014
*/
(function (factory) {
	'use strict';
	var req = require;
	if (typeof (define) === 'function' && define.amd) {
		if (define.amd.vendor === 'dojotoolkit.org') {
			define(['dojo/request'], factory);
		}
		else {
			define(['request'], factory);
		}
	}
	else if (typeof(exports) === 'object') {
		module.exports = factory(req('request'));
	}
})(function (request) {
	'use strict';
	return request;
});