/// <reference path="../../typings/node/node.d.ts" />
/// <reference path="../../typings/method-override/method-override.d.ts" />
/// <reference path="../../typings/morgan/morgan.d.ts" />

import Properties from '../../core/ext/Properties';
import express = require('express');
import Endpoint from './Endpoint';
import StaticResource from './StaticResource';
import nineplate from '../../nineplate';
import NineplateResource from './NineplateResource';
import SinglePageContainer from './SinglePage/SinglePageContainer';
import ClientUtils from './ClientUtils';
import { when } from '../../core/deferredUtils';
import { Logger } from '../ninejs-server';
import morgan = require('morgan'); //Express logger
import favicon = require('serve-favicon');
import compression = require('compression');
import cookieParser = require('cookie-parser');
import expressSession = require('express-session');
import methodOverride = require('method-override');
import bodyParser = require('body-parser');
import path = require('path');
import http = require('http');
var busboy: any = require('connect-busboy');

class WebServer extends Properties {
	Endpoint: {
		new (args: any): Endpoint;
	};
	StaticResource: {
		new (args: any): StaticResource;
	};
	NineplateResource: {
		new (args: any): NineplateResource;
	};
	SinglePageContainer: {
		new (args: any): SinglePageContainer;
	};
	logger: Logger;
	app: Application;
	config: any;
	serverName: string;
	baseUrl: string;
	jsUrl: string;
	port: number;
	ip: string;
	timeout: number;
	phases: {
		static: StaticResource[],
		utils: Endpoint[],
		auth: Endpoint[],
		endpoint: Endpoint[],
		[ name: string ]: Endpoint[]
	};
	clientUtils: ClientUtils;
	init (config: any) {
		this.config = config;
		this.baseUrl = config.baseUrl || '';
		this.jsUrl = config.jsUrl || '/js';
		this.port = config.port;
		this.ip = config.ip || undefined;
		this.app = express();
	}
	build () {

	}
	/*
	Parameters are resources.
	Resources have:
	{
		type: choice of (static, utils, auth, endpoint)

		endpoints have:
		method: 'string', //HTTP method, defaults to 'get'
		route: 'string', //Route to bind to. Variables are used the same as express
		handler: Function //The actual handler

		static have:
		route: 'string', //Route to bind to. Variables are used the same as express
		location: 'string', //Physical location of folder
	}
	*/
	add (resource: Endpoint, prefix?: string) {
		var self = this;
		if (prefix) {
			resource.route = prefix + resource.route;
		}
		this.phases[resource.type].push(resource);
		resource.set('app', this.app);
		resource.set('server', this);
		resource.children.forEach(function (r) {
			self.add(r, resource.route);
		});
	}
	postCreate () {
		function sortByOrder (a: Endpoint, b: Endpoint) {
			return (a.order || 0) - (b.order || 0);
			
		}
		var self = this, config = this.config,
			app: express.Application = <express.Application> self.app;
		this.add(new SinglePageContainer({ route: '/', method: 'get' }));
		this.app.engine('9plate', nineplate.__express);
		this.app.enable('view cache');

		(function checkLogger(self: WebServer) {
			if (config.env === 'development') {
				app.use(morgan('dev'));
			}
		})(this);
		(function checkFavicon (self: WebServer) {
			if (config.favicon !== false) {
				app.use(favicon(config.favicon || path.resolve(__dirname, 'ninejs.ico')));
			}
		})(this);
		(function checkCompression (self: WebServer) {
			if (config.compress !== false) {
				app.use(compression({ filter: function(req: Request, res: Response) {
					/* jshint unused: true */
					return (/json|text|javascript|cache-manifest/).test(res.getHeader('Content-Type'));
				}}));
			}
		})(this);
		if (this.config.clientUtils !== false) {
			this.clientUtils.init(this);
		}
		var statics = (this.phases['static'] || []).slice(0);
		statics.sort(sortByOrder);
		statics.forEach(function(item) {
			app.use(self.baseUrl + item.route, express['static'](item.path, { maxAge: 864000000 }));
		});
		(function checkCookies (self: WebServer) {
			if (config.cookies !== false) {
				app.use(cookieParser(config.cookieSecret || '@H98s$%2-==4m'));
			}
		})(this);

		(function checkSession (self: WebServer) {
			if (config.session !== false) {
				app.use(expressSession(config.session || { cookie: {maxAge: 1000000 }, resave: false, saveUninitialized: false, secret: '@H98s$%2-==4m' }));
			}
		})(this);
		if (config.methodOverride !== false) {
			app.use(methodOverride('_method'));
		}
		if (config.crossDomain) {
			var crossdomain: any = require('crossdomain');
			var xml: string;
			if (typeof(config.crossDomain) === 'object') {
				xml = crossdomain(config.crossDomain);
			}
			else {
				xml = crossdomain({ domain: '*' });
			}
			app.use('/crossdomain.xml', function (req: express.Request, res: express.Response) {
				/* jshint unused: true */
				res.set('Content-Type', 'application/xml; charset=utf-8');
				res.status(200).send(xml);
			});
		}
		var auths = (this.phases.auth || []).slice(0);
		auths.sort(sortByOrder);
		auths.forEach(function(resource: Endpoint) {
			if (resource.route) {
				app.use(self.baseUrl + resource.route, function() { return resource.handler.apply(resource, arguments); });
			}
			else {
				app.use(function () {
					return resource.handler.apply(resource, arguments);
				});
			}
		});
		var utils = (this.phases.utils || []).slice(0);
		utils.sort(sortByOrder);
		utils.forEach(function(resource: Endpoint) {
			if (resource.route) {
				app.use(self.baseUrl + resource.route, function() { return resource.handler.apply(resource, arguments); });
			}
			else {
				app.use(function () {
					return resource.handler.apply(resource, arguments);
				});
			}
		});
		var endpoints = (this.phases.endpoint || []).slice(0);
		endpoints.sort(sortByOrder);
		endpoints.forEach(function(resource: Endpoint) {
			var args: any[] = [self.baseUrl + resource.route];
			if ((resource.method !== 'get') && (!resource.handleAs)) {
				resource.handleAs = 'form';
			}
			(function selectBodyParser () {
				var parserOptions = resource.parserOptions || {};
				switch (resource.handleAs) {
					case 'json':
						args.push(bodyParser.json(parserOptions));
						break;
					case 'text':
						args.push(bodyParser.text(parserOptions));
						break;
					case 'form':
						args.push(bodyParser.urlencoded(resource.parserOptions || { extended: true }));
						break;
					case 'raw':
						args.push(bodyParser.raw(parserOptions));
						break;
					case 'busboy':
						args.push(busboy(resource.parserOptions || { upload: true }));
						break;
					default:
						args.push(bodyParser.raw(parserOptions));
						break;
				}
			})();
			if (typeof(resource.validate) === 'function') {
				args.push(function (req: Request, res: Response, next: () => void) {
					var r = resource.validate.call(resource, req, res);
					if (r) {
						when(r, (result: any) => {
							if (result) {
								res.status(400).send(result);
							}
							else {
								next();
							}
						}, (err: Error) => {
							res.status(400).send(err.message);
						});
					}
					else {
						next();
					}
				});
			}
				
			
			args.push(function() {
				return resource.handler.apply(resource, arguments);
			});
			var app: any = self.app;
			app[resource.method || 'get'].apply(self.app, args);
		});
		let server: any;
		if (this.ip) {
			server = this.app.listen(this.port, this.ip);
			this.logger.info(`wev server "${this.serverName}" listening on port ${this.port} with ip ${this.ip}`);
		}
		else {
			server = this.app.listen(this.port);
			this.logger.info(`wev server "${this.serverName}" listening on port ${this.port}`);
		}
		if (typeof(this.timeout) !== 'undefined') {
			server.timeout = this.timeout;
		}
	}
	clientSetup (action: (utils: ClientUtils) => void) {
		if (action) {
			action(this.clientUtils);
		}
	}
	constructor (args: any) {
		super(args);
		this.phases = {
			static: [],
			utils: [],
			auth: [],
			endpoint: []
		};
		this.clientUtils = new ClientUtils();
	}

}


