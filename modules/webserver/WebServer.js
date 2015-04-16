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
var busboy = require('connect-busboy');
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

		(function checkLogger(self) {
			if (config.env === 'development') {
				self.app.use(morgan('dev'));
			}
		})(this);
		(function checkFavicon (self) {
			if (config.favicon !== false) {
				self.app.use(favicon(config.favicon || path.resolve(__dirname, 'ninejs.ico')));
			}
		})(this);
		(function checkCompression (self) {
			if (config.compress !== false) {
				self.app.use(compression({ filter: function(req, res) {
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
			self.app.use(self.baseUrl + item.route, express['static'](item.path, { maxAge: 864000000 }));
		});
		(function checkCookies (self) {
			if (config.cookies !== false) {
				self.app.use(cookieParser(config.cookieSecret || '@H98s$%2-==4m'));
			}
		})(this);

		(function checkSession (self) {
			if (config.session !== false) {
				self.app.use(expressSession(config.session || { cookie: {maxAge: 1000000 }, resave: false, saveUninitialized: false, secret: '@H98s$%2-==4m' }));
			}
		})(this);
		if (config.methodOverride !== false) {
			this.app.use(methodOverride('_method'));
		}
		if (config.crossDomain) {
			var crossdomain = require('crossdomain');
			var xml;
			if (typeof(config.crossDomain) === 'object') {
				xml = crossdomain(config.crossDomain);
			}
			else {
				xml = crossdomain({ domain: '*' });
			}
			this.app.use('/crossdomain.xml', function (req, res) {
				/* jshint unused: true */
				res.set('Content-Type', 'application/xml; charset=utf-8');
				res.status(200).send(xml);
			});
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