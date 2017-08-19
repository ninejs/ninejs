export interface RawResponse {
    response: any;
    body: any;
}
export declare function raw(...args: any[]): Promise<RawResponse>;
declare let result: {
    (...args: any[]): Promise<any>;
    get: (...args: any[]) => Promise<any>;
    post: (...args: any[]) => Promise<any>;
    put: (...args: any[]) => Promise<any>;
    del: (...args: any[]) => Promise<any>;
    patch: (...args: any[]) => Promise<any>;
};
export declare function get(...args: any[]): any;
export declare function post(...args: any[]): any;
export declare function put(...args: any[]): any;
export declare function del(...args: any[]): any;
export declare function patch(...args: any[]): any;
export default result;
