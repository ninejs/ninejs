module.exports = function(grunt) {
	'use strict';
	grunt.registerTask('generateParsers', 'Generate Nineplate parsers', function () {
		var done = this.async();

		var grammar = require('../nineplate/utils/parser/grammar').grammar;

		var Jison, Parser;
		Jison = require('jison');
		//If debugging, uncomment this line and set options.debug = true
		Jison.print = function() {};
		Parser = Jison.Parser;
		var options = {
			type: 'slr',
			moduleType: 'commonjs',
			moduleName: 'jsonparse'
		};
		var gen = new Jison.Generator(grammar, options);
		var parserSource = gen.generate();
		grunt.file.write(__dirname + '/../nineplate/utils/parser/generated/commonjs.js', parserSource);
		options.moduleType = 'amd';
		gen = new Jison.Generator(grammar, options);
		parserSource = gen.generate();
		grunt.file.write(__dirname + '/../nineplate/utils/parser/generated/amd.js', parserSource);
		done();
	});
};