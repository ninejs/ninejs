import { PromiseType } from './core/deferredUtils';
export interface RawResponse {
    response: any;
    body: any;
}
export declare function raw(...args: any[]): Promise<RawResponse>;
declare let result: {
    (...args: any[]): PromiseType<any>;
    get: (...args: any[]) => PromiseType<any>;
    post: (...args: any[]) => PromiseType<any>;
    put: (...args: any[]) => PromiseType<any>;
    del: (...args: any[]) => PromiseType<any>;
    patch: (...args: any[]) => PromiseType<any>;
};
export declare function get(...args: any[]): any;
export declare function post(...args: any[]): any;
export declare function put(...args: any[]): any;
export declare function del(...args: any[]): any;
export declare function patch(...args: any[]): any;
export default result;
