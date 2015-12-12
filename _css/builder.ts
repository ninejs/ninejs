'use strict';

import * as request from '../request';

export interface AMDPrefixesType {
	name: string;
	location: string;
}
export interface ProcessedCssType {
	path: string;
	data: string;
	children: ProcessedCssType[];
}
export interface ProcessCssOptionsType {
	path?: string;
	parentPath?: string;
	toBase64?: boolean;
	sizeLimit?: number;
	[name: string]: any;
}
export interface ProcessCssImportType {
	children: ProcessedCssType[];
	css: string;
}

declare var define: any;
declare var require: any;
var req = require;
let isNode = typeof(window) === 'undefined',
	isAmd = (typeof(define) !== 'undefined') && (define.amd),
	isDojo = isAmd && define.amd.vendor === 'dojotoolkit.org';

function resolveUrl(url: string, path: string, prefixes: AMDPrefixesType[], baseUrl: string, toBase64: boolean, sizeLimit: number) {
	function attachBaseUrl(baseUrl: string, r: string) {
		if (baseUrl) {
			if (!/\:/.test(r) && !/^\//.test(r)){
				if (/\/$/.test(r)){
					r = baseUrl + r;
				}
				else {
					r = baseUrl + '/' + r;
				}
			}
		}
		return r;
	}
	function tryPrefixes(r: string, prefixes: AMDPrefixesType[]) {
		for (var cnt=0; cnt < prefixes.length; cnt += 1) {
			var prefix = prefixes[cnt].name;
			if (r.indexOf(prefix + '/') === 0){
				var prefixPath = prefixes[cnt].location;
				if (/\/$/.test(prefixPath)) {
					r = prefixPath + r.substr(prefix.length + 1);
				}
				else {
					r = prefixPath + '/' + r.substr(prefix.length + 1);
				}
				break;
			}
		}
		return r;
	}
	var r: string;
	if (/^data:/.test(url)){
		r = url;
	}
	else {
		var pathSplit = path.split(/\/|\\/), urlSplit = url.split('/');
		pathSplit.pop(); //stripping the file name
		while (pathSplit.length && urlSplit[0] && (urlSplit[0] === '..')){
			pathSplit.pop();
			urlSplit.shift();
		}
		while (pathSplit.length && urlSplit[0] && (urlSplit[0] === '.')){
			urlSplit.shift();
		}
		url = urlSplit.join('/');
		if (/^\//.test(url)) {
			r = url;
		}
		else {
			if (pathSplit.length) {
				r = pathSplit.join('/') + '/' + urlSplit.join('/');
			}
			else {
				r = urlSplit.join('/');
			}
			r = tryPrefixes(r, prefixes);
		}
	}

	r = attachBaseUrl(baseUrl, r);

	if (toBase64) {
		var b64String = convertToBase64Url(r, path /*resolveRealPath(r, path, prefixes, baseUrl)*/, sizeLimit);
		if (b64String) {
			r = b64String;
		}
	}

	return r;
}
var fs: {
	existsSync: (url: string) => boolean;
	readFileSync: (url: string, encoding?: string) => Buffer | string;
}, pathModule: {
	extname: (url: string) => string;
};
if (isNode) {
	if (isDojo) {
		fs = require.nodeRequire('fs');
		pathModule = require.nodeRequire('path');
	}
	else {
		fs = req('fs');
		pathModule = req('path');
	}
}
function convertToBase64Url(url:string, path: string, sizeLimit: number) {
	if (/^data:/.test(url)){
		return url;
	}
	var suffixIdx = url.indexOf('?');
	if (suffixIdx >= 0) {
		url = url.substr(0, suffixIdx);
	}
	var mimeTypes: { [name: string]: string } = {
		'.gif': 'image/gif',
		'.png': 'image/png',
		'.jpg': 'image/jpeg',
		'.jpeg': 'image/jpeg',
		'.svg': 'image/svg+xml',
		'.woff': 'application/x-font-woff',
		'.ttf': 'font/opentype'
	};
	var extension = pathModule.extname(url);

	if (mimeTypes[extension]){
		if (fs.existsSync(url)) {
			var buf: any = fs.readFileSync(url);
			if (buf.length < sizeLimit){
				return 'data:' + mimeTypes[extension] + ';base64,' + buf.toString('base64');
			}
			else {
				console.log('ninejs/css did not embed resource ' + url + ' due to it surpassing the size limit ' + sizeLimit + ' in ' + path);
			}
		}
		else {
			console.error('ninejs/css did not embed resource ' + url + ' because it was NOT FOUND in ' + path);
		}
	}
	return null;
}

function embedUrls(data: string, path: string, prefixes: AMDPrefixesType[], baseUrl: string, toBase64: boolean, sizeLimit: number) {
	var r = data;
	/* jshint unused: true */
	r = r.replace(/(embed)?url\s*\(\s*['"]?([^'"\)]*)['"]?\s*\)/g, function($0: string, ...matches: string[]){
		var url = matches[1];
		var newUrl = resolveUrl(url, path, prefixes, baseUrl, false, sizeLimit);
		if (toBase64) {
			var embedded = convertToBase64Url(newUrl, path, sizeLimit);
			if (embedded) {
				url = embedded;
			}
		}
		else {
			url = newUrl;
		}
		return 'url(\'' + url + '\')';
	});

	return r;
}
let localRegex = /^([a-z]:)/i;
function isLocalFs(src: string) {
	return src.match(localRegex);
}
export function processCss(data: string, path: string, realPath: string, prefixes: AMDPrefixesType[], baseUrl: string, options: ProcessCssOptionsType, callback: (t: ProcessedCssType) => void) {
	function addImports(data: string, path: string, prefixes: AMDPrefixesType[], baseUrl: string, toBase64: boolean, embedSizeLimit: number) {
		var children: ProcessedCssType[] = [];
		/* jshint unused: true */
		data = data.replace(/\@import\s*url\s*\(\s*['"]?([^'"\)]*)['"]?\s*\)/g, ($0: string, ...matches: string[]) => {
			var url: string = matches[0];

			var realUrl = resolveUrl(url, realPath, prefixes, baseUrl, toBase64, embedSizeLimit);

			function loadHandler (childData: any) {
				var childOptions: ProcessCssOptionsType = {};
				for (var p in options) {
					if (options.hasOwnProperty(p)) {
						childOptions[p] = options[p];
					}
				}
				childOptions.parentPath = childOptions.path;
				processCss(childData, url, realUrl, prefixes, baseUrl, childOptions, function(result: ProcessedCssType) {
					var child = result;
					children.push(child);
				});
			}
			if (isNode && isLocalFs(realUrl)) {
				loadHandler(fs.readFileSync(realUrl, 'utf-8'));
			}
			else {
				request.get(realUrl, { headers: { Accept: 'text/css, text/plain, text/*'}, type: 'html'}).then(loadHandler);
			}
			return '';
		});
		var r: ProcessCssImportType = { children: children, css: data };
		return r;
	}
	if (!options) {
		options = {};
	}
	var toBase64 = !!options.toBase64;


	data = embedUrls(data, realPath, prefixes, baseUrl, toBase64, options.sizeLimit || 30000);

	path = path.split('\\').join('/');
	options.path = path;
	if (options.parentPath){
		options.path = options.parentPath + ' => ' + options.path;
	}
	var r: any = {
		path: options.path
	};
	var importResult = addImports(data, path, prefixes, baseUrl, toBase64, options.sizeLimit || 30000);
	r.data = importResult.css;
	r.children = importResult.children;
	var tr: ProcessedCssType = r;
	callback(tr);
}