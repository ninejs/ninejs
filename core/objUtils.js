/** 
@module ninejs/core/objUtils 
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
		/**
		returns the string representation of an object regardless of it's type
		@param {(Object|Array|Function|string)} obj - the object to be represented
		*/
		function deepToString(obj) {
			/*
			strips out the function name after 'function '

			@param {string} fstring - the function as a string
			*/
			function stripFunctionName(fstring) {
				var idx = fstring.indexOf('(');
				if (idx > 9) {
					fstring = fstring.substr(0, 9) + fstring.substr(idx);
				}
				return fstring;
			}
			/*
			Iterates over an array to have the string representation of each element.
			@param {Array} obj - the array
			*/
			function resolveArray(obj) {
				var result;
				result = '[';
				for (idx = 0; idx < obj.length; idx += 1) {
					if (idx > 0) {
						result += ',';
					}
					result += deepToString(obj[idx]);
				}
				result += ']';
				return result;
			}

			var result = '',
				o, idx;
			if ((obj !== null) && (obj !== undefined)) {
				if (obj instanceof Array) {
					result = resolveArray(obj);
				} else if (typeof(obj) === 'string') {
					result = '\'' + obj.toString() + '\'';
				} else if (typeof(obj) === 'function') {
					result = stripFunctionName(obj.toString());
				} else if (obj instanceof Object) {
					result = '{';
					idx = 0;
					for (o in obj) {
						if (obj.hasOwnProperty(o)) {
							if (idx > 0) {
								result += ',';
							}
							result += o + ':' + deepToString(obj[o]);
							idx += 1;
						}
					}
					result += '}';
				} else {
					result = obj.toString();
				}
			}
			else if (obj === null) {
				result = 'null';
			}
			return result;
		}
		function protoClone(obj) {
			function A() {
			}
			A.prototype = obj;
			return new A();
		}
		function isFunction(f) {
			return typeof(f) === 'function';
		}
		function isString(obj) {
			return Object.prototype.toString.call(obj) === '[object String]';
		}
		function isArray(obj) {
			return (Object.prototype.toString.call(obj) === '[object Array]');
		}
		function isArrayLike(value) {
			return value &&
				typeof value === 'object' &&
				typeof value.length === 'number' &&
				//hasOwnProperty.call(value, "length") &&
				((!value.length) || hasOwnProperty.call(value, value.length - 1));
		}
		function isNumber(n) {
			return !isNaN(parseFloat(n)) && isFinite(n);
		}

		return {
			deepToString: deepToString,
			protoClone: protoClone,
			isFunction: isFunction,
			isString: isString,
			isNumber: isNumber,
			isArray: isArray,
			isArrayLike: isArrayLike
		};
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