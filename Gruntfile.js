/*
 * ninejs grunt configuration file
 */
function exports(grunt) {
	'use strict';

	var jsFiles = ['bin/ninejs', '*.js', '**/*.js', '!node_modules/**', '!out/**', '!nineplate/utils/parser/**/commonjs.js', '!nineplate/utils/parser/**/amd.js', '!nineplate/tests/template-generated.js', '!modernizer.js', '!modules/webserver/jsClientUtils/*'],
		testFiles = ['**/tests/**/*.js', '!coverage/**', '!**/tests/**/phantom*.js', '!node_modules/**', '!out/**', '!nineplate/tests/template-generated.js'],
		phantomWatch = ['nineplate/tests/phantomTest.js'],
		stylusFiles = [ '**/*.styl', '!node_modules/**', '!ui/bootstrap/extension.styl' ],
		lessFiles = ['ui/bootstrap/less/bootstrap.less'],
		ncssFiles = ['ui/bootstrap/less/bootstrap.ncss'],
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
		exec: {
			defaultTs : (process.env.TS_COMPILER || "./node_modules/typescript/bin/tsc") + " -p ./tsconfig.json"
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
					referenceExternals: false,
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
		},
		nineplate: {
			html: {
				mode: 'html',
				pattern: '\\.html$',
				src: [
					'ui/css',
					'!ui/tests/logic/FilterBuilder/demo.html',
					'modules'
				]
			},
			css: {
				mode: 'css',
				pattern: '\\.css$',
				extension: 'ncss.js',
				src: [
					'ui',
					'modules'
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

	var childProcess = require('child_process'),
			path = require('path');

	grunt.registerMultiTask('nineplate', 'Generates nineplate and css functions', function () {
		console.log('Running nineplate ');
		var done = this.async();
		var files = this.filesSrc;
		var pattern = '';
		var extension = '';
		var data = this.data;
		if (this.data.pattern) {
			pattern = ' --pattern=' + this.data.pattern;
		}
		if (this.data.extension) {
			extension = ' --extension=' + this.data.extension;
		}

		console.log('nineplate ' + files.length + ' files');

		files.forEach(function(file) {
			childProcess.execSync('node ./bin/nineplate ' + file + ' --target=amd --mode=' + data.mode + ' --toBase64 --baseUrl=' + path.resolve(process.cwd()) + pattern + extension, {
				stdio: 'inherit'
			});
		});
		done();
	});

	grunt.registerTask('test', ['mochaTest:normal', 'mocha']);
	grunt.registerTask('css', ['less', 'ncss', 'stylus']);
	// Default task.
	grunt.registerTask('default', ['css', 'nineplate', 'exec', /*'typedoc', */'generateParsers', 'nineplate', 'test']);

}

module.exports = exports;