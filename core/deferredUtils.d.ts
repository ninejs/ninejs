/// <reference path="extend.d.ts" />
export interface PromiseType {
    then(resolve: (v: any) => any, ...rest: ((v: any) => void)[]): PromiseType;
    fin(act: () => void): PromiseType;
}
export interface PromiseConstructorType {
    promise: PromiseType;
    resolve: (v: any) => void;
    reject: (e: Error) => void;
}
export interface PromiseManagerType {
    when: (v: any, success: (v: any) => any, reject?: (e: Error) => void, fin?: () => void) => PromiseType;
    defer: (v?: any) => PromiseConstructorType;
    all: (arr: any[]) => PromiseType;
    delay: (ms: number) => PromiseType;
}
export declare function isPromise(valueOrPromise: any): boolean;
export declare var delay: (ms: number) => PromiseType;
export declare var mapToPromises: (arr: any[]) => PromiseType[];
export declare var defer: (v?: any) => PromiseConstructorType;
export declare var when: (valueOrPromise: any, resolve: (v: any) => any, reject?: (e: any) => void, progress?: (p: any) => void, finalBlock?: () => void) => PromiseType;
export declare var all: (arr: any[]) => PromiseType;
export declare var series: (taskList: any[]) => PromiseType;
export declare function ncall(fn: (...args: any[]) => any, self: any, ...args: any[]): PromiseType;
export declare function nfcall(fn: (...args: any[]) => any, ...args: any[]): PromiseType;
export declare function resolve(r: any): PromiseType;
