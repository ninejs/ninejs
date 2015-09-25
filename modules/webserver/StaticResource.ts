/// <reference path="../../typings/node/node.d.ts" />
/// <reference path="../../typings/express/express.d.ts" />

import { Endpoint } from './Endpoint';
import crypto = require('crypto');
import express = require('express');
import { Request, Response } from './WebServer'


var parseCacheControl = function(str: string){
	var directives = str.split(','),
		obj: any = {};

	for(var i = 0, len = directives.length; i < len; i += 1) {
		var parts = directives[i].split('='),
			key = parts.shift().trim(),
			val = parseInt(parts.shift(), 10);

		obj[key] = isNaN(val) ? true : val;
	}

	return obj;
};

class NonCachedStaticResource extends Endpoint {
	contentType: string;
	content: any;
	props: any;
	path: string;
	options: any;
	action: (req: Request, res: Response) => void;

	handler (req: Request, res: Response) {
		/* jshint unused: true */
		var props = this.props || {},
			p: any;
		res.set('Content-Type', this.contentType);
		for (p in props) {
			if (props.hasOwnProperty(p)) {
				res.set(p, props[p]);
			}
		}
		if (this.path) {
			res.sendFile(this.path, this.options || {});
		}
		else if (this.content) {
			this.emit('result', { data: this.content, response: res });
			res.end(this.content);
		}
		else if (this.action) {
			this.action.apply(this, arguments);
		}
		else {
			res.status(404);
		}
	}
	constructor (args: any) {
		super(args);
	}
}

NonCachedStaticResource.prototype.type = 'static';
NonCachedStaticResource.prototype.contentType = 'text/plain; charset=utf-8';
NonCachedStaticResource.prototype.content = '';


class StaticResource extends NonCachedStaticResource {
	maxAge: number;
	cacheType: string;
	lastModifiedSince: Date;
	etag: string;
	path: string;
	applyETag (res: Response, content: string) {
		if (!this.etag) {
			var alg = crypto.createHash('sha256'),
				digest: string;
			alg.update(content);
			digest = alg.digest('hex');
			this.etag = content.length + '-' + digest;
		}
		res.set('ETag', this.etag);
	}
	mustRevalidate (req: Request, res: Response) {
		function checkCacheControl (res: Response, cookie: string, cc: any) {
			return res.get('set-cookie') || (res.get('content-range')) || cookie || cc['no-cache'] || cc['no-store'] || cc['private'] || cc['must-revalidate'];
		}
		var result = false,
			cacheControl = res.get('cache-control'),
			cc = parseCacheControl(cacheControl || ''),
			etagReq = req.get('If-None-Match');

		if (checkCacheControl(res, req.headers['cookie'], cc)) { //Taken from connect's staticCache
			result = true;
		}
		if (etagReq && (etagReq !== this.etag)) {
			result = true;
		}
		if (!cacheControl) {
			result = true;
		}
		return result;
	}
	handler (req: Request, res: Response) {
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
				return super.handler(req, res);
			}
			else {
				//Writing from cache
				res.writeHead(304, {});
				res.end();
			}
		}
		else {
			return super.handler(req, res);
		}
	}
	constructor (args: any) {
		super(args);
	}
}

StaticResource.prototype.maxAge = 10 * 86400 * 1000; //10 days
StaticResource.prototype.cacheType = 'public';

export { NonCachedStaticResource, StaticResource };
export default StaticResource;