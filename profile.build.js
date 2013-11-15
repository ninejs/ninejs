/* jshint unused: false */
'use strict';
var amdExclude = ['coverage', 'node_modules', 'Gruntfile.js', 'tests/', '/nineplate/utils/node/text', '/nineplate/utils/parser/commonjs', '/nineplate/utils/parser/grammar', '/nineplate/utils/parser/gruntTasks/gruntGenerateParser', '/modules/ninejs-server', '/modules/serverBoot', '/modules/webserver', '/lib/build'];
var profile = {
	resourceTags: {
		ignore: function(filename){
			return (/node_modules/).test(filename);
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