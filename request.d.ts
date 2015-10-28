import { PromiseType } from './core/deferredUtils';
export interface RawResponse {
    response: any;
    body: any;
}
export declare function raw(...args: any[]): PromiseType<RawResponse>;
export default function fn(...args: any[]): any;
export declare function get(...args: any[]): any;
export declare function post(...args: any[]): any;
export declare function put(...args: any[]): any;
export declare function del(...args: any[]): any;
export declare function patch(...args: any[]): any;
