/*
 * ninejs grunt configuration file
 */
function exports(grunt) {
	'use strict';

	var jsFiles = ['bin/ninejs', '*.js', '**/*.js', '!node_modules/**', '!out/**', '!nineplate/utils/parser/**/commonjs.js', '!nineplate/utils/parser/**/amd.js', '!nineplate/tests/template-generated.js', '!modernizer.js', '!modules/webserver/jsClientUtils/*'],
		testFiles = ['**/tests/**/*.js', '!coverage/**', '!**/tests/**/phantom*.js', '!node_modules/**', '!out/**', '!nineplate/tests/template-generated.js'],
		phantomWatch = ['nineplate/tests/phantomTest.js'],
		stylusFiles = [ '**/*.styl', '!node_modules/**', '!ui/bootstrap/extension.styl' ],
		lessFiles = ['ui/bootstrap/less/bootstrap.less', 'ui/bootstrap/less/responsive.less'],
		ncssFiles = ['ui/bootstrap/less/bootstrap.ncss', 'ui/bootstrap/less/responsive.ncss'],
		tsfiles = ['**/*.ts', '!**/*.d.ts', '!node_modules/**/*.ts'],
		Q = require('kew');

	require('load-grunt-tasks')(grunt);
	// Project configuration.
	grunt.initConfig({
		mocha: { //Phantomjs
			index: {
				src: ['nineplate/tests/phantomTest.html']
			}
		},
		mochaTest: {
			normal: {
				src: testFiles,
				options: {
					reporter: 'spec',
					globals: []
				}
			},
			watch: {
				src: testFiles,
				options: {
					reporter: 'spec',
					globals: []
				}
			}
		},
		watch: {
			//jshint : {
			//	files : jsFiles,
			//	tasks : 'jshint'
			//},
			ts: {
				files : tsfiles,
				tasks : 'ts'
			},
			stylus: {
				files: stylusFiles,
				tasks: ['stylus']
			},
			phantom: {
				files: phantomWatch.slice(0).concat(jsFiles),
				tasks: ['mocha']
			}
			//,
			//test: {
			//	files: testFiles.slice(0).concat(jsFiles),
			//	tasks: ['generateParsers', 'mochaTest:watch', 'mocha']
			//}

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
		},
		ts: {
			default : {
				src: tsfiles,
				options: {
					compiler: './node_modules/typescript/bin/tsc',
					comments: false,
					declaration: true,
					noImplicitAny: true,
					module: 'umd',
					target: 'es5',
					experimentalAsyncFunctions: true,
					isolatedModules: true
				}
			}
		},
		tsd: {

		},
		dts_bundle: {
			build: {
				options: {
					name: 'ninejs',
					main: '9js.d.ts',
					exclude: function (n, external) {
						return /*external || (n.indexOf('typings/') >= 0) ||*/ (n.indexOf('node_modules') >= 0);
					},
					prefix: '',
					externals: false,
					referenceExternals: true,
					verbose: false,
					removeSource: false
				}
			}
		},
		globaltsd: {
			options: {
				target: __dirname + '/9js.ts',
				baseDir: __dirname,
				exclude: [
					'ninejs.d.ts',
					'9js.d.ts',
					'typings',
					'node_modules'
				],
				references: [
					'./typings/node/node.d.ts'
				]
			}
		}
	});

	grunt.loadNpmTasks('grunt-njs-css');
	grunt.loadNpmTasks('grunt-mocha-test');
	grunt.loadNpmTasks('grunt-contrib-jshint');
	grunt.loadNpmTasks('grunt-contrib-watch');
	grunt.loadNpmTasks('grunt-globaltsd');
	grunt.task.loadTasks('grunt');
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
	grunt.registerTask('tsd','Install TypeScript definitions', function() {
		var done = this.async(),
			command = 'node',
			path = require('path'),
			cliPath = path.resolve(__dirname, 'node_modules', 'tsd', 'build', 'cli.js');

		var childProcess = require('child_process'),
			defer = Q.defer();
		var tsdProcess = childProcess.spawn(command, [cliPath, 'install'], { stdio: 'inherit' });
		tsdProcess.on('exit', function(/*code*/) {
			defer.resolve();
		});
		defer.promise.then(function () {
			done();
		});
	});

	grunt.registerTask('test', ['mochaTest:normal', 'mocha']);
	grunt.registerTask('css', ['less', 'ncss', 'stylus']);
	// Default task.
	grunt.registerTask('default', ['tsd', 'globaltsd', 'ts', 'dts_bundle', 'css', 'generateParsers', 'test']);

}

module.exports = exports;