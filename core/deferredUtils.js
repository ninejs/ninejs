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
						return this.when(new DeferredList(this.mapToPromises(arr)), function(vals) {
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
				},
				delay: function(ms) {
					var defer = this.defer();
					setTimeout(function() {
						defer.resolve(true);
					}, ms);
					return defer.promise;
				}
			});
		}
		else {
			extend.mixin(props, {
				defer: function() {
					return Q.defer();
				},
				/* jshint unused: true */
				when: function(valueOrPromise, resolve, reject, progress, finalBlock) {
					var r;
					if (Q.isPromiseLike(valueOrPromise)) {
						r = valueOrPromise.then(resolve, reject);
					}
					else {
						var defer = Q.defer();
						defer.promise.then(resolve, reject);
						defer.resolve(valueOrPromise);
						r = defer.promise;
					}
					if (typeof(finalBlock) === 'function') {
						return r.fin(finalBlock);
					}
					else {
						return r;
					}
				},
				all: function() {
					return Q.all.apply(Q, arguments);
				},
				delay: function() {
					return Q.delay.apply(Q, arguments);
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
			define(['./extend', 'kew'], deferred);
		}
	} else if (isNode) { //Server side
		var Q, extend;
		Q = req('kew');
		extend = req('./extend');
		module.exports = deferred(extend, Q);
	} else {
		// plain script in a browser
		global.ninejs.core.extend.mixinRecursive(global, { ninejs: { core: { deferredUtils: deferred(global.ninejs.core.extend, global.Q )}}});
	}
})();