'use strict';
var deferredUtils = require('../core/deferredUtils');
exports.build = function(/*target*/) {
	var defer = deferredUtils.defer();
	return defer.promise;
};