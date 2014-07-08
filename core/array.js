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
		if (typeof(Array.prototype.forEach) === 'function') {
			result.filter = function(arr, fn) {
				return Array.prototype.filter.call(arr, fn);
			};
		}
		else {
			result.filter = function(arr, fun /*, thisArg */) {
				/* jshint bitwise: false */
				if (arr === void 0 || arr === null) {
					throw new TypeError();
				}

				var t = Object(arr);
				var len = t.length >>> 0;
				if (typeof fun !== 'function') {
					throw new TypeError();
				}

				var res = [];
				var thisArg = arguments.length >= 2 ? arguments[1] : void 0;
				for (var i = 0; i < len; i += 1) {
					if (i in t) {
						var val = t[i];

						// NOTE: Technically this should Object.defineProperty at
						//       the next index, as push can be affected by
						//       properties on Object.prototype and Array.prototype.
						//       But that method's new, and collisions should be
						//       rare, so use the more-compatible alternative.
						if (fun.call(thisArg, val, i, t)) {
							res.push(val);
						}
					}
				}

				return res;
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