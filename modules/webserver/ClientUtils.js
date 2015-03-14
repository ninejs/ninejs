'use strict';
var extend = require('../../core/extend');
var Properties = require('../../core/ext/Properties');
var fs = require('fs');
var path = require('path');
var CacheManifest = extend(Properties, {
	defaultCreationDate: new Date(),
	/*
	If only url is set then the line will contain literally the content of the url variable.
	If prefix is set then url will be considered a physical path on disk and will be resolved and appended with baseUrl + prefix.
	eg: cache('http://google.com/') =>
	CACHE:
	http://google.com/

	cache(__dirname + '/module.js', 'stuff') =>
	CACHE:
	stuff/module.js

	url can also be a directory
	*/
	addToCache: function(collection, url, prefix, filter) {
		var fileStat,
			baseName,
			self = this,
			filter = filter || function() { return true; };
		if (prefix) {
			baseName = path.basename(url);
			fileStat = fs.statSync(url);
			if (fileStat.isDirectory()) {
				fs.readdirSync(url).forEach(function(item) {
					var realPath = path.resolve(url, item);
					self.addToCache(collection, realPath, prefix + '/' + baseName, filter);
				});
			}
			else if (fileStat.isFile() && filter(url)) {
				collection.push(this.baseUrl + prefix + '/' + baseName);
			}
		}
		else {
			this.cacheResources.push(url);
		}
	},
	cache: function(url, prefix, filter) {
		return this.addToCache(this.cacheResources, url, prefix, filter);
	},
	network: function(url, prefix, filter) {
		return this.addToCache(this.networkResources, url, prefix, filter);
	},
	handler: function(req, res) {
		/* jshint unused: true */
		var r = [],
		result;
		r.push('CACHE MANIFEST\n\n\n');
		r.push('# App cache manifest. Date: ' + (this.config.cacheDate || this.defaultCreationDate) + '\n\n');
		r.push('CACHE:\n');
		this.cacheResources.forEach(function(item) {
			r.push(item + '\n');
		});
		r.push('\n\n');
		r.push('FALLBACK:\n');
		this.offlineResources.forEach(function(item) {
			r.push(item + '\n');
		});
		r.push('\n\n');
		r.push('NETWORK:\n');
		this.networkResources.forEach(function(item) {
			r.push(item + '\n');
		});
		r.push('*\n');
		r.push('\n\n');
		result = r.join('');
		if (this.cacheEndpoint) {
			this.cacheEndpoint.applyETag(res, result);
		}
		res.end(result);
	}
}, function() {
	extend.mixin(this, {
		networkResources: [],
		cacheResources: [],
		offlineResources: [],
		config: {}
	});
});
var Utils = extend({
	init: function(webServer) {
		this.logger = webServer.get('logger');
		this.webServer = webServer;
		this.appCache.set('baseUrl', webServer.baseUrl);
		var files = fs.readdirSync(path.resolve(__dirname, 'jsClientUtils')),
			p,
			paths = this.amdPaths,
			directory,
			ext,
			endpoint,
			self = this;
		files.forEach(function(fileName) {
			fileName = path.resolve(__dirname, 'jsClientUtils', fileName);
			var fileStat = fs.statSync(fileName);
			//Adding single files
			if (fileStat.isFile()) {
				ext = path.extname(fileName);
				endpoint = new webServer.Endpoint({ path: fileName, route: webServer.jsUrl + '/' + path.basename(fileName), handler: function(req,res) {
						/* jshint unused: true */
						res.sendfile(this.path);
					}
				});
				webServer.add(endpoint);
			}
			else if (fileStat.isDirectory()) { //Adding directories
				directory = new webServer.StaticResource({ path: fileName, route: webServer.jsUrl + '/' + path.basename(fileName) });
				webServer.add(directory);
			}
		});
		for (p in paths) {
			if (paths.hasOwnProperty(p)) {
				directory = new webServer.StaticResource({ path: paths[p], route: webServer.jsUrl + '/' + p });
				webServer.add(directory);
			}
		}
		//Adding requireJsConfig.js
		this.requireJsConfigEndpoint = new webServer.StaticResource({ type: 'endpoint', contentType: 'application/javascript', route: webServer.jsUrl + '/requireJsConfig.js', action: function() {
				self.requireJsConfigHandler.apply(self, arguments);
			}
		});
		webServer.add(this.requireJsConfigEndpoint);
		this.appCache.cache(this.webServer.baseUrl + this.webServer.jsUrl + '/requireJsConfig.js');
		//Adding manifest.appcache
		this.cacheEndpoint = new webServer.StaticResource({ type: 'endpoint', contentType: 'text/cache-manifest', route: webServer.baseUrl + '/manifest.appcache', action: function() {
				self.appCache.handler.apply(self.appCache, arguments);
			}
		});
		this.appCache.cacheEndpoint = this.cacheEndpoint;
		webServer.add(this.cacheEndpoint);
		this.addBoot('ninejs/modules/clientBoot');
	},
	addAmdPath: function(prefix, path) {
		this.amdPaths[prefix] = path;
	},
	addAmdAlias: function(moduleName, alias) {
		this.aliases.push([moduleName, alias]);
	},
	addBoot: function(target) {
		if (this.boot.indexOf(target) < 0) {
			this.boot.push(target);
		}
	},
	addModule: function(name, target) {
		this.modules[name] = target;
	},
	getUnit: function(name) {
		if (!this.units[name]) {
			this.units[name] = {};
		}
		return this.units[name];
	},
	addPostAction: function(action) {
		this.postActions.push(action);
	},
	requireJsConfigHandler: function(req, res) {
		/* jshint unused: true */
		var r = ['window.requireJsConfig = '],
			result,
			cfg,
			packages = this.amdPaths,
			modules = this.modules,
			units = this.units,
			p;
		cfg = {
			parseOnLoad: false,
			isDebug: true,
			has: {
				'dojo-built': 0,
				'dojo-inject-api': 1,
				'dojo-sync-loader': 1,
				'dojo-loader': 1,
				'dojo-v1x-i18n-Api': 1
			},
			locale: 'en-us',
			selectorEngine: 'css3',
			isAsync: true,
			async: true,
			deps: this.boot,
			applicationUrl: this.webServer.baseUrl,
			packages: [
			],
			ninejs: {
				modules: {},
				units: {}
			},
			callback: function () {
			}
		};
		for (p in packages) {
			if (packages.hasOwnProperty(p)) {
				cfg.packages.push({ name: p, location: this.webServer.jsUrl + '/' + p });
			}
		}
		for (p in modules) {
			if (modules.hasOwnProperty(p)) {
				cfg.ninejs.modules[p] = modules[p];
			}
		}
		for (p in units) {
			if (units.hasOwnProperty(p)) {
				cfg.ninejs.units[p] = units[p];
			}
		}
		extend.mixinRecursive(cfg.has, this.has);
		cfg.aliases = this.aliases;
		r.push(JSON.stringify(cfg));
		r.push(';');
		r.push('require.config(window.requireJsConfig);');
		this.postActions.forEach(function(item) {
			r.push('(' + item.toString() + ').apply();');
		});
		result = r.join('');
		this.requireJsConfigEndpoint.applyETag(res, result);
		res.end(result);
	}
}, function() {
	this.amdPaths = {
		'ninejs': path.resolve(__dirname, '../../')
	};
	this.aliases = [];
	this.has = {};
	this.modules = {};
	this.units = {};
	this.boot = [];
	this.postActions = [];
	var requireJsLocation = require.resolve('requirejs');
	if (requireJsLocation) {
		requireJsLocation = path.dirname(requireJsLocation);
		this.amdPaths.requirejs = path.resolve(requireJsLocation, '..'); //requirejs path defaults to ./bin
	}
	var qLocation = require.resolve('q');
	if (qLocation) {
		this.amdPaths.q = path.dirname(qLocation);
	}
	var reqwestLocation = require.resolve('reqwest');
	if (reqwestLocation) {
		this.amdPaths.reqwest = path.dirname(reqwestLocation);
	}
	this.appCache = new CacheManifest();
});
module.exports = Utils;