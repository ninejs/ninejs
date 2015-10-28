import * as extend from './core/extend'
import * as def from './core/deferredUtils'
import { processCss, AMDPrefixesType } from './_css/builder'
import * as request from './request'

declare var define:{
	(deps:string[], callback:(...rest:any[]) => any): void;
	amd: any;
};
declare var require: any;
declare var dojoConfig: any;
declare var requirejs: any;
var ielt10 = (function () {
		/* global window */
		if(window.navigator.appName.indexOf('Internet Explorer') !== -1){
			return (window.navigator.appVersion.indexOf('MSIE 9') === -1);
		}
		return false;
	})(),
	isAmd = (typeof(define) !== 'undefined') && define.amd,
	isDojo = isAmd && define.amd.vendor === 'dojotoolkit.org',
	ieCssText: string,
	ieCssUpdating: boolean,
	externalCssCache: { [name: string]: HTMLLinkElement } = {};

export interface StyleType {
	enable: (parent?: any) => StyleType;
	disable: () => StyleType;
}
let normalizeUrls = (css: string, self: any) => {
	/* jshint unused: true */
	css = css.replace(/url\s*\(\s*['"]?([^'"\)]*)['"]?\s*\)/g, function($0, url){
		var newUrl = '',
			amdPrefix: string;
		if (!(/:/.test(url) || /^\/\//.test(url))){
			var arrSplit = self.path.split(' => ');
			var cnt: number;
			for (cnt = 0; cnt < arrSplit.length; cnt += 1){
				var slashSplit = arrSplit[cnt].split('/');
				if (cnt === 0) {
					amdPrefix = slashSplit[0];
				}
				slashSplit.pop();
				if (slashSplit.length && cnt > 0){
					newUrl += '/';
				}
				newUrl += slashSplit.join('/');
			}
			if (newUrl){
				newUrl += '/';
			}
			newUrl += url;
		}
		else {
			newUrl = url;
		}
		if (isDojo && amdPrefix) {
			//Tring to find AMD package
			if (require.packs && require.packs[amdPrefix]) {
				var amdPackage = require.packs[amdPrefix];
				var loc = amdPackage.location.split('/');
				if (loc.length) {
					loc.pop();
					loc.push(newUrl);
					newUrl = loc.join('/');
				}
			}
		}
		return 'url(\'' + newUrl + '\')';
	});
	return css;
};
export class StyleObject implements StyleType {
	children: StyleObject[] = [];
	path: string;
	data: string;
	[name: string]: any;
	document: HTMLDocument;
	handle: StyleInstance;
	enableOldIE (styleNode: any, result: StyleInstance, parent: any, document: HTMLDocument): void {
		var cnt: number,
			accumulated: string[],
			actual: string,
			c: any,
			ieNode: any;
		if (!ieNode) {
			ieNode = styleNode;
		}
		if (this.path.indexOf(' => ') < 0) { //If I'm the root (not a child)
			accumulated = [];
			for (cnt = 0; cnt < this.children.length; cnt += 1) { //Accumulate all child's css
				accumulated.push(this.children[cnt].data);
			}
			ieCssText = ieCssText || '';
			actual = ieCssText;
			ieCssText = actual + '\n' + accumulated.join('\n') + '\n' + this.data;
			if (!ieCssUpdating) {
				ieCssUpdating = true;
				setTimeout(function() {
					c = ieNode.lastChild;
					while (c) {
						ieNode.removeChild(c);
						c = ieNode.lastChild;
					}
					ieNode.appendChild(document.createTextNode(ieCssText));

					ieCssUpdating = false;
					ieNode = null;
					ieCssText = null;
				});
			}
			//Strip out all children as this node is being treated as a single one
			this.children = [];
			result.children = [];
			if (!ieNode.parentNode) {
				parent.appendChild(ieNode);
			}
		}
	}
	enable (parent?: any) {
		/*
		Taken from Stack overflow question 384286
		*/
		function isDomElement(o: any){
			return (
				typeof HTMLElement === 'object' ? o instanceof HTMLElement : //DOM2
				o && typeof o === 'object' && o.nodeType === 1 && typeof o.nodeName==='string'
			);
		}

		var isScoped = (isDomElement(parent)),
			linkNode: HTMLLinkElement,
			result: StyleInstance;

		var document: HTMLDocument;
		if (!parent) {
			document = window.document as HTMLDocument;
			parent = document.getElementsByTagName('head')[0];
		}
		else {
			document = parent.ownerDocument;
		}
		var cssText = '' + this.data + '';
		if ((!this.data) && this.path) {
			if (!externalCssCache[this.path]) {
				linkNode = document.createElement('link');
				linkNode.type = 'text/css';
				linkNode.rel = 'stylesheet';
				linkNode.href = this.path;
				externalCssCache[this.path] = linkNode;
			}
			else {
				linkNode = externalCssCache[this.path];
			}
			result = new StyleInstance();
			result.styleNode = linkNode;
			result.children = [];
			parent.appendChild(linkNode);
			return result;
		}

		var searchStyleNode: HTMLStyleElement = <HTMLStyleElement> window.document.querySelector('style[data-ninejs-path="' + this.path + '"]');
		var styleNode: any,
			cnt: number,
			found: boolean;
		if (searchStyleNode){
			styleNode = searchStyleNode;
		}
		else {
			styleNode = document.createElement('style');
			styleNode.type = 'text/css';
			styleNode.setAttribute('data-ninejs-path', this.path);
			if (styleNode.styleSheet && (!ielt10))
			{
				styleNode.styleSheet.cssText = this.data = normalizeUrls(cssText, this);
			}
			else
			{
				this.data = normalizeUrls(cssText, this);
				styleNode.appendChild(document.createTextNode(this.data));
			}
			if (isScoped) {
				styleNode.setAttribute('scoped', 'scoped');
			}
			found = true;
		}
		this.document = document;
		result = new StyleInstance();
		result.styleNode = styleNode;
		function getChildren(self: StyleObject) {
			var r: StyleInstance[] = [];
			if (self.children) {
				for (cnt = 0; cnt < self.children.length; cnt += 1) {
					var child = self.children[cnt], childHandle: StyleInstance;
					if (isScoped) {
						childHandle = StyleObject.prototype.enable.call(child, parent);
					}
					else {
						childHandle = StyleObject.prototype.enable.call(child);
					}
					r.push(childHandle);
				}
			}
			return r;
		}
		result.children = getChildren(this);
		function handleFound(self: StyleObject) {
			if (found) {
				if (ielt10) {
					self.enableOldIE(styleNode, result, parent, document);
				}
				else {
					parent.appendChild(styleNode);
				}
			}
		}

		handleFound(this);
		return result;
	}
	disable () {
		return this.enable().disable();
	}
	constructor () {
	}
}

export class StyleInstance implements StyleType {
	styleNode: HTMLStyleElement;
	children: StyleInstance[];
	enable () {
		if (this.styleNode){
			this.styleNode.media = 'screen';
		}
		return this;
	}
	disable () {
		this.styleNode.media = 'screen and (max-width:0px)';
		return this;
	}
}

export function style(processResult: StyleObject) {
	var r = new StyleObject(),
		cnt: number;
	for (var n in processResult)
	{
		if (processResult.hasOwnProperty(n))
		{
			r[n] = processResult[n];
		}
	}
	if (r.children) {
		for (cnt = 0; cnt < r.children.length; cnt += 1) {
			r.children[cnt] = style(r.children[cnt]);
		}
	}
	return r;
}

function loadStyle(data: string, path: string, prefixes: AMDPrefixesType[], baseUrl: string, autoEnable: boolean, load: (r: StyleObject) => void) {
	function processCallback(processResult: StyleObject)	{
		var r = style(processResult);
		if (autoEnable) {
			r.handle = r.enable();
		}

		load(r);
	}
	if (!data) {
		var t = new StyleObject();
		t.path = path;
		processCallback(t);
	}
	else {
		processCss(data, path, path, prefixes, baseUrl, {}, processCallback);
	}
}

export function loadFromString (css: string, uniqueId: string) {
	var packages: AMDPrefixesType[];
	if (isDojo) {
		packages = dojoConfig.packages;
	}
	else {
		packages = requirejs.s.contexts._.config.packages;
	}
	var defer = def.defer();
	loadStyle(css, uniqueId, packages, '', true, function (styleObj: StyleObject) {
		defer.resolve(styleObj);
	});
	return defer.promise;
}

export function load (id: string, require: any, load: (r: StyleObject) => void) {
	/* jshint unused: true */
	// id: String
	//		Path to the resource.
	// require: Function
	//		Object that include the function toUrl with given id returns a valid URL from which to load the text.
	// load: Function
	//		Callback function which will be called, when the loading finished.
	var parts = id.split('!');
	var fname = parts[0];
	var autoEnable = false;
	if (parts[1] && parts[1] === 'enable'){
		autoEnable = true;
	}
	var isDojo = (define.amd && define.amd.vendor === 'dojotoolkit.org');

	var name: string;
	if (require.cache) {
		if (require.cache[(parts[0] + '.ncss')]) {
			name = (parts[0] + '.ncss');
		}
		else {
			name = parts[0];
		}
	}

	if (isDojo && require.cache[name]) {
		require([name], function(styleModule: StyleObject) {
			if (autoEnable){
				styleModule.enable();
			}
			load(styleModule);
		});
	}
	else {
		if ((fname.indexOf('http:') === 0) || (fname.indexOf('https:') === 0)) {
			loadStyle(null, fname, require.rawConfig.packages, '', autoEnable, load);
		} else {
			var extIdx = fname.lastIndexOf('.');
			if (extIdx < 0)
			{
				fname = fname + '.css';
			}
			var path = require.toUrl(parts[0]);
			if (isDojo) { //Dojo Toolkit
				require.getText(path, false, function(data: string) {
					loadStyle(data, path, require.rawConfig.packages, require.rawConfig.baseUrl, autoEnable, load);
				});
			}
			else {
				request.get(path, { type: 'html' }).then(function (data: any) {
					if ((typeof(window) !== 'undefined') && (data instanceof XMLHttpRequest)) { //Sometimes reqwest returns xhr object when response is empty
						data = data.responseText;
					}
					var packages: AMDPrefixesType[];
					if (isDojo) {
						packages = dojoConfig.packages;
					}
					else {
						packages = requirejs.s.contexts._.config.packages;
					}
					loadStyle(data, path, packages, '', autoEnable, load);
				});
			}
		}
	}
}