'use strict';

var deferredUtils,
	expect;
deferredUtils = require('../deferredUtils');
expect = require('chai').expect;
function check(done, f) {
	try {
		f();
		done();
	} catch(e) {
		done(e);
	}
}

/* global describe, it */
describe('core/deferredUtils', function () {
	describe('-> Node.js', function () {
		it('should defer', function (done) {
			var defer = deferredUtils.defer();
			expect(defer.promise.then).to.be.a('function');
			done();
		});
		it('should when', function (done) {
			var defer = deferredUtils.defer();
			deferredUtils.when(defer.promise, function(val) {
				check(done, function() {
					expect(val).to.equal(4);
				});
			});
			defer.resolve(4);
		});
		it('should all', function (done) {
			var defList,
				def1 = deferredUtils.defer(),
				def2 = deferredUtils.defer(),
				def3 = deferredUtils.defer();
			defList = [def1.promise, def2.promise, def3.promise];
			deferredUtils.when(def3.promise, function() {
				def1.resolve(1);
			});
			deferredUtils.when(def1.promise, function() {
				def2.resolve(2);
			});
			deferredUtils.when(deferredUtils.all(defList), function(val) {
				check(done, function() {
					expect(val).to.deep.equal([1,2,3]);
				});
			});
			def3.resolve(3);
		});
	});
	describe('-> With Dojo Toolkit in Node.js', function () {
		describe('Testing', function () {
			var dojorequire;

			global.dojoConfig = {
				baseUrl : __dirname + '/../../',
				async: 0,
				has: {
					'host-node': 1,
					'dom': 0
				},
				packages: [{
						name: 'dojo',
						location: 'node_modules/dojo'
					},{
						name: 'ninejs',
						location: '.'
					}]
				};
			try {
				// Now load the Dojo loader
				require('dojo/dojo.js');
				dojorequire = global.require;
				dojorequire(['ninejs/core/deferredUtils'], function(deferredUtils) {
					it('should defer', function (done) {
						var defer = deferredUtils.defer();
						expect(defer.promise.then).to.be.a('function');
						done();
					});
					it('should when', function (done) {
						var defer = deferredUtils.defer();
						deferredUtils.when(defer.promise, function(val) {
							check(done, function() {
								expect(val).to.equal(4);
							});
						});
						defer.resolve(4);
					});
					it('should all', function (done) {
						var defList,
							def1 = deferredUtils.defer(),
							def2 = deferredUtils.defer(),
							def3 = deferredUtils.defer();
						defList = [def1.promise, def2.promise, def3.promise];
						deferredUtils.when(def3.promise, function() {
							def1.resolve(1);
						});
						deferredUtils.when(def1.promise, function() {
							def2.resolve(2);
						});
						deferredUtils.when(deferredUtils.all(defList), function(val) {
							check(done, function() {
								expect(val).to.deep.equal([1,2,3]);
							});
						});
						def3.resolve(3);
					});
				});
			}
			finally {
				delete global.dojoConfig;
				delete global.require;
				delete global.define;
			}
		});
	});
});