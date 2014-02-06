/*
Dojo Toolkit's dojo/text as of jan 2014
*/
(function() {
	'use strict';
	var isAmd = (typeof(define) !== 'undefined') && define.amd;
	var isNode = (typeof(window) === 'undefined');
	var req = require;

	function moduleExports(cache) {
		// module:
		//		dojo/text

		var getText = cache.getText;

		var notFound = {},
			pending = {};

		return {
			// summary:
			//		This module implements the dojo/text! plugin and the dojo.cache API.
			// description:
			//		We choose to include our own plugin to leverage functionality already contained in dojo
			//		and thereby reduce the size of the plugin compared to various foreign loader implementations.
			//		Also, this allows foreign AMD loaders to be used without their plugins.
			//
			//		CAUTION: this module is designed to optionally function synchronously to support the dojo v1.x synchronous
			//		loader. This feature is outside the scope of the CommonJS plugins specification.

			// the dojo/text caches it's own resources because of dojo.cache
			dynamic: true,

			normalize: function(id, toAbsMid) {
				// id is something like (path may be relative):
				//
				//	 'path/to/text.html'
				//	 'path/to/text.html!strip'
				var parts = id.split('!'),
					url = parts[0];
				return (/^\./.test(url) ? toAbsMid(url) : url) + (parts[1] ? '!' + parts[1] : '');
			},

			load: function(id, require, load) {
				// id: String
				//		Path to the resource.
				// require: Function
				//		Object that include the function toUrl with given id returns a valid URL from which to load the text.
				// load: Function
				//		Callback function which will be called, when the loading finished.

				// id is something like (path is always absolute):
				//
				//	 'path/to/text.html'
				//	 'path/to/text.html!strip'
				var
				parts = id.split('!'),
					stripFlag = parts.length > 1,
					absMid = parts[0],
					url = require.toUrl(parts[0]),
					requireCacheUrl = 'url:' + url,
					text = notFound,
					finish = function(text) {
						load(stripFlag ? cache.strip(text) : text);
					};
				if (absMid in cache.data) {
					text = cache.data[absMid];
				} else if (require.cache && requireCacheUrl in require.cache) {
					text = require.cache[requireCacheUrl];
				} else if (url in cache.data) {
					text = cache.data[url];
				}
				if (text === notFound) {
					if (pending[url]) {
						pending[url].push(finish);
					} else {
						var pendingList = pending[url] = [finish];
						getText(url, !require.async, function(text) {
							cache.data[absMid] = cache.data[url] = text;
							for (var i = 0; i < pendingList.length;) {
								pendingList[i](text);
								i += 1;
							}
							delete pending[url];
						});
					}
				} else {
					finish(text);
				}
			}
		};

	}
	if (isAmd) { //AMD
		define(['./cache'], moduleExports);
	} else if (isNode) { //Server side
		module.exports = moduleExports(req('./cache'));
	} else {
		// plain script in a browser
		throw new Error('Non AMD environments are not supported');
	}
})(this);