WebServer.prototype.Endpoint = Endpoint;
WebServer.prototype.StaticResource = StaticResource;
WebServer.prototype.NineplateResource = NineplateResource;
WebServer.prototype.SinglePageContainer = SinglePageContainer;

export default WebServer;

export interface Request extends http.ServerRequest {
	get (name: string): string;

	header(name: string): string;

	headers: { [key: string]: string; };

	accepts(type: string): string;

	accepts(type: string[]): string;

	param(name: string, defaultValue?: any): string;

	is(type: string): boolean;

	protocol: string;

	secure: boolean;

	ip: string;

	ips: string[];

	hostname: string;

	xhr: boolean;

	//body: { username: string; password: string; remember: boolean; title: string; };
	body: any;

	//cookies: { string; remember: boolean; };
	cookies: any;

	method: string;

	params: any;

	user: any;

	authenticatedUser: any;

	clearCookie(name: string, options?: any): Response;

	query: any;

	route: any;

	signedCookies: any;

	originalUrl: string;

	url: string;

	session: any;
}
export interface Send {
	(status: number, body?: any): Response;
	(body: any): Response;
}
export interface CookieOptions {
	maxAge?: number;
	signed?: boolean;
	expires?: Date;
	httpOnly?: boolean;
	path?: string;
	domain?: string;
	secure?: boolean;
}
export interface Response extends http.ServerResponse {
	status: (code: number) => Response;
	sendStatus: (code: number) => Response;
	getHeader: (name: string) => string;
	send: Send;
	json: Send;
	jsonp: Send;
	sendFile(path: string): void;
	sendFile(path: string, options: any): void;
	sendFile(path: string, fn: (err: Error) => void): void;
	sendFile(path: string, options: any, fn: (err: Error) => void): void;
	download(path: string): void;
	download(path: string, filename: string, fn: (err: Error) => void): void;
	contentType(type: string): Response;
	type(type: string): Response;
	format(obj: any): Response;
	attachment(filename?: string): Response;
	set(field: any): Response;
	set(field: string, value?: string): Response;

	header(field: any): Response;
	header(field: string, value?: string): Response;
	headersSent: boolean;
	get (field: string): string;
	clearCookie(name: string, options?: any): Response;
	cookie(name: string, val: string, options: CookieOptions): Response;
	cookie(name: string, val: any, options: CookieOptions): Response;
	cookie(name: string, val: any): Response;
	redirect(url: string): void;
	redirect(status: number, url: string): void;
	redirect(url: string, status: number): void;
	render(view: string, options?: Object, callback?: (err: Error, html: string) => void ): void;
	render(view: string, callback?: (err: Error, html: string) => void ): void;
	locals: any;

	charset: string;
}

export interface Application {
	listen: (port: number, ip?: string) => any;
	engine: (name: string, callback: (path: string, options: any, callback: (err: any, val: any) => void) => void) => void;
	enable: (name: string) => void;
	render(name: string, options?: Object, callback?: (err: Error, html: string) => void): void;
	render(name: string, callback: (err: Error, html: string) => void): void;
}