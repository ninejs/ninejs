/** 
@module ninejs/core/array
@author Eduardo Burgos <eburgos@gmail.com>
*/
(function() {
	'use strict';
	var isAmd = (typeof(define) !== 'undefined') && define.amd;
	var isNode = (typeof(window) === 'undefined');

	/**
	@exports objUtils
	*/
	function moduleExport() {
		var result = {};
		if (typeof(Array.prototype.map) === 'function') {
			result.map = function(arr, fn) {
				return Array.prototype.map.call(arr, fn);
			};
		}
		else {
			result.map = function(arr, fn) {
				var cnt,
					len = arr.len,
					r = [];
				for (cnt = 0; cnt < len; cnt += 1) {
					r.push(fn(arr[cnt], cnt, arr));
				}
				return r;
			};
		}
		if (typeof(Array.prototype.forEach) === 'function') {
			result.forEach = function(arr, fn) {
				return Array.prototype.forEach.call(arr, fn);
			};
		}
		else {
			result.forEach = function(arr, fn) {
				var cnt,
					len = arr.len;
				for (cnt = 0; cnt < len; cnt += 1) {
					fn(arr[cnt], cnt, arr);
				}
			};
		}
		if (typeof(Array.prototype.indexOf) === 'function') {
			result.indexOf = function(arr, obj) {
				return Array.prototype.indexOf.call(arr, obj);
			};
		}
		else {
			result.indexOf = function(arr, obj) {
				var cnt,
					len = arr.len;
				for (cnt = 0; cnt < len; cnt += 1) {
					if (arr[cnt] === obj) {
						return cnt;
					}
				}
				return -1;
			};
		}
		return result;
	}

	if (isAmd) { //AMD
		//Trying for RequireJS and hopefully every other
		define([], moduleExport);
	} else if (isNode) { //Server side
		module.exports = moduleExport();
	} else {
		// plain script in a browser
		throw new Error('Non AMD environments are not supported');
	}
})();