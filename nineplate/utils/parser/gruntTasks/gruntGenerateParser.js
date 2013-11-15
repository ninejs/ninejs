module.exports = function(grunt)
{

	'use strict';

	grunt.registerTask('generateParsers', 'Generate Nineplate parsers', function()
	{
		var done = this.async();

		var grammar = require('../grammar').grammar;

		var Jison, Parser;
		Jison = require('jison');
		//If debugging, uncomment this line and set options.debug = true
		Jison.print = function() {};
		Parser = Jison.Parser;
		var parser = new Parser(grammar, { 'backtrack_lexer': true });
		var parserSource = parser.generateCommonJSModule();
		grunt.file.write(__dirname + '/../generated/commonjs.js', parserSource);
		var gen = new Jison.Generator(grammar);
		parserSource = gen.generateAMDModule();
		grunt.file.write(__dirname + '/../generated/amd.js', parserSource);
		done();
	});
};