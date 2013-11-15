'use strict';
var extend = require('../../core/extend');
var connectUtils = require('connect/lib/utils');
var crypto = require('crypto');

var CachedResourceMixin = {
	maxAge: 10 * 86400 * 1000, //10 days
	cacheType: 'public',
	applyETag: function(res, content) {
		if (!this.etag) {
			var alg = crypto.createHash('sha256'),
				digest;
			alg.update(content);
			digest = alg.digest('hex');
			this.etag = content.length + '-' + digest;
		}
		res.set('ETag', this.etag);
	},
	mustRevalidate: function(req, res) {
		var headers = res._headers,
			result = false,
			cc = connectUtils.parseCacheControl(headers['cache-control'] || ''),
			etagReq = req.get('If-None-Match');
		if (headers['set-cookie'] || (headers['content-range']) || req.headers.cookie || cc['no-cache'] || cc['no-store'] || cc['private'] || cc['must-revalidate']) { //Taken from connect's staticCache
			result = true;
		}
		if (etagReq && (etagReq !== this.etag)) {
			result = true;
		}
		return result;
	},
	handler: extend.around(function(original) {
		return function(req, res) {
			if (req.method === 'GET' || req.method === 'HEAD') {
				if (this.mustRevalidate(req, res)) {
					if (!this.lastModifiedSince) {
						this.lastModifiedSince = new Date();
					}
					if (!res.get('Last-Modified')) {
						res.set('Last-Modified', this.lastModifiedSince.toUTCString());
					}
					if (this.maxAge) {
						res.set('Cache-Control', this.cacheType + ', max-age=' + (this.maxAge / 1000));
						res.set('Expires', new Date(Date.now() + this.maxAge).toUTCString());
					}
					return original.apply(this, arguments);
				}
				else {
					//Writing from cache
					res.writeHead(304, {});
					res.end();
				}
			}
			else {
				return original.apply(this, arguments);
			}
		};
	})
};

module.exports = CachedResourceMixin;