export declare type PromiseType<T> = Promise<T>;
export interface PromiseConstructorType<T> {
    promise: PromiseType<T>;
    resolve: (v: T | PromiseType<T>) => T;
    reject: (e: Error) => void;
}
export interface PromiseManagerType {
    when: <T, U>(v: T | PromiseType<T>, success: (v?: T) => U | PromiseType<U>, reject?: (e?: Error) => void) => PromiseType<U>;
    defer: <T>() => PromiseConstructorType<T>;
    all: (arr: any[]) => PromiseType<any[]>;
    delay: (ms: number) => PromiseType<any>;
}
export declare function isPromise<T>(valueOrPromise: any): valueOrPromise is PromiseType<T>;
export declare var delay: (ms: number) => PromiseType<any>;
export declare var mapToPromises: (arr: any[]) => PromiseType<any>[];
export declare var defer: <T>() => PromiseConstructorType<T>;
export declare var when: <T, U>(v: T | PromiseType<T>, success: (v?: T) => U | PromiseType<U>, reject?: (e?: Error) => void) => PromiseType<U>;
export declare var all: (arr: any[]) => PromiseType<any[]>;
export declare var series: (taskList: any[]) => PromiseType<any>;
export declare function resolve<T>(val: T): Promise<T>;
export declare function ncall<T>(fn: (...args: any[]) => any, self: any, ...args: any[]): Promise<T>;
export declare function nfcall<T>(fn: (...args: any[]) => any, ...args: any[]): Promise<T>;
