/// <reference path="../../typings/node/node.d.ts" />
/// <reference path="../../typings/method-override/method-override.d.ts" />
/// <reference path="../../typings/morgan/morgan.d.ts" />
import Properties from '../../core/ext/Properties';
import Endpoint from './Endpoint';
import StaticResource from './StaticResource';
import NineplateResource from './NineplateResource';
import SinglePageContainer from './SinglePage/SinglePageContainer';
import ClientUtils from './ClientUtils';
import { Logger } from '../ninejs-server';
import http = require('http');
declare class WebServer extends Properties {
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
    logger: {
        [name: string]: Logger;
    };
    app: Application;
    config: any;
    baseUrl: string;
    jsUrl: string;
    port: number;
    ip: string;
    phases: {
        static: StaticResource[];
        utils: Endpoint[];
        auth: Endpoint[];
        endpoint: Endpoint[];
        [name: string]: Endpoint[];
    };
    clientUtils: ClientUtils;
    init(config: any): void;
    build(): void;
    add(resource: Endpoint, prefix?: string): void;
    postCreate(): void;
    clientSetup(action: (utils: ClientUtils) => void): void;
    constructor(args: any);
}
export default WebServer;
export interface Request extends http.ServerRequest {
    get(name: string): string;
    header(name: string): string;
    headers: {
        [key: string]: string;
    };
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
    body: any;
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
    get(field: string): string;
    clearCookie(name: string, options?: any): Response;
    cookie(name: string, val: string, options: CookieOptions): Response;
    cookie(name: string, val: any, options: CookieOptions): Response;
    cookie(name: string, val: any): Response;
    redirect(url: string): void;
    redirect(status: number, url: string): void;
    redirect(url: string, status: number): void;
    render(view: string, options?: Object, callback?: (err: Error, html: string) => void): void;
    render(view: string, callback?: (err: Error, html: string) => void): void;
    locals: any;
    charset: string;
}
export interface Application {
    listen: (port: number, ip?: string) => void;
    engine: (name: string, callback: (path: string, options: any, callback: (err: any, val: any) => void) => void) => void;
    enable: (name: string) => void;
    render(name: string, options?: Object, callback?: (err: Error, html: string) => void): void;
    render(name: string, callback: (err: Error, html: string) => void): void;
}
