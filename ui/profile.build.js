/* jshint unused: false */
'use strict';
var profile = {
	resourceTags: {
		amd: function (filename/*, mid*/) {
			return (filename.indexOf('node_modules') < 0) && (/\.js$/).test(filename);
		}
	}
};