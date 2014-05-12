/* global window */
define(['../core/extend', '../core/ext/Evented', '../core/ext/Properties', './hash', '../core/on', '../core/array', '../core/deferredUtils'], function(extend, Evented, Properties, hash, on, array, def) {
	'use strict';
	var idMatch = /:(\w[\w\d]*)/g,
		idReplacement = '([^\\/]+)',
		globMatch = /\*(\w[\w\d]*)/,
		globReplacement = '(.+)';
	function nullf() {
		return null;
	}
	/*
	* From Dojo Toolkit's router/RouterBase */
	function convertRouteToRegExp(/* String */ route) {
		// Sub in based on IDs and globs
		route = route.replace(idMatch, idReplacement);
		route = route.replace(globMatch, globReplacement);
		// Make sure it's an exact match
		route = '^' + route + '$';

		return new RegExp(route);
	}
	function getParameterNames(/* String */ route) {
		var parameterNames = [],
			match;

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
		var options = {};
		if (typeof(route) === 'object') {
			options = route;
		}
		else {
			options.action = action;
			options.route = route;
		}
		return options;
	}
	/**
	* {
	* 	action: Function,
	*	loadAction: Function,
	*	title: String or Function,
	*	emitArguments: Object or Function
	* }
	*/
	var Route = extend(Properties, {
		remove: function () {
			this.parentRouter.removeRoute(this);
		},
		addRoute: function () {
			return this.parentRouter.addRoute.apply(this.parentRouter, arguments);
		},
		removeRoute: function () {
			return this.parentRouter.removeRoute.apply(this.parentRouter, arguments);
		},
		register: function () {
			var options = prepareArguments.apply(null, arguments);
			options.route = this.route + options.route;
			return new Route(options, this);
		},
		titleGetter: function () {
			if ((typeof(this.title) === 'undefined') && this.parentRouter) {
				return (this.parentRouter.get || nullf).call(this.parentRouter, 'title');
			}
			else {
				return this.title;
			}
		},
		execute: function (args, evt) {
			function rTrue() { return true; }
			var initAction = this.action || this.initAction || rTrue,
				loadAction = this.loadAction || rTrue,
				title = this.get('title'),
				self = this;
			return def.when(initAction.call(this, args, evt), function(result) {
				if (result !== false) { //if result is false it means stop propagation
					if (typeof(title) === 'string') {
						window.document.title = title;
					}
					else if (typeof(title) === 'function') {
						def.when(title(args, evt), function(t) {
							window.document.title = t;
						});
					}
					return def.when(loadAction(args, evt), function() {
						var emitArgs = self.emitArguments;
						if (typeof(emitArgs) === 'function') {
							emitArgs = emitArgs(args, evt);
						}
						return def.when(emitArgs, function(emitArgs) {
							on.emit(window, '9jsRouteChanged', emitArgs || {});
						});
					});
				}
			});
		},
		initAction: function() {
			var self = this,
				args = arguments;
			if (this.parentRouter && this.parentRouter.initAction) {
				return def.when(this.parentRouter.initAction.apply(this.parentRouter, arguments), function() {
					return self.action.apply(self, args);
				});
			}
			else {
				return self.action.apply(self, args);
			}
		}
	}, function(/* Object */ options, /* Router */ router) {
		extend.mixin(this, options);
		this.routeRegex = convertRouteToRegExp(options.route);
		this.parameterNames = getParameterNames(options.route);
		this.parentRouter = router;
		this.parentRouter.addRoute(this);
	});
	var Router = extend(Evented, {
		register: function (/*route, action*/) {
			var options = prepareArguments.apply(null, arguments);
			return new Route(options, this);
		},
		go: function(/* String */ route, /* Boolean */ replace) {
			var current = hash();
			if (current === route) {
				this.dispatchRoute({ newURL: route, oldURL: '' });
			}
			else {
				hash(route, replace);
			}
		},
		addRoute: function(route) {
			this.routes.push(route);
		},
		removeRoute: function(route) {
			var idx = array.indexOf(this.routes, route);
			if (idx >= 0) {
				this.routes.splice(idx, 1);
			}
		},
		destroy: function() {
			array.forEach(this.routes, function(item) {
				item.remove();
			});
			this.hashHandler.remove();
		},
		dispatchRoute: function(evt) {
			var self = this,
				len = self.routes.length,
				cnt,
				current,
				result,
				params,
				parameterNames,
				j,
				lj,
				idx,
				newUrl;
			newUrl = evt.newURL;
			idx = newUrl.indexOf('#');
			if (idx >= 0) {
				newUrl = newUrl.substr(idx + 1);
			}
			for (cnt = 0; cnt < len; cnt += 1) {
				current = self.routes[cnt];
				result = current.routeRegex.exec(newUrl);
				if (result) {
					if (current.parameterNames) {
						parameterNames = current.parameterNames;
						params = {};

						for (j=0, lj=parameterNames.length; j < lj; j += 1){
							params[parameterNames[j]] = result[j+1];
						}
					} else {
						params = result.slice(1);
					}
					current.execute(params, evt);
				}
			}
		}
	}, function () {
		var self = this;
		this.routes = [];
		this.startup = function () {
			this.hashHandler = on(window, 'hashchange', function(evt) {
				self.dispatchRoute(evt);
			});
		};
	});
	return new Router();
});