define(['./core/extend', './css/builder'], function(extend, builder) {
	'use strict';
	var result = {},
		ielt10 = (function () {
			/* global window */
			if(window.navigator.appName.indexOf('Internet Explorer') !== -1){
				return (window.navigator.appVersion.indexOf('MSIE 9') === -1);
			}
			return false;
		})(),
		isAmd = (typeof(define) !== 'undefined') && define.amd,
		isDojo = isAmd && define.amd.vendor === 'dojotoolkit.org',
		ieNode,
		ieCssText,
		ieCssUpdating,
		externalCssCache = {};

	var StyleObject = extend({
		normalizeUrls: function(css) {
			/* jshint unused: true */
			var self = this;
			css = css.replace(/url\s*\(\s*['"]?([^'"\)]*)['"]?\s*\)/g, function($0, url){
				var newUrl = '',
					amdPrefix;
				if (!(/:/.test(url) || /^\/\//.test(url))){
					var arrSplit = self.path.split(' => ');
					var cnt;
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
		},
		enableOldIE: function(styleNode, result, parent, document) {
			var cnt,
				accumulated,
				actual,
				c;
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
		},
		enable: function(parent) {
			/*
			Taken from Stack overflow question 384286
			*/
			function isDomElement(o){
				return (
					typeof HTMLElement === 'object' ? o instanceof window.HTMLElement : //DOM2
					o && typeof o === 'object' && o.nodeType === 1 && typeof o.nodeName==='string'
				);
			}

			var isScoped = (isDomElement(parent)),
				linkNode,
				result;

			var document;
			if (!parent) {
				document = this.globalWindow.document;
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

			var searchStyleNode = window.document.querySelector('style[data-ninejs-path="' + this.path + '"]');
			var styleNode,
				cnt,
				found;
			if (searchStyleNode){
				styleNode = searchStyleNode;
			}
			else {
				styleNode = document.createElement('style');
				styleNode.type = 'text/css';
				styleNode.setAttribute('data-ninejs-path', this.path);
				if (styleNode.styleSheet && (!ielt10))
				{
					styleNode.styleSheet.cssText = this.data = this.normalizeUrls(cssText);
				}
				else
				{
					this.data = this.normalizeUrls(cssText);
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
			function getChildren(self) {
				var r = [];
				if (self.children) {
					for (cnt = 0; cnt < self.children.length; cnt += 1) {
						var child = self.children[cnt], childHandle;
						if (isScoped) {
							childHandle = child.enable(parent);
						}
						else {
							childHandle = child.enable();
						}
						r.push(childHandle);
					}
				}
				return r;
			}
			result.children = getChildren(this);
			function handleFound(self) {
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
		},
		disable: function() {
			return this.enable().disable();
		}
	}, function() {
		this.globalWindow = window;
	});

	var StyleInstance = extend({
		enable: function() {
			if (this.styleNode){
				this.styleNode.media = 'screen';
			}
			return this;
		},
		disable: function() {
			this.styleNode.media = 'screen and (max-width:0px)';
			return this;
		}
	});

	function buildStyleObject(processResult) {
		var r = new StyleObject(), cnt;
		for (var n in processResult)
		{
			if (processResult.hasOwnProperty(n))
			{
				r[n] = processResult[n];
			}
		}
		if (r.children) {
			for (cnt = 0; cnt < r.children.length; cnt += 1) {
				r.children[cnt] = buildStyleObject(r.children[cnt]);
			}
		}
		return r;
	}

	function loadStyle(data, path, prefixes, baseUrl, autoEnable, load)
	{
		function processCallback(processResult)
		{
			var r = buildStyleObject(processResult);
			if (autoEnable) {
				r.handle = r.enable();
			}

			load(r);
		}
		if (!data) {
			processCallback({ path: path });
		}
		else {
			builder.processCss(data, path, path, prefixes, baseUrl, {}, processCallback);
		}
	}

	result.style = buildStyleObject;

	result.load = function(id, require, load)
	{
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

		if (isDojo && require.cache[/*this.mid + '!' + */parts[0]]) {
			require([/*this.mid + '!' + */parts[0]], function(styleModule) {
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
				if (isDojo)
				{ //Dojo Toolkit
					var path = require.toUrl(parts[0]);
					require.getText(path, true, function(data)
					{
						loadStyle(data, path, require.rawConfig.packages, '', /*require.rawConfig.baseUrl, */ autoEnable, load);
					});
				}
				else
				{ //requirejs not implemented (yet)
					load(null);
				}
			}
		}
	};
	return result;
});