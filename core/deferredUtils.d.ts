export interface PromiseConstructorType<T> {
    promise: Promise<T>;
    resolve: (v: T | Promise<T>) => T;
    reject: (e: Error) => void;
}
export interface PromiseManagerType {
    when: <T, U>(v: T | Promise<T>, success: (v?: T) => U | Promise<U>, reject?: (e?: Error) => void) => Promise<U>;
    defer: <T>() => PromiseConstructorType<T>;
    all: (arr: any[]) => Promise<any[]>;
    delay: (ms: number) => Promise<any>;
}
export declare function isPromise<T>(valueOrPromise: any): valueOrPromise is Promise<T>;
export declare var delay: (ms: number) => Promise<any>;
export declare var mapToPromises: (arr: any[]) => Promise<any>[];
export declare var defer: <T>() => PromiseConstructorType<T>;
export declare var when: <T, U>(v: T | Promise<T>, success: (v?: T) => U | Promise<U>, reject?: (e?: Error) => U | Promise<U>) => Promise<U>;
export declare var all: (arr: any[]) => Promise<any[]>;
export declare var series: (taskList: any[]) => Promise<any>;
export declare function resolve<T>(val: T): Promise<T>;
export declare function ncall<T>(fn: (...args: any[]) => any, self: any, ...args: any[]): Promise<T>;
export declare function nfcall<T>(fn: (...args: any[]) => any, ...args: any[]): Promise<T>;
