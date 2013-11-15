'use strict';
var extend = require('../../core/extend');
var Properties = require('../../core/ext/Properties');
var underscore = require('underscore');
var express = require('express');
var Endpoint = require('./Endpoint');
var StaticResource = require('./StaticResource');
var nineplate = require('../../nineplate');
var NineplateResource = require('./NineplateResource');
var SinglePageContainer = require('./SinglePage/SinglePageContainer');
var ClientUtils = require('./ClientUtils');
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
	add: function(resource) {
		this.phases[resource.type].push(resource);
		resource.set('app', this.app);
		resource.set('server', this);
	},
	postCreate: function() {
		var self = this, config = this.config;
		this.add(new SinglePageContainer({ route: '/', method: 'get' }));
		this.app.engine('9plate', nineplate.__express);
		this.app.enable('view cache', true);

		if (config.env === 'development') {
			this.app.use(express.logger('dev'));
		}
		if (config.favicon !== false) {
			this.app.use(express.favicon());
		}
		if (config.compress !== false) {
			this.app.use(express.compress({ filter: function(req, res) {
				/* jshint unused: true */
				return (/json|text|javascript|cache-manifest/).test(res.getHeader('Content-Type'));
			}}));
		}
		if (this.config.clientUtils !== false) {
			this.clientUtils.init(this);
		}
		underscore.sortBy(this.phases['static'], function(item) { return item.order || 0; }).forEach(function(item) {
			self.app.use(self.baseUrl + item.route, express['static'](item.path, { maxAge: 864000000 }));
		});
		if (config.cookies !== false) {
			this.app.use(express.cookieParser(config.cookieSecret || '@H98s$%2-==4m'));
		}
		if (config.session !== false) {
			this.app.use(express.session({ cookie: {maxAge: 1000000} }));
		}
		if (config.bodyParser !== false) {
			this.app.use(express.bodyParser());
		}
		if (config.methodOverride !== false) {
			this.app.use(express.methodOverride());
		}
		underscore.sortBy(this.phases.auth, function(item) { return item.order || 0; }).forEach(function(resource) {
			if (resource.route) {
				self.app.use(self.baseUrl + resource.route, function() { return resource.handler.apply(resource, arguments); });
			}
			else {
				self.app.use(resource.handler);
			}
		});
		underscore.sortBy(this.phases.utils, function(item) { return item.order || 0; }).forEach(function(resource) {
			if (resource.route) {
				self.app.use(self.baseUrl + resource.route, function() { return resource.handler.apply(resource, arguments); });
			}
			else {
				self.app.use(resource.handler);
			}
		});
		underscore.sortBy(this.phases.endpoint, function(item) { return item.order || 0; }).forEach(function(resource) {
			self.app[resource.method || 'get'](self.baseUrl + resource.route, function() { return resource.handler.apply(resource, arguments); });
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