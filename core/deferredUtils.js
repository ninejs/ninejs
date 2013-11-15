/** 
@module ninejs/core/deferredUtils 
@author Eduardo Burgos <eburgos@gmail.com>
This is just an abstraction that detects if it's running in client side to return dojo/_base/Deferred or server side to return kriskowal's Q
*/
(function() {
	'use strict';
	var isAmd = (typeof(define) !== 'undefined') && define.amd;
	var isDojo = isAmd && define.amd.vendor === 'dojotoolkit.org';
	var isNode = (typeof(window) === 'undefined');
	var req = (isDojo && isNode)? global.require : require;

	function deferred(extend, Q, DeferredList, baseDeferred) {
		var props = {
			mapToPromises: function(arr) {
				var cnt,
					len = arr.length,
					current,
					defer,
					result = [];
				for (cnt = 0; cnt < len; cnt += 1) {
					current = arr[cnt];
					if (current && current.then) {
						result.push(current);
					}
					else {
						defer = this.defer();
						defer.resolve(current);
						result.push(defer);
					}
				}
				return result;
			}
		};
		if (isDojo) {
			extend.mixin(props, {
				defer: function() {
					return new Q();
				},
				when: function() {
					return baseDeferred.when.apply(baseDeferred, arguments);
				},
				all: function(arr) {
					if (!arr.length) {
						return this.when(true, function() {
							return [];
						});
					}
					else {
						return this.when(new DeferredList(arr), function(vals) {
							var cnt,
								len = vals.length,
								result = [];
							for (cnt = 0; cnt < len; cnt += 1) {
								if (vals[cnt][0]) {
									result.push(vals[cnt][1]);
								}
								else {
									throw new Error('Deferred #' + cnt + ' rejected');
								}
							}
							return result;
						});
					}
				}
			});
		}
		else {
			extend.mixin(props, {
				defer: function() {
					return Q.defer();
				},
				when: function() {
					return Q.when.apply(Q, arguments);
				},
				all: function() {
					return Q.all.apply(Q, arguments);
				}
			});
		}
		var Def = extend(props);

		return new Def();
	}

	if (isAmd) { //AMD
		//Testing for dojo toolkit
		if (isDojo) {
			define(['./extend', 'dojo/Deferred', 'dojo/DeferredList', 'dojo/_base/Deferred'], deferred);
		} else {
			//Trying for RequireJS and hopefully every other
			define(['./extend', 'q'], deferred);
		}
	} else if (isNode) { //Server side
		var Q, extend;
		Q = req('q');
		extend = req('./extend');
		module.exports = deferred(extend, Q);
	} else {
		// plain script in a browser
		global.ninejs.core.extend.mixinRecursive(global, { ninejs: { core: { deferredUtils: deferred(global.ninejs.core.extend, global.Q )}}});
	}
})();