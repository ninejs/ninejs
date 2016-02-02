/* jshint unused: false */
'use strict';
var amdExclude = [
	'coverage', 
	'node_modules', 
	'Gruntfile.js', 
	'tests/', 
	'/_nineplate/utils/node/text', 
	'/_nineplate/utils/parser/commonjs', 
	'/_nineplate/utils/parser/grammar', 
	'/modules/ninejs-server', 
	'/modules/serverBoot', 
	'/modules/webserver', 
	'/lib/', 
	'/out/', 
	'/grunt/'
];
var amdIgnore = [
	'ninejs/modules/webserver', 
	'ninejs/modules/serverBoot', 
	'ninejs/modules/ninejs-server', 
	'ninejs/listts', 
	'ninejs/docs'
];

var profile = {
	resourceTags: {
		ignore: function(filename){
			var t = (/node_modules/).test(filename);
			if (!t) {
				var cnt, excluded = !(/\.js$/).test(filename);
				for (cnt=0;(cnt < amdIgnore.length) && !excluded; cnt += 1){
					if (filename.indexOf(amdIgnore[cnt]) >= 0) {
						excluded = true;
					}
				}
				t = excluded;
			}
			return t;
		},
		amd: function (filename/*, mid*/) {
			var cnt, excluded = !(/\.js$/).test(filename);
			for (cnt=0;(cnt < amdExclude.length) && !excluded; cnt += 1){
				if (filename.indexOf(amdExclude[cnt]) >= 0) {
					excluded = true;
				}
			}
			return !excluded;
		}
	}
};