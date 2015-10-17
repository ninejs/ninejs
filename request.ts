///<amd-dependency path="reqwest/reqwest" />
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
		request = require.nodeRequire('request');
	}
	else {
		request = require('reqwest/reqwest');
	}
}
else if (typeof(exports) === 'object') {
	request = req('request');
}

export default function fn () {
	return request.apply(request, arguments);
}
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