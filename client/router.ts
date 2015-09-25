import { indexOf, forEach } from '../core/array';
import { when, PromiseType } from '../core/deferredUtils';
import Evented from '../core/ext/Evented';
import Properties from '../core/ext/Properties';
import hash from './hash';
import coreOn from '../core/on';

declare var window: any;

var idMatch = /:(\w[\w\d]*)/g,
	idReplacement = '([^\\/]+)',
	globMatch = /\*(\w[\w\d]*)/,
	globReplacement = '(.+)';
function nullf(): any {
	return null;
}
function cleanRoute(r: string) {
	if (r && r.length && (r.indexOf('#') === 0)) {
		return r.substr(1);
	}
	return r;
}
function getRoute() {
	var r = hash();
	return cleanRoute(r);
}
function setRoute (route: string, replace: boolean) {
	return hash(route, replace);
}
/*
* From Dojo Toolkit's router/RouterBase */
function convertRouteToRegExp(route: string) {
	// Sub in based on IDs and globs
	route = route.replace(idMatch, idReplacement);
	route = route.replace(globMatch, globReplacement);
	// Make sure it's an exact match
	route = '^' + route + '$';

	return new RegExp(route);
}
function getParameterNames(route: string) {
	var parameterNames: string[] = [],
		match: RegExpExecArray;

	idMatch.lastIndex = 0;

	while ((match = idMatch.exec(route)) !== null) {
		parameterNames.push(match[1]);
	}
	if ((match = globMatch.exec(route)) !== null) {
		parameterNames.push(match[1]);
	}

	return parameterNames.length > 0 ? parameterNames : null;
}
export interface RouteOptions {
	action: (evt: any) => void,
	route: string
}
function prepareArguments(route: any, action?: (evt: any) => void) : RouteOptions {
	if (typeof(route) === 'object') {
		return route;
	}
	else {
		return {
			action: action,
			route: route
		};
	}
}

export interface RouterBase {
	addRoute: (route: Route) => Route,
	removeRoute: (route: Route) => any,
	initAction: (evt: any) => any,
	loadAction: (args: any, evt: any) => any,
	get: (name: string) => any
}

export class Router extends Properties implements RouterBase {
	initAction: (evt: any) => any
	loadAction: (args: any, evt: any) => any
	on (type: string, listener: (e?: any) => any){
		return Evented.on.apply(this, arguments);
	}
	emit (...arglist: any[]/*type, event*/){
		return Evented.emit.apply(this, arguments);
	}
	register (route: any, action?: (evt: any) => void) {
		var options = prepareArguments(route, action);
		return new Route(options, this);
	}
	go (route: string, replace: boolean) {
		var current = getRoute();
		route = cleanRoute(route);
		this.emit('9jsRouteChanging', { route: route, oldRoute: current, replace: replace });
		if (current === route) {
			this.dispatchRoute({ newURL: route, oldURL: '' });
		}
		else {
			setRoute(route, replace);
		}
	}
	addRoute (route: Route) {
		var self = this;
		this.routes.push(route);
		return route;
	}
	removeRoute (route: Route): any {
		var idx = this.routes.indexOf(route);
		if (idx >= 0) {
			this.routes.splice(idx, 1);
		}
		return undefined;
	}
	destroy () {
		this.routes.forEach(function(item) {
			item.remove();
		});
		this.hashHandler.remove();
	}
	dispatchRoute (evt: any) {
		var self = this,
			len = self.routes.length,
			cnt: number,
			current: Route,
			result: RegExpExecArray,
			params: any,
			parameterNames: string[],
			j: number,
			lj: number,
			idx: number,
			newUrl: string;
		evt.newURL = evt.newURL || getRoute();
		newUrl = evt.newURL;
		idx = newUrl.indexOf('#');
		if (idx >= 0) {
			newUrl = newUrl.substr(idx + 1);
		}
		function emitChanged () {
			self.emit('9jsRouteChanged', {
				route: newUrl
			});
		}
		function routeActionError(err: Error) {
			throw err;
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
				try {
					return when(current.execute(params, evt), emitChanged, routeActionError);
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
	}
	hashHandler: { remove: () => void };
	routes: Route[];
	startup () {
		var self = this;
		this.hashHandler = coreOn(window, 'hashchange', function (evt: any) {
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
			self.dispatchRoute(e);
		});
	}
	constructor () {
		super();
		this.routes = [];
	}
}

/**
* {
* 	action: Function,
*	loadAction: Function,
*	title: String or Function,
*	emitArguments: Object or Function
* }
*/
export class Route extends Properties implements RouterBase {
	parentRouter: RouterBase;
	route: string;
	title: string;
	emitArguments: any;
	remove () {
		return this.parentRouter.removeRoute(this);
	}
	addRoute () {
		return this.parentRouter.addRoute.apply(this.parentRouter, arguments);
	}
	removeRoute () {
		return this.parentRouter.removeRoute.apply(this.parentRouter, arguments);
	}
	register () {
		var options = prepareArguments.apply(null, arguments);
		options.route = this.route + options.route;
		return new Route(options, this);
	}
	titleGetter () {
		if ((typeof(this.title) === 'undefined') && this.parentRouter) {
			return (this.parentRouter.get || nullf).call(this.parentRouter, 'title');
		}
		else {
			return this.title;
		}
	}
	execute (args: any, evt: any) {
		function rTrue() { return true; }
		var initAction = this.initAction || rTrue,
			loadAction: (...args: any[]) => any = this.loadAction || rTrue,
			title = this.get('title'),
			self = this;
		return when(<any>initAction.call(this, args, evt), function(result): PromiseType {
			if (result !== false) { //if result is false it means stop propagation
				if (typeof(title) === 'string') {
					window.document.title = title;
				}
				else if (typeof(title) === 'function') {
					when(title(args, evt), function(t) {
						window.document.title = t;
					});
				}
				return when(loadAction(args, evt), function(_) {
					var emitArgs = self.emitArguments;
					if (typeof(emitArgs) === 'function') {
						emitArgs = emitArgs(args, evt);
					}
					return when(emitArgs, function(emitArgs: any) {
						return coreOn.emit(window, '9jsRouteChanged', emitArgs || {});
					});
				});
			}
		}, function (err) {
			throw err;
		});
	}
	action: (evt: any) => void;
	loadAction: (args: any, evt: any) => any;
	initAction (): any {
		var self = this,
			args = arguments;
		if (this.parentRouter && this.parentRouter.initAction) {
			return when(this.parentRouter.initAction.apply(this.parentRouter, arguments), function() {
				return self.action.apply(self, args);
			});
		}
		else {
			return this.action.apply(self, args);
		}
	}
	routeRegex: RegExp
	parameterNames: string[]
	constructor (options: RouteOptions, router: RouterBase) {
		super();
		Properties.mixin(options).call(this);
		this.routeRegex = convertRouteToRegExp(options.route);
		this.parameterNames = getParameterNames(options.route);
		this.parentRouter = router;
		this.parentRouter.addRoute(this);
	}
}

export { PromiseType };
var router = new Router();

export function on (type: string, listener: (e?: any) => any){
	return router.on(type, listener);
}
export function emit (...arglist: any[]/*type, event*/){
	return router.emit(...arglist);
}
export function register (route: any, action?: (evt: any) => void) {
	return router.register (route, action);
}
export function go (route: string, replace?: boolean) {
	return router.go(route, replace);
}
export function addRoute (route: Route) {
	return router.addRoute (route);
}
export function removeRoute (route: Route): any {
	return router.removeRoute (route);
}
export function startup () {
	router.startup();
}