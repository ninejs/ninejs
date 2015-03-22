/*
Dojo Toolkit's dojo/request as of jan 2014
*/
(function (factory) {
	'use strict';
	var req = require,
		isAmd = typeof (define) === 'function' && define.amd,
		isDojo = isAmd && (define.amd.vendor === 'dojotoolkit.org');
	if (isAmd) {
		if (isDojo) {
			define(['dojo/request'], factory);
		}
		else {
			define(['reqwest/reqwest'], factory);
		}
	}
	else if (typeof(exports) === 'object') {
		module.exports = factory(req('request'));
	}
})(function (request) {
	'use strict';
	var isAmd = typeof (define) === 'function' && define.amd,
		isDojo = isAmd && (define.amd.vendor === 'dojotoolkit.org');
	if (isDojo) {
		return request;
	}
	else {
		var fn = function () {
			return request.apply(request, arguments);
		};
		var verb = function (v, args) {
			var obj;
			if (typeof(args[0]) === 'object') {
				obj = args[0];
			}
			else if (typeof(args[1]) === 'object') {
				obj = args[1];
				if (typeof(args[0]) === 'string') {
					obj.url = args[0];
					args.splice(0,1);
				}
			}
			if (obj) {
				obj.method = v;
				if (obj.handleAs) {
					obj.type = obj.handleAs;
				}
			}
			return fn.apply(null, args);
		};
		fn.get = function () {
			return verb('get', Array.prototype.slice.call(arguments, 0));
		};
		fn.post = function () {
			return verb('post', Array.prototype.slice.call(arguments, 0));
		};
		fn.put = function () {
			return verb('put', Array.prototype.slice.call(arguments, 0));
		};
		fn.del = function () {
			return verb('delete', Array.prototype.slice.call(arguments, 0));
		};
		fn.patch = function () {
			return verb('patch', Array.prototype.slice.call(arguments, 0));
		};
		return fn;
	}
});