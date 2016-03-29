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
	'ninejs/grunt',
	'ninejs/ui/ComboButton',
	'ninejs/ui/menu/VerticalMenu',
	'ninejs/ui/logic/FilterBuilder',
	'ninejs/_css/build/',
	'ninejs/_nineplate/tests',
	'ninejs/_nineplate/utils/parser/grammar',
	'ninejs/_nineplate/utils/parser/commonjs',
	'ninejs/_nineplate/utils/parser/generated/commonjs',
	'ninejs/docs',
	'ninejs/profile.build',
	'ninejs/out',
	'ninejs/coverage',
	'ninejs/Gruntfile',
	'ninejs/core/tests',
	'ninejs/lib'
];

var profile = {
	resourceTags: {
		ignore: function(filename, mid){
			var t = (/node_modules/).test(mid);
			if (!t) {
				var cnt, excluded = !(/\.js(on)?$/).test(filename);
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