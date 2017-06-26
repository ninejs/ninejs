/// <reference types="winston" />
import Module from './Module';
import winston = require('winston');
export declare class NineJs extends Module {
    logger: {
        [name: string]: winston.LoggerInstance;
    };
    config: any;
    configGetter(): any;
    loggerGetter(name: string): winston.LoggerInstance;
    init(name: string, config: any): void;
    constructor(args: any);
}
declare var result: Module;
export default result;
