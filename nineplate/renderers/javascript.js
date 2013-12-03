/** 
@module ninejs/nineplate/renderers/javascript 
@author Eduardo Burgos <eburgos@gmail.com>
*/
(function() {
	'use strict';
	var isAmd = (typeof(define) !== 'undefined') && define.amd;
	var isDojo = isAmd && define.amd.vendor === 'dojotoolkit.org';
	var isNode = (typeof(window) === 'undefined');
	var req = (isDojo && isNode)? global.require : require;

	function moduleExport() {
		return { };
	}

	if (isAmd) { //AMD
		//Trying for RequireJS and hopefully every other
		define([], moduleExport);
	} else if (isNode) { //Server side
		module.exports = moduleExport(req('../../core/extend'), req('q'));
	} else {
		// plain script in a browser
		throw new Error('Non AMD environments are not supported');
	}
})();