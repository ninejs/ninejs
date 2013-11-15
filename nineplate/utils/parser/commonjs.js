'use strict';


// `grammar` can also be a string that uses jison's grammar format
var parser = require('./generated/commonjs');

function parse(src) {
	return parser.parse(src);
}

exports.parse = parse;
exports.parser = parser;