/// <reference types="winston" />
import Properties from '../../core/ext/Properties';
import WebServer from './WebServer';
import StaticResource from './StaticResource';
import winston = require('winston');
import { Request, Response } from './WebServer';
export declare class CacheManifest extends Properties {
    baseUrl: string;
    defaultCreationDate: Date;
    networkResources: string[];
    cacheResources: string[];
    offlineResources: string[];
    config: any;
    cacheEndpoint: StaticResource;
    addToCache(collection: string[], url: string, prefix: string, filter: (url: string) => boolean): void;
    cache(url: string, prefix?: string, filter?: (url: string) => boolean): void;
    network(url: string, prefix: string, filter: (url: string) => boolean): void;
    handler(req: Request, res: Response): void;
    constructor(args: any);
}
export declare class Utils {
    webServer: WebServer;
    appCache: CacheManifest;
    requireJsConfigEndpoint: StaticResource;
    cacheEndpoint: StaticResource;
    amdPaths: {
        [name: string]: string;
    };
    aliases: string[][];
    boot: string[];
    modules: {
        [name: string]: any;
    };
    units: {
        [name: string]: any;
    };
    postActions: string[];
    has: {
        [name: string]: any;
    };
    logger: {
        [name: string]: winston.LoggerInstance;
    };
    on(type: string, listener: (e?: any) => any): any;
    emit(type: string, data: any): any;
    init(webServer: WebServer): void;
    addAmdPath(prefix: string, path: string): void;
    addAmdAlias(moduleName: string, alias: string): void;
    addBoot(target: string): void;
    addModule(name: string, target: any): void;
    getUnit(name: string): any;
    addPostAction(action: string): void;
    requireJsConfigHandler(req: Request, res: Response): void;
    constructor();
}
export default Utils;
