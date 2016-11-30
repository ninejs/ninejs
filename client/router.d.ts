/// <reference types="es6-promise" />
import { PromiseType } from '../core/deferredUtils';
import Properties from '../core/ext/Properties';
export interface RouteOptions {
    action: (evt: any) => void;
    route: string;
}
export interface RouterBase {
    addRoute: (route: Route) => Route;
    removeRoute: (route: Route) => any;
    initAction: (evt: any) => any;
    loadAction: (args: any, evt: any) => any;
    get: (name: string) => any;
}
export declare class Router extends Properties implements RouterBase {
    initAction: (evt: any) => any;
    loadAction: (args: any, evt: any) => any;
    on(type: string, listener: (e?: any) => any): any;
    emit(...arglist: any[]): any;
    register(route: any, action?: (evt: any) => void, opts?: any): Route;
    go(route: string, replace?: boolean): Promise<any>;
    addRoute(route: Route): Route;
    removeRoute(route: Route): any;
    destroy(): void;
    dispatchRoute(evt: any): Promise<any>;
    hashHandler: {
        remove: () => void;
    };
    routes: Route[];
    startup(): void;
    constructor();
}
export declare class Route extends Properties implements RouterBase {
    parentRouter: RouterBase;
    route: string;
    title: string;
    emitArguments: any;
    remove(): any;
    addRoute(): any;
    removeRoute(): any;
    register(): Route;
    titleGetter(): any;
    execute(args: any, evt: any): Promise<any>;
    action: (evt: any) => void;
    loadAction: (args: any, evt: any) => any;
    initAction(): any;
    routeRegex: RegExp;
    parameterNames: string[];
    constructor(options: RouteOptions, router: RouterBase);
}
export { PromiseType };
export declare function on(type: string, listener: (e?: any) => any): any;
export declare function emit(...arglist: any[]): any;
export declare function register(route: any, action?: (evt: any) => void): Route;
export declare function go(route: string, replace?: boolean): Promise<any>;
export declare function addRoute(route: Route): Route;
export declare function removeRoute(route: Route): any;
export declare function startup(): void;
