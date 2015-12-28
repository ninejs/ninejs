import { Request, Response } from './WebServer';
import Endpoint from './Endpoint';
import { PromiseType } from '../../core/deferredUtils';
export declare enum ResponseType {
    JSON = 0,
    RAW = 1,
}
export interface MethodDescription<T> {
    route: string;
    inputMap: (req: Request) => T | PromiseType<T>;
    responseType?: ResponseType;
    contentType?: string;
}
export declare function get<IN, OUT>(description: MethodDescription<IN>, action: (input: IN, req?: Request, res?: Response) => PromiseType<OUT>): Endpoint;
export declare function post<IN, OUT>(description: MethodDescription<IN>, action: (input: IN, req?: Request, res?: Response) => PromiseType<OUT>): Endpoint;
export declare function put<IN, OUT>(description: MethodDescription<IN>, action: (input: IN, req?: Request, res?: Response) => PromiseType<OUT>): Endpoint;
export declare function head<IN, OUT>(description: MethodDescription<IN>, action: (input: IN, req?: Request, res?: Response) => PromiseType<OUT>): Endpoint;
export declare function del<IN, OUT>(description: MethodDescription<IN>, action: (input: IN, req?: Request, res?: Response) => PromiseType<OUT>): Endpoint;
