/// <reference path="../../typings/node/node.d.ts" />
/// <reference path="../../typings/express/express.d.ts" />

import Properties from '../../core/ext/Properties';
import WebServer from './WebServer';
import StaticResource from './StaticResource';
import fs = require('fs');
import path = require('path');
import express = require('express');
import extend from '../../core/extend';
import { Logger } from '../ninejs-server'
import { Request, Response, Application } from './WebServer'


export class CacheManifest extends Properties {
	baseUrl: string;
	defaultCreationDate: Date = new Date();

	networkResources: string[] = [];
	cacheResources: string[] = [];
	offlineResources: string[] = [];
	config: any = {};
	cacheEndpoint: StaticResource;
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
	addToCache (collection: string[], url: string, prefix: string, filter: (url: string) => boolean) {
		var fileStat: fs.Stats,
			baseName: string,
			self = this,
			filter = filter || ((url: string) => { return true; });
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
	}
	cache (url: string, prefix?: string, filter?: (url: string) => boolean) {
		return this.addToCache(this.cacheResources, url, prefix, filter);
	}
	network (url: string, prefix: string, filter: (url: string) => boolean) {
		return this.addToCache(this.networkResources, url, prefix, filter);
	}
	handler (req: Request, res: Response) {
		/* jshint unused: true */
		var r: string[] = [],
		result: string;
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

	constructor (args: any) {
		super(args);
	}
}

export class Utils {
	webServer: WebServer;
	appCache: CacheManifest;
	requireJsConfigEndpoint: StaticResource;
	cacheEndpoint: StaticResource;
	amdPaths: { [name: string]: string };
	aliases: string[][];
	boot: string[];
	modules: { [name: string]: any };
	units: { [ name: string ]: any };
	postActions: string[];
	has: { [ name: string ]: any };
	logger: { [ name: string ]: Logger };
	init (webServer: WebServer) {
		this.logger = webServer.get('logger');
		this.webServer = webServer;
		this.appCache.set('baseUrl', webServer.baseUrl);
		var p: string,
			paths = this.amdPaths,
			directory: StaticResource,
			self = this;
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
	}
	addAmdPath (prefix: string, path: string) {
		this.amdPaths[prefix] = path;
	}
	addAmdAlias (moduleName: string, alias: string) {
		this.aliases.push([moduleName, alias]);
	}
	addBoot (target: string) {
		if (this.boot.indexOf(target) < 0) {
			this.boot.push(target);
		}
	}
	addModule (name: string, target: any) {
		this.modules[name] = target;
	}
	getUnit (name: string) {
		if (!this.units[name]) {
			this.units[name] = {};
		}
		return this.units[name];
	}
	addPostAction (action: string) {
		this.postActions.push(action);
	}
	requireJsConfigHandler (req: Request, res: Response) {
		/* jshint unused: true */
		var r = ['window.requireJsConfig = '],
			result: string,
			cfg: any,
			packages = this.amdPaths,
			modules = this.modules,
			units = this.units,
			p: string;
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

	constructor () {
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
			this.amdPaths['requirejs'] = path.resolve(requireJsLocation, '..'); //requirejs path defaults to ./bin
		}
		var reqwestLocation: string = require.resolve('reqwest');
		if (reqwestLocation) {
			this.amdPaths['reqwest'] = path.dirname(reqwestLocation);
		}
		this.appCache = new CacheManifest(undefined);
	}
}

export default Utils;