///<amd-dependency path="reqwest/reqwest" />
'use strict';

import { defer } from './core/deferredUtils';

declare var require: any;
declare var define:{
	(deps:string[], callback:(...rest:any[]) => any): void;
	amd: any;
};
declare var exports: any;
var req = require,
	isNode = typeof(window) === 'undefined',
	isAmd = typeof (define) === 'function' && define.amd,
	isDojo = isAmd && (define.amd.vendor === 'dojotoolkit.org');

var request: any;
if (isAmd) {
	if (isNode) {
		if (isDojo) {
			request = req.nodeRequire('request');
		}
		else {
			request = req('request');
		}
	}
	else {
		request = req('reqwest/reqwest');
	}
}
else if (typeof(exports) === 'object') {
	request = req('request');
}

export interface RawResponse {
	response: any,
	body: any
}

export function raw (...args: any[]) {
	let d = defer<RawResponse>();
	if (isNode) {
		args.push((err: any, res: any, body: any) => {
			if (err) {
				d.reject(err);
			}
			else {
				d.resolve({ response: res, body: body });
			}
		});
		request.apply(request, args);
	}
	else {
		request.apply(request, args).then((data: any) => {
			d.resolve({ response: data, body: data});
		}, (err: any) => {
			d.reject(err);
		});
	}
	return d.promise;
}
let result: {
	(...args: any[]): Promise<any>;
	get: (...args: any[]) => Promise<any>;
	post: (...args: any[]) => Promise<any>;
	put: (...args: any[]) => Promise<any>;
	del: (...args: any[]) => Promise<any>;
	patch: (...args: any[]) => Promise<any>;
}
let fn: any;
fn = (...args: any[]) => {
	return raw.apply(null, args).then ((r: RawResponse) => {
		return r.response;
	});
};
var verb = function (v: string, args: any[]) {
	var obj: any;
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
}
export function get (...args: any[]) {
	return verb('get', args);
}
export function post (...args: any[]) {
	return verb('post', args);
}
export function put (...args: any[]) {
	return verb('put', args);
}
export function del (...args: any[]) {
	return verb('delete', args);
}
export function patch (...args: any[]) {
	return verb('patch', args);
}
fn.get = get;
fn.post = post;
fn.put = put;
fn.del = del;
fn.patch = patch;
result = fn;
export default result;