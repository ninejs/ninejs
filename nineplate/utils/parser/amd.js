define(['./generated/amd'], function(parser) {
	'use strict';
	function parse(src) {
		return parser.parse(src);
	}
	parser.yy.parseError = parser.parseError;
	return {
		parse: parse,
		parser: parser
	};
})