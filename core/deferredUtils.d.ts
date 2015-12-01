export interface PromiseType<T> {
    then<U>(resolve: (v: T) => U | PromiseType<U>, onrejected?: (reason: any) => any): PromiseType<U>;
    catch(onrejected?: (reason: any) => any): PromiseType<T>;
    fin(act: () => void): PromiseType<T>;
}
export interface PromiseConstructorType<T> {
    promise: PromiseType<T>;
    resolve: (v: T | PromiseType<T>) => T;
    reject: (e: Error) => void;
}
export interface PromiseManagerType {
    when: <T, U>(v: T | PromiseType<T>, success: (v?: T) => U | PromiseType<U>, reject?: (e?: Error) => void, fin?: () => void) => PromiseType<U>;
    defer: <T>(v?: T) => PromiseConstructorType<T>;
    all: (arr: any[]) => PromiseType<any[]>;
    delay: (ms: number) => PromiseType<any>;
}
export declare function isPromise<T>(valueOrPromise: any): valueOrPromise is PromiseType<T>;
export declare var delay: (ms: number) => PromiseType<any>;
export declare var mapToPromises: (arr: any[]) => PromiseType<any>[];
export declare var defer: <T>(v?: T) => PromiseConstructorType<T>;
export declare var when: <T, U>(v: T | PromiseType<T>, success: (v?: T) => U | PromiseType<U>, reject?: (e?: Error) => void, fin?: () => void) => PromiseType<U>;
export declare var all: (arr: any[]) => PromiseType<any[]>;
export declare var series: (taskList: any[]) => PromiseType<any>;
export declare function resolve<T>(val: T): PromiseType<T>;
export declare function ncall<T>(fn: (...args: any[]) => any, self: any, ...args: any[]): PromiseType<T>;
export declare function nfcall<T>(fn: (...args: any[]) => any, ...args: any[]): PromiseType<T>;
