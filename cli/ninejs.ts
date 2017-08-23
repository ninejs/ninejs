#!/usr/bin/env node
import optimist = require('optimist');
import fs = require('fs');
import path = require('path');

function globalRun() {
	let argv = optimist.argv;
	if (process.env['NINEJS_CWD']) {
		process.chdir(process.env['NINEJS_CWD']);
	}
	if (process.env['NINEJS_ARGS']) {
		var arr = process.env['NINEJS_ARGS'].split(' ');
		arr.forEach(function(item: string) {
			argv._.push(item);
		});
	}
	if (argv.cwd) {
		process.chdir(argv.cwd);
	}
	let ninejs = require('../lib/ninejs');
	if (argv.verbose) {
		ninejs.on('log', function(data: any) {
			console.log(data.message);
		});
	}
	if (!argv.quiet) {
		ninejs.on('print', function(data: any) {
			console.log(data.message);
		});
	}
	return ninejs.run(argv._);
}
let localCmd = path.resolve(process.cwd(), 'node_modules', 'ninejs', 'bin', 'ninejs');
fs.exists(localCmd, function(val) {
	if (val) {
		fs.realpath(localCmd, {}, function(err, real) {
			if ((!err) && (real !== __filename)) {
				require(real);
			}
			else {
				globalRun();
			}
		});
	}
	else {
		globalRun();
	}
});
