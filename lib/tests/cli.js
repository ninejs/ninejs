'use strict';

var expect,
	childProcess = require('child_process'),
	path = require('path');

function check( done, f ) {
	try {
		f();
		done();
	} catch(e) {
		done(e);
	}
}
expect = require('chai').expect;

/* global describe, it */
describe('NineJS :: CLI', function () {
	it('should deafult to ninejs start', function (done) {
		var result = childProcess.spawn('node', [path.resolve(__dirname, '..', '..', 'bin', 'ninejs')], { stdio: 'inherit' });
		result.on('exit', function(code) {
			check(done, function() {
				expect(code).to.equal(0);
			});
		});
		result.on('error', function(err) {
			done(err);
		});
	});
});