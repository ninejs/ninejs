(function() {
	'use strict';
	var isAmd = (typeof(define) !== 'undefined') && define.amd;
	var isNode = (typeof(window) === 'undefined');
	var req = require;
	function moduleExport(extend) {
		var RestApi = extend({

		});
		return RestApi;
	}
	if (isAmd) {
		define(['../core/extend'], moduleExport);
	}
	else if (isNode) {
		module.exports = moduleExport(req('../core/extend'));
	}
	else {
		throw new Error('Unsupported environment');
	}
})();