'use strict';
/* jshint unused: true */
function load(name, req, onLoad/*, config*/) {
	var fs = require('fs');
	fs.readFile(name, 'utf8', function(error, data) {
		if (error) {
			throw new Error(error);
		}
		else {
			onLoad(data);
		}
	});
}
exports.load = load;