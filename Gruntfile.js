/*
 * ninejs grunt configuration file
 */
function exports(grunt) {
	'use strict';

	var jsFiles = ['bin/ninejs', '*.js', '**/*.js', '!node_modules/**', '!out/**', '!nineplate/utils/parser/**/commonjs.js', '!nineplate/utils/parser/**/amd.js', '!nineplate/tests/template-generated.js', '!modernizer.js', '!modules/webserver/jsClientUtils/*'],
		testFiles = ['**/tests/**/*.js', '!coverage/**', '!**/tests/**/phantom*.js', '!node_modules/**', '!out/**', '!nineplate/tests/template-generated.js'],
		phantomWatch = ['nineplate/tests/phantomTest.js'],
		underscore = require('underscore'),
		stylusFiles = [ '**/*.styl', '!node_modules/**', '!ui/bootstrap/extension.styl' ],
		lessFiles = ['ui/bootstrap/less/bootstrap.less', 'ui/bootstrap/less/responsive.less'],
		ncssFiles = ['ui/bootstrap/less/bootstrap.ncss', 'ui/bootstrap/less/responsive.ncss'],
		Q = require('q');

	// Project configuration.
	grunt.initConfig({
		mocha: { //Phantomjs
			index: {
				src: ['nineplate/tests/phantomTest.html']
			}
		},
		jscoverage: {
			all: {
				src: testFiles
			}
		},
		mochaTest: {
			normal: {
				src: testFiles,
				options: {
					reporter: 'spec',
					globals: [],
					require: 'jscoverage'
				}
			},
			watch: {
				src: testFiles,
				options: {
					reporter: 'spec',
					globals: []
				}
			},
			cover: {
				src: testFiles,
				options: {
					reporter: 'html-cov',
					quiet: true,
					captureFile: 'coverage.html',
					globals: []
				}
			}
		},
		watch: {
			jshint : {
				files : jsFiles,
				tasks : 'jshint'
			},
			stylus: {
				files: stylusFiles,
				tasks: ['stylus']
			},
			phantom: {
				files: underscore.union(phantomWatch, jsFiles),
				tasks: ['mocha']
			},
			test: {
				files: underscore.union(testFiles, jsFiles),
				tasks: ['jshint', 'generateParsers', 'mochaTest:watch', 'mocha']
			}

		},
		jshint: {
			files: jsFiles,
			options: {
				bitwise : true,
				camelcase : true,
				forin : true,
				indent : true,
				noempty : true,
				nonew : true,
				plusplus : true,
				maxdepth : 8,
				maxcomplexity : 10,
				strict : true,
				quotmark : 'single',
				regexp : true,
				unused : 'strict',
				curly : true,
				eqeqeq : true,
				immed : true,
				latedef : true,
				newcap : true,
				noarg : true,
				sub : true,
				undef : true,
				boss : true,
				eqnull : true,
				node : true,
				dojo : false,
				passfail : false,
				trailing : true,
				scripturl : true,
				shadow : true,
				browser : false,
				smarttabs : true,
				globals : {
					localStorage : true,
					define : true
				}
			}
		},
		stylus:
		{
			files: stylusFiles,
			options:
			{
				urlfunc: 'embedurl', // use embedurl('test.png') in our code to trigger Data URI
				compress: true
			}
		},
		less:
		{
			files: lessFiles,
			options:
			{
				extension: 'ncss'
			}
		},
		ncss:
		{
			files: ncssFiles,
			options: {}
		}
	});

	grunt.loadNpmTasks('grunt-njs-css');
	grunt.loadNpmTasks('grunt-mocha-test');
	grunt.loadNpmTasks('grunt-contrib-jshint');
	grunt.loadNpmTasks('grunt-contrib-watch');
	grunt.task.loadTasks('nineplate/utils/parser/gruntTasks');
	grunt.registerMultiTask('mocha','run Phantomjs tests with Mocha', function() {
		var done = this.async(),
			files = this.filesSrc,
			queues = [],
			command = 'mocha-phantomjs',
			platform = require('os').platform();
		if ((/win/).test(platform)) {
			command += '.cmd';
		}

		files.forEach(function(file) {
			var childProcess = require('child_process'),
				defer = Q.defer();
			queues.push(defer.promise);
			var mochaPhantom = childProcess.spawn(command, [file], { stdio: 'inherit' });
			mochaPhantom.on('exit', function(/*code*/) {
				defer.resolve();
			});
		});
		Q.all(queues).then(function() {
			done();
		});
	});
	grunt.registerMultiTask('jscoverage','copy test coverage instrumentation', function() {
		var done = this.async(),
			path = require('path'),
			Q = require('kew'),
			childProcess = require('child_process');
			Q.all(this.filesSrc.map(function (testFile) {
				var command = path.resolve(__dirname, 'node_modules', 'mocha', 'bin', 'mocha'),
					args = ['-r', 'jscoverage', '--covignore', 'coverage.ignore', '--covout=html', '--covinject=true', testFile],
					defer = Q.defer();
				console.log(command + ' ' + args.join(' '));
				var mochaCmd = childProcess.spawn(command, args, { stdio: 'inherit' });
				mochaCmd.on('exit', function (code) {
					console.log('exit code');
					console.log(code);
					defer.resolve();
				});
				return defer.promise;
			})
		).fail(function (err) {
			console.log(err);
		}).then(function () {
			done();
		});
	});

	grunt.registerTask('test', ['mochaTest', 'mocha']);
	grunt.registerTask('css', ['less', 'ncss', 'stylus']);
	grunt.registerTask('cover', ['jscoverage']);
	// Default task.
	grunt.registerTask('default', ['jshint', 'css', 'generateParsers', 'jscoverage', 'test']);

}

module.exports = exports;