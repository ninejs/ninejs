/** 
@module ninejs/core/deferredUtils 
@author Eduardo Burgos <eburgos@gmail.com>
This is just an abstraction that detects if it's running in client side to return dojo/_base/Deferred or server side to return kriskowal's Q
*/
(function() {
	/* global Promise */
	'use strict';
	var isAmd = (typeof(define) !== 'undefined') && define.amd;
	var isDojo = isAmd && define.amd.vendor === 'dojotoolkit.org';
	var isNode = (typeof(window) === 'undefined');
	var req = (isDojo && isNode)? global.require : require;
	var nativePromise = typeof(Promise) === 'function';

	function isPromise(valueOrPromise) {
		return valueOrPromise && (typeof(valueOrPromise.then) === 'function');
	}
	function deferred(extend, Q, DeferredList, baseDeferred) {
		var props = {
		};
		if (nativePromise) {
			extend.mixin(props, {
				mapToPromises: function(arr) {
					var cnt,
						len = arr.length,
						current,
						result = [];
					for (cnt = 0; cnt < len; cnt += 1) {
						current = arr[cnt];
						if (isPromise(current)) {
							result.push(current);
						}
						else {
							result.push(Promise.resolve(current));
						}
					}
					return result;
				},
				defer: function () {
					if (arguments.length) {
						Promise.resolve.apply(Promise, arguments);
					}
					else {
						var pResolve,
							pReject,
							p = new Promise(function (resolve, reject) {
								pResolve = resolve;
								pReject = reject;
							});
						p.resolve = pResolve;
						p.reject = pReject;
						p.promise = p;
						return p;
					}

				},
				when: function (valueOrPromise, onSuccess, onFailure) {
					if (isPromise(valueOrPromise)) {
						return Promise.resolve(valueOrPromise).then(onSuccess, onFailure);
					}
					else {
						return Promise.resolve(onSuccess(valueOrPromise));
					}
				},
				all: function (arr) {
					if (!arr.length) {
						return Promise.resolve([]);
					}
					else {
						return Promise.all(arr);
					}
				},
				delay: function (ms) {
					return new Promise(function (resolve) {
						setTimeout(function () {
							resolve(true);
						}, ms);
					});
				}
			});
		}
		else {
			extend.mixin(props, {
				mapToPromises: function (arr) {
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
			});
			if (isDojo) {
				extend.mixin(props, {
					defer: function () {
						return new Q();
					},
					when: function () {
						return baseDeferred.when.apply(baseDeferred, arguments);
					},
					all: function (arr) {
						if (!arr.length) {
							return this.when(true, function () {
								return [];
							});
						}
						else {
							return this.when(new DeferredList(this.mapToPromises(arr)), function (vals) {
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
					delay: function (ms) {
						var defer = this.defer();
						setTimeout(function () {
							defer.resolve(true);
						}, ms);
						return defer.promise;
					}
				});
			}
			else {
				extend.mixin(props, {
					defer: function () {
						return Q.defer();
					},
					/* jshint unused: true */
					when: function (valueOrPromise, resolve, reject, progress, finalBlock) {
						var r;
						if (Q.isPromiseLike(valueOrPromise)) {
							var defer = Q.defer();
							valueOrPromise.then(function () {
								var r = resolve.apply(null, arguments);
								defer.resolve(r);
							}, function (err) {
								reject.apply(null, arguments);
								defer.reject(err);								
							});
							r = defer.promise;// valueOrPromise.then(resolve, reject);
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
					all: function () {
						return Q.all.apply(Q, arguments);
					},
					delay: function () {
						return Q.delay.apply(Q, arguments);
					}
				});
			}
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
			define(['./extend', 'q/q'], deferred);
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