(function (factory) {
    if (typeof module === 'object' && typeof module.exports === 'object') {
        var v = factory(require, exports); if (v !== undefined) module.exports = v;
    }
    else if (typeof define === 'function' && define.amd) {
        define(["require", "exports", '../../core/ext/Properties', 'express', './Endpoint', './StaticResource', '../../nineplate', './NineplateResource', './SinglePage/SinglePageContainer', './ClientUtils', '../../core/deferredUtils', 'morgan', 'serve-favicon', 'compression', 'cookie-parser', 'express-session', 'method-override', 'body-parser', 'path'], factory);
    }
})(function (require, exports) {
    var Properties_1 = require('../../core/ext/Properties');
    var express = require('express');
    var Endpoint_1 = require('./Endpoint');
    var StaticResource_1 = require('./StaticResource');
    var nineplate_1 = require('../../nineplate');
    var NineplateResource_1 = require('./NineplateResource');
    var SinglePageContainer_1 = require('./SinglePage/SinglePageContainer');
    var ClientUtils_1 = require('./ClientUtils');
    var deferredUtils_1 = require('../../core/deferredUtils');
    var morgan = require('morgan');
    var favicon = require('serve-favicon');
    var compression = require('compression');
    var cookieParser = require('cookie-parser');
    var expressSession = require('express-session');
    var methodOverride = require('method-override');
    var bodyParser = require('body-parser');
    var path = require('path');
    var busboy = require('connect-busboy');
    class WebServer extends Properties_1.default {
        constructor(args) {
            super(args);
            this.phases = {
                static: [],
                utils: [],
                auth: [],
                endpoint: []
            };
            this.clientUtils = new ClientUtils_1.default();
        }
        init(config) {
            this.config = config;
            this.baseUrl = config.baseUrl || '';
            this.jsUrl = config.jsUrl || '/js';
            this.port = config.port;
            this.ip = config.ip || undefined;
            this.app = express();
        }
        build() {
        }
        add(resource, prefix) {
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
        postCreate() {
            function sortByOrder(a, b) {
                return (a.order || 0) - (b.order || 0);
            }
            var self = this, config = this.config, app = self.app;
            this.add(new SinglePageContainer_1.default({ route: '/', method: 'get' }));
            this.app.engine('9plate', nineplate_1.default.__express);
            this.app.enable('view cache');
            (function checkLogger(self) {
                if (config.env === 'development') {
                    app.use(morgan('dev'));
                }
            })(this);
            (function checkFavicon(self) {
                if (config.favicon !== false) {
                    app.use(favicon(config.favicon || path.resolve(__dirname, 'ninejs.ico')));
                }
            })(this);
            (function checkCompression(self) {
                if (config.compress !== false) {
                    app.use(compression({ filter: function (req, res) {
                            return (/json|text|javascript|cache-manifest/).test(res.getHeader('Content-Type'));
                        } }));
                }
            })(this);
            if (this.config.clientUtils !== false) {
                this.clientUtils.init(this);
            }
            var statics = (this.phases['static'] || []).slice(0);
            statics.sort(sortByOrder);
            statics.forEach(function (item) {
                app.use(self.baseUrl + item.route, express['static'](item.path, { maxAge: 864000000 }));
            });
            (function checkCookies(self) {
                if (config.cookies !== false) {
                    app.use(cookieParser(config.cookieSecret || '@H98s$%2-==4m'));
                }
            })(this);
            (function checkSession(self) {
                if (config.session !== false) {
                    app.use(expressSession(config.session || { cookie: { maxAge: 1000000 }, resave: false, saveUninitialized: false, secret: '@H98s$%2-==4m' }));
                }
            })(this);
            if (config.methodOverride !== false) {
                app.use(methodOverride('_method'));
            }
            if (config.crossDomain) {
                var crossdomain = require('crossdomain');
                var xml;
                if (typeof (config.crossDomain) === 'object') {
                    xml = crossdomain(config.crossDomain);
                }
                else {
                    xml = crossdomain({ domain: '*' });
                }
                app.use('/crossdomain.xml', function (req, res) {
                    res.set('Content-Type', 'application/xml; charset=utf-8');
                    res.status(200).send(xml);
                });
            }
            var auths = (this.phases.auth || []).slice(0);
            auths.sort(sortByOrder);
            auths.forEach(function (resource) {
                if (resource.route) {
                    app.use(self.baseUrl + resource.route, function () { return resource.handler.apply(resource, arguments); });
                }
                else {
                    app.use(function () {
                        return resource.handler.apply(resource, arguments);
                    });
                }
            });
            var utils = (this.phases.utils || []).slice(0);
            utils.sort(sortByOrder);
            utils.forEach(function (resource) {
                if (resource.route) {
                    app.use(self.baseUrl + resource.route, function () { return resource.handler.apply(resource, arguments); });
                }
                else {
                    app.use(function () {
                        return resource.handler.apply(resource, arguments);
                    });
                }
            });
            var endpoints = (this.phases.endpoint || []).slice(0);
            endpoints.sort(sortByOrder);
            endpoints.forEach(function (resource) {
                var args = [self.baseUrl + resource.route];
                if ((resource.method !== 'get') && (!resource.handleAs)) {
                    resource.handleAs = 'form';
                }
                (function selectBodyParser() {
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
                if (typeof (resource.validate) === 'function') {
                    args.push(function (req, res, next) {
                        var r = resource.validate.call(resource, req, res);
                        if (r) {
                            deferredUtils_1.when(r, (result) => {
                                if (result) {
                                    res.status(400).send(result);
                                }
                                else {
                                    next();
                                }
                            }, (err) => {
                                res.status(400).send(err.message);
                            });
                        }
                        else {
                            next();
                        }
                    });
                }
                args.push(function () {
                    return resource.handler.apply(resource, arguments);
                });
                var app = self.app;
                app[resource.method || 'get'].apply(self.app, args);
            });
            let server;
            if (this.ip) {
                server = this.app.listen(this.port, this.ip);
                this.logger.info(`wev server "${this.serverName}" listening on port ${this.port} with ip ${this.ip}`);
            }
            else {
                server = this.app.listen(this.port);
                this.logger.info(`wev server "${this.serverName}" listening on port ${this.port}`);
            }
            if (typeof (this.timeout) !== 'undefined') {
                server.timeout = this.timeout;
            }
        }
        clientSetup(action) {
            if (action) {
                action(this.clientUtils);
            }
        }
    }
    WebServer.prototype.Endpoint = Endpoint_1.default;
    WebServer.prototype.StaticResource = StaticResource_1.default;
    WebServer.prototype.NineplateResource = NineplateResource_1.default;
    WebServer.prototype.SinglePageContainer = SinglePageContainer_1.default;
    exports.default = WebServer;
});
//# sourceMappingURL=WebServer.js.map