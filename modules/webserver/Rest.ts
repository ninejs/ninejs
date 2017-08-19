'use strict';
import { default as WebServer, Request, Response } from './WebServer'
import Endpoint from './Endpoint'
import { when } from '../../core/deferredUtils'

export enum ResponseType {
    JSON,
    RAW
}

export interface MethodDescription<T> {
    route: string;
    inputMap: (req: Request) => T | Promise<T>;
    responseType?: ResponseType;
    contentType?: string;
	handleAs?: string;
}

function any<IN, OUT> (method: string, description: MethodDescription<IN>, action: (input: IN, req?: Request, res?: Response) => Promise<OUT>) {
    let endpoint = new Endpoint({
        children: [],
        route: description.route,
        method: method,
		handleAs: description.handleAs || 'json',
        handler: (req: Request, res: Response) => {
            when(description.inputMap(req), (inputArgs) => {
                try {
                    action(inputArgs, req, res).then(output => {
                        if (output) {
                            if (description.contentType) {
                                res.header('Content-Type', description.contentType);
                            }
                            if (description.responseType === ResponseType.RAW) {
                                res.send(output);
                            }
                            else {
                                if (!description.contentType) {
                                    res.header('Content-Type', 'application/json');
                                }
                                res.json(output);
                            }
                        }
                        else {
                            res.send(null);
                        }
                    }, (err) => {
                        res.statusMessage = err.message;
                        res.status(400);
                    });
                }
                catch (err) {
                    res.statusMessage = err.message;
                    res.status(400);
                }
            }, (err) => {
                res.statusMessage = err.message;
                res.status(400);
            })
        }
    });
    return endpoint;
};

export function get<IN, OUT> (description: MethodDescription<IN>, action: (input: IN, req?: Request, res?: Response) => Promise<OUT>) {
    return any<IN, OUT> ('get', description, action);
};
export function post<IN, OUT> (description: MethodDescription<IN>, action: (input: IN, req?: Request, res?: Response) => Promise<OUT>) {
    return any<IN, OUT> ('post', description, action);
};
export function put<IN, OUT> (description: MethodDescription<IN>, action: (input: IN, req?: Request, res?: Response) => Promise<OUT>) {
    return any<IN, OUT> ('put', description, action);
};
export function head<IN, OUT> (description: MethodDescription<IN>, action: (input: IN, req?: Request, res?: Response) => Promise<OUT>) {
    return any<IN, OUT> ('head', description, action);
};
export function del<IN, OUT> (description: MethodDescription<IN>, action: (input: IN, req?: Request, res?: Response) => Promise<OUT>) {
    return any<IN, OUT> ('delete', description, action);
};