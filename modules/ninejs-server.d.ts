/// <reference path="../typings/node/node.d.ts" />
/// <reference path="../typings/bunyan/bunyan.d.ts" />
import Module from './Module';
declare var result: Module;
export default result;
export interface LoggerStream {
    type?: string;
    level?: number | string;
    path?: string;
    stream?: NodeJS.WritableStream | LoggerStream;
    closeOnExit?: boolean;
}
export interface Logger {
    addStream(stream: LoggerStream): void;
    level(value: number | string): void;
    levels(name: number | string, value: number | string): void;
    trace(error: Error, format?: any, ...params: any[]): void;
    trace(buffer: Buffer, format?: any, ...params: any[]): void;
    trace(obj: Object, format?: any, ...params: any[]): void;
    trace(format: string, ...params: any[]): void;
    debug(error: Error, format?: any, ...params: any[]): void;
    debug(buffer: Buffer, format?: any, ...params: any[]): void;
    debug(obj: Object, format?: any, ...params: any[]): void;
    debug(format: string, ...params: any[]): void;
    info(error: Error, format?: any, ...params: any[]): void;
    info(buffer: Buffer, format?: any, ...params: any[]): void;
    info(obj: Object, format?: any, ...params: any[]): void;
    info(format: string, ...params: any[]): void;
    warn(error: Error, format?: any, ...params: any[]): void;
    warn(buffer: Buffer, format?: any, ...params: any[]): void;
    warn(obj: Object, format?: any, ...params: any[]): void;
    warn(format: string, ...params: any[]): void;
    error(error: Error, format?: any, ...params: any[]): void;
    error(buffer: Buffer, format?: any, ...params: any[]): void;
    error(obj: Object, format?: any, ...params: any[]): void;
    error(format: string, ...params: any[]): void;
    fatal(error: Error, format?: any, ...params: any[]): void;
    fatal(buffer: Buffer, format?: any, ...params: any[]): void;
    fatal(obj: Object, format?: any, ...params: any[]): void;
    fatal(format: string, ...params: any[]): void;
}
