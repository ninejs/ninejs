'use strict';
var extend = require('../../core/extend');
var Properties = require('../../core/ext/Properties');
var express = require('express');
var Endpoint = require('./Endpoint');
var StaticResource = require('./StaticResource');
var nineplate = require('../../nineplate');
var NineplateResource = require('./NineplateResource');
var SinglePageContainer = require('./SinglePage/SinglePageContainer');
var ClientUtils = require('./ClientUtils');
var morgan = require('morgan'); //Express logger
var favicon = require('serve-favicon');
var compression = require('compression');
var cookieParser = require('cookie-parser');
var expressSession = require('express-session');
var methodOverride = require('method-override');
var bodyParser = require('body-parser');
var path = require('path');
var WebServer = extend(Properties, {
	Endpoint: Endpoint,
	StaticResource: StaticResource,
	NineplateResource: NineplateResource,
	SinglePageContainer: SinglePageContainer,
	init: function(config) {
		this.config = config;
		this.baseUrl = config.baseUrl || '';
		this.jsUrl = config.jsUrl || '/js';
		this.port = config.port;
		this.app = express();
	},
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
	add: function(resource, prefix) {
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
	},
	postCreate: function() {
		function sortByOrder (a, b) {
			return (a.order || 0) - (b.order || 0);
			
		}
		var self = this, config = this.config;
		this.add(new SinglePageContainer({ route: '/', method: 'get' }));
		this.app.engine('9plate', nineplate.__express);
		this.app.enable('view cache', true);

		if (config.env === 'development') {
			this.app.use(morgan('dev'));
		}
		if (config.favicon !== false) {
			this.app.use(favicon(config.favicon || path.resolve(__dirname, 'ninejs.ico')));
		}
		if (config.compress !== false) {
			this.app.use(compression({ filter: function(req, res) {
				/* jshint unused: true */
				return (/json|text|javascript|cache-manifest/).test(res.getHeader('Content-Type'));
			}}));
		}
		if (this.config.clientUtils !== false) {
			this.clientUtils.init(this);
		}
		var statics = (this.phases['static'] || []).slice(0);
		statics.sort(sortByOrder);
		statics.forEach(function(item) {
			self.app.use(self.baseUrl + item.route, express['static'](item.path, { maxAge: 864000000 }));
		});
		if (config.cookies !== false) {
			this.app.use(cookieParser(config.cookieSecret || '@H98s$%2-==4m'));
		}
		if (config.session !== false) {
			this.app.use(expressSession(config.session || { cookie: {maxAge: 1000000 }, resave: false, saveUninitialized: false, secret: '@H98s$%2-==4m' }));
		}
		if (config.methodOverride !== false) {
			this.app.use(methodOverride('_method'));
		}
		var auths = (this.phases.auth || []).slice(0);
		auths.sort(sortByOrder);
		auths.forEach(function(resource) {
			if (resource.route) {
				self.app.use(self.baseUrl + resource.route, function() { return resource.handler.apply(resource, arguments); });
			}
			else {
				self.app.use(resource.handler);
			}
		});
		var utils = (this.phases.utils || []).slice(0);
		utils.sort(sortByOrder);
		utils.forEach(function(resource) {
			if (resource.route) {
				self.app.use(self.baseUrl + resource.route, function() { return resource.handler.apply(resource, arguments); });
			}
			else {
				self.app.use(resource.handler);
			}
		});
		var endpoints = (this.phases.endpoint || []).slice(0);
		endpoints.sort(sortByOrder);
		endpoints.forEach(function(resource) {
			var args = [self.baseUrl + resource.route];
			if ((resource.method !== 'get') && (!resource.handleAs)) {
				resource.handleAs = 'form';
			}
			switch (resource.handleAs) {
				case 'json':
					args.push(bodyParser.json(resource.parserOptions || {}));
					break;
				case 'text':
					args.push(bodyParser.text(resource.parserOptions || {}));
					break;
				case 'form':
					args.push(bodyParser.urlencoded(resource.parserOptions || { extended: true }));
					break;
				case 'raw':
				default:
					args.push(bodyParser.raw(resource.parserOptions || {}));
					break;
			}
			if (typeof(resource.validate) === 'function') {
				args.push(function (req, res, next) {
					var r = resource.validate.call(resource, req, res);
					if (r) {
						res.status(400).send(r);
					}
					else {
						next();
					}
				});
			}
				
			
			args.push(function() {
				return resource.handler.apply(resource, arguments);
			});
			self.app[resource.method || 'get'].apply(self.app, args);
		});
		this.app.listen(this.port);
	},
	clientSetup: function(action) {
		if (action) {
			action(this.clientUtils);
		}
	},
	build: function() {

	}
}, extend.postConstruct(function() {
	extend.mixin(this, {
		phases: {
			'static': [],
			'utils': [],
			'auth': [],
			'endpoint': []
		},
		clientUtils: new ClientUtils()
	});
}));
module.exports = WebServer;