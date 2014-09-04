'use strict';

var i18n,
	expect,
	path = require('path');
i18n = require('../i18n');
expect = require('chai').expect;

/* global describe, it */
describe('core/i18n', function () {
	describe('-> evaluating some strings', function () {
		it('should evaluate some strings', function (done) {
			var resourceSet = i18n.getResource(path.resolve(__dirname, './test.json')),
				resource;
			resource = resourceSet.getResource();
			expect(resource.hi).to.equal('hi');
			done();
		});
		it('should switch from a language to another', function (done) {
			var resourceSet = i18n.getResource(path.resolve(__dirname, './test.json')),
				resource;
			resource = resourceSet.getResource();
			var setLocale = resourceSet.setLocale('es-ES');
			setLocale.then(function () {
				resource = resourceSet.getResource();
				expect(resource.hi).to.equal('saludos');
				done();
			});
		});
	});
});