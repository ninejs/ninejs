#!/usr/bin/env node
import { default as nineplate } from '../nineplate'
import cssBuilder = require('../_css/build/dojo-amd')
import optimist = require('optimist')
import fs = require('fs')
import path = require('path')
import {defer } from '../core/deferredUtils'

let argv = optimist.argv;
function generate (text: string, args: any) {
	var options: any = {};
	if ((args.mode === 'css') || (args.sourceExtension === '.css')) {
		for (var p in args) {
			options[p] = args[p];
		}
		var fn = cssBuilder.buildAppender(text, path.relative(args.baseUrl || '', args.sourcePath).split('\\').join('/'), args.sourcePath, args.cssPrefixes || {}, path.dirname(args.sourcePath), true, options);
		var promiseConstruct = defer();
		promiseConstruct.resolve(fn);
		return promiseConstruct.promise;
	}
	else {
		try {
			var template = nineplate.buildTemplate(text);
		}
		catch (err) {
			console.error(err);
			throw err;
		}
		if (args.target === 'amd') {
			options.ignoreHtmlOptimization = true;
			options.standalone = args.standalone || false;
			return template.toAmd(false, options);
		}
		else if (args.target === 'commonjs') {
			return template.toCommonJs();
		}
		else if (args.target === 'text') {
			return template.compileText(false);
		}
	}
}
var realPath = path.resolve(argv._[0]);
function getFilter () {
	if (argv.pattern) {
		var pattern = new RegExp(argv.pattern);
		return function (fname: string) {
			return pattern.test(fname);
		};
	}
	else {
		if (argv.css) {
			return function (fname: string) {
				return (path.extname(fname) === '.html') || (path.extname(fname) === '.css');
			};
		}
		else {
			return function (fname: string) {
				return path.extname(fname) === '.html';
			};
		}
	}
}
var filter = getFilter();
var watched: { [name: string]: boolean } = {},
	hasErrors = 0;
process.on('beforeExit', function () {
	if (hasErrors) {
		console.log(hasErrors + ' Errors');
		process.exit(1);
	}
	else {
		process.exit(0);
	}
});
(function solve (realPath) {
	fs.stat(realPath, function (err, stat) {
		if (err) {
			console.error(err);
			process.exit(1);
		}
		else {
			if (stat.isDirectory()) {
				fs.readdir(realPath, function (err, files) {
					if (err) {
						console.error(err);
						process.exit(1);
					}
					else {
						files.map(function (f) { return path.resolve(realPath, f); }).forEach(solve);
					}
				});
			}
			else {
				if (filter(realPath)) {
					if (argv.watch && !watched[realPath]) {
						watched[realPath] = true;
						fs.watchFile(realPath, function () {
							solve(realPath);
						});
					}
					fs.readFile(realPath, { encoding: 'utf8' }, function (err, text: string) {
						if (err) {
							console.error(err);
							hasErrors += 1;
						}
						else {
							var fileExtension = path.extname(realPath);
							generate(text, { target: argv.target || 'amd', sourcePath: realPath, sourceExtension: fileExtension, sourceName: path.basename(realPath), baseUrl: argv.baseUrl, toBase64: argv.toBase64, sizeLimit: argv.sizeLimit, mode: argv.mode }).then(function (text: string) {
								var defaultExt = (fileExtension === '.css')? 'css.js' : '9plate.js';
								var extension = argv.extension || defaultExt;
								var newPath = path.resolve(path.dirname(realPath), path.basename(realPath, path.extname(realPath)) + '.' + extension);
								if (argv.v || argv.watch) {
									console.log('Generating ' + newPath);
								}
								fs.writeFile(newPath, text, function (err) {
									if (err) {
										console.log('ERROR');
										console.log(err);
										console.error(err);
										hasErrors += 1;
									}
								});
							}, function (err: Error) {
								console.error('Error generating ' + realPath);
								console.error(err);
								console.log(err.stack);
								hasErrors += 1;
							});
						}
					});
				}
			}
		}
	});
})(realPath);