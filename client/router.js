var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports", "../core/deferredUtils", "../core/extend", "../core/ext/Evented", "../core/ext/Properties", "./hash", "../core/on"], factory);
    }
})(function (require, exports) {
    'use strict';
    var deferredUtils_1 = require("../core/deferredUtils");
    var extend_1 = require("../core/extend");
    var Evented_1 = require("../core/ext/Evented");
    var Properties_1 = require("../core/ext/Properties");
    var hash_1 = require("./hash");
    var on_1 = require("../core/on");
    var idMatch = /:(\w[\w\d]*)/g, idReplacement = '([^\\/]+)', globMatch = /\*(\w[\w\d]*)/, globReplacement = '(.+)';
    var activeRouteDefer = null;
    function nullf() {
        return null;
    }
    function cleanRoute(r) {
        if (r && r.length && (r.indexOf('#') === 0)) {
            return r.substr(1);
        }
        return r;
    }
    function getRoute() {
        var r = hash_1.default();
        return cleanRoute(r);
    }
    function setRoute(route, replace) {
        return hash_1.default(route, replace);
    }
    function convertRouteToRegExp(route) {
        route = route.replace(idMatch, idReplacement);
        route = route.replace(globMatch, globReplacement);
        route = '^' + route + '$';
        return new RegExp(route);
    }
    function getParameterNames(route) {
        var parameterNames = [], match;
        idMatch.lastIndex = 0;
        while ((match = idMatch.exec(route)) !== null) {
            parameterNames.push(match[1]);
        }
        if ((match = globMatch.exec(route)) !== null) {
            parameterNames.push(match[1]);
        }
        return parameterNames.length > 0 ? parameterNames : null;
    }
    function prepareArguments(route, action) {
        if (typeof (route) === 'object') {
            return route;
        }
        else {
            return {
                action: action,
                route: route
            };
        }
    }
    var itemsRemove = function (item) {
        item.remove();
    };
    var Router = (function (_super) {
        __extends(Router, _super);
        function Router() {
            var _this = _super.call(this, {}) || this;
            _this.routes = [];
            return _this;
        }
        Router.prototype.on = function (type, listener) {
            return Evented_1.default.on.apply(this, arguments);
        };
        Router.prototype.emit = function () {
            var arglist = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                arglist[_i] = arguments[_i];
            }
            return Evented_1.default.emit.apply(this, arguments);
        };
        Router.prototype.register = function (route, action, opts) {
            var options = prepareArguments(route, action);
            extend_1.default.mixinRecursive(options, opts || {});
            return new Route(options, this);
        };
        Router.prototype.go = function (route, replace) {
            var current = getRoute();
            route = cleanRoute(route);
            if (activeRouteDefer) {
                activeRouteDefer.reject(new Error('route changed'));
                activeRouteDefer = null;
            }
            this.emit('9jsRouteChanging', { route: route, oldRoute: current, replace: replace });
            if (current === route) {
                return this.dispatchRoute({ newURL: route, oldURL: '' });
            }
            else {
                activeRouteDefer = deferredUtils_1.defer();
                setRoute(route, replace);
                return activeRouteDefer.promise;
            }
        };
        Router.prototype.addRoute = function (route) {
            this.routes.push(route);
            return route;
        };
        Router.prototype.removeRoute = function (route) {
            var idx = this.routes.indexOf(route);
            if (idx >= 0) {
                this.routes.splice(idx, 1);
            }
            return undefined;
        };
        Router.prototype.destroy = function () {
            this.routes.forEach(itemsRemove);
            this.hashHandler.remove();
        };
        Router.prototype.dispatchRoute = function (evt) {
            var self = this, len = self.routes.length, cnt, current, result, params, parameterNames, j, lj, idx, newUrl;
            evt.newURL = evt.newURL || getRoute();
            newUrl = evt.newURL;
            idx = newUrl.indexOf('#');
            if (idx >= 0) {
                newUrl = newUrl.substr(idx + 1);
            }
            function emitChanged(result) {
                self.emit('9jsRouteChanged', {
                    route: newUrl
                });
                return result;
            }
            function routeActionError(err) {
                throw err;
            }
            for (cnt = 0; cnt < len; cnt += 1) {
                current = self.routes[cnt];
                result = current.routeRegex.exec(newUrl);
                if (result) {
                    if (current.parameterNames) {
                        parameterNames = current.parameterNames;
                        params = {};
                        for (j = 0, lj = parameterNames.length; j < lj; j += 1) {
                            params[parameterNames[j]] = result[j + 1];
                        }
                    }
                    else {
                        params = result.slice(1);
                    }
                    try {
                        return deferredUtils_1.when(current.execute(params, evt), emitChanged, routeActionError);
                    }
                    catch (err) {
                        console.error(err);
                        if (err.stack) {
                            console.error(err.stack);
                        }
                        throw err;
                    }
                }
            }
            return null;
        };
        Router.prototype.startup = function () {
            var self = this;
            this.hashHandler = on_1.default(window, 'hashchange', function (evt) {
                var e = {
                    bubbles: evt.bubbles,
                    cancelable: evt.cancelable,
                    currentTarget: evt.currentTarget,
                    defaultPrevented: evt.defaultPrevented,
                    eventPhase: evt.eventPhase,
                    explicitOriginalTarget: evt.explicitOriginalTarget,
                    isTrusted: evt.isTrusted,
                    newURL: evt.newURL,
                    oldURL: evt.oldURL,
                    originalTarget: evt.originalTarget,
                    target: evt.target,
                    timeStamp: evt.timeStamp,
                    type: evt.type
                };
                deferredUtils_1.when(self.dispatchRoute(e), function (result) {
                    if (activeRouteDefer) {
                        activeRouteDefer.resolve(result);
                        activeRouteDefer = null;
                    }
                });
            });
        };
        return Router;
    }(Properties_1.default));
    exports.Router = Router;
    var Route = (function (_super) {
        __extends(Route, _super);
        function Route(options, router) {
            var _this = _super.call(this, options) || this;
            _this.routeRegex = convertRouteToRegExp(options.route);
            _this.parameterNames = getParameterNames(options.route);
            _this.parentRouter = router;
            _this.parentRouter.addRoute(_this);
            return _this;
        }
        Route.prototype.remove = function () {
            return this.parentRouter.removeRoute(this);
        };
        Route.prototype.addRoute = function () {
            return this.parentRouter.addRoute.apply(this.parentRouter, arguments);
        };
        Route.prototype.removeRoute = function () {
            return this.parentRouter.removeRoute.apply(this.parentRouter, arguments);
        };
        Route.prototype.register = function () {
            var options = prepareArguments.apply(null, arguments);
            options.route = this.route + options.route;
            return new Route(options, this);
        };
        Route.prototype.titleGetter = function () {
            if ((typeof (this.title) === 'undefined') && this.parentRouter) {
                return (this.parentRouter.get || nullf).call(this.parentRouter, 'title');
            }
            else {
                return this.title;
            }
        };
        Route.prototype.execute = function (args, evt) {
            function rTrue() { return true; }
            var initAction = this.initAction || rTrue, loadAction = this.loadAction || rTrue, title = this.get('title'), self = this;
            return deferredUtils_1.when(initAction.call(this, args, evt), function (result) {
                if (result !== false) {
                    if (typeof (title) === 'string') {
                        window.document.title = title;
                    }
                    else if (typeof (title) === 'function') {
                        deferredUtils_1.when(title(args, evt), function (t) {
                            window.document.title = t;
                        });
                    }
                    return deferredUtils_1.when(loadAction(args, evt), function (_) {
                        var emitArgs = self.emitArguments;
                        if (typeof (emitArgs) === 'function') {
                            emitArgs = emitArgs(args, evt);
                        }
                        return deferredUtils_1.when(emitArgs, function (emitArgs) {
                            return on_1.default.emit(window, '9jsRouteChanged', emitArgs || {});
                        });
                    });
                }
            }, function (err) {
                throw err;
            });
        };
        Route.prototype.initAction = function () {
            var self = this, args = arguments;
            if (this.parentRouter && this.parentRouter.initAction) {
                return deferredUtils_1.when(this.parentRouter.initAction.apply(this.parentRouter, arguments), function () {
                    return self.action.apply(self, args);
                });
            }
            else {
                return this.action.apply(self, args);
            }
        };
        return Route;
    }(Properties_1.default));
    exports.Route = Route;
    var router = new Router();
    function on(type, listener) {
        return router.on(type, listener);
    }
    exports.on = on;
    function emit() {
        var arglist = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            arglist[_i] = arguments[_i];
        }
        return router.emit.apply(router, arglist);
    }
    exports.emit = emit;
    function register(route, action) {
        return router.register(route, action);
    }
    exports.register = register;
    function go(route, replace) {
        return router.go(route, replace);
    }
    exports.go = go;
    function addRoute(route) {
        return router.addRoute(route);
    }
    exports.addRoute = addRoute;
    function removeRoute(route) {
        return router.removeRoute(route);
    }
    exports.removeRoute = removeRoute;
    function startup() {
        router.startup();
    }
    exports.startup = startup;
});
//# sourceMappingURL=router.js.map