'use strict';
import { default as WebServer, Request, Response } from './WebServer'
import Endpoint from './Endpoint'
import { PromiseType, when } from '../../core/deferredUtils'

export enum ResponseType {
    JSON,
    RAW
}

export interface MethodDescription<T> {
    route: string;
    inputMap: (req: Request) => T | PromiseType<T>;
    responseType?: ResponseType;
    contentType?: string;
	handleAs?: string;
}

function any<IN, OUT> (method: string, description: MethodDescription<IN>, action: (input: IN, req?: Request, res?: Response) => PromiseType<OUT>) {
    let endpoint = new Endpoint({
        children: [],
        route: description.route,
        method: method,
		handleAs: description.handleAs || 'json',
        handler: (req: Request, res: Response) => {
            when(description.inputMap(req), (inputArgs) => {
                try {
                    action(inputArgs, req, res).then(output => {
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
                    }, (err) => {
                        res.status(400).send(err.message);
                    });
                }
                catch (err) {
                    res.status(400).send(err.message);
                }
            }, (err) => {
                res.status(400).send(err.message);
            })
        }
    });
    return endpoint;
};

export function get<IN, OUT> (description: MethodDescription<IN>, action: (input: IN, req?: Request, res?: Response) => PromiseType<OUT>) {
    return any<IN, OUT> ('get', description, action);
};
export function post<IN, OUT> (description: MethodDescription<IN>, action: (input: IN, req?: Request, res?: Response) => PromiseType<OUT>) {
    return any<IN, OUT> ('post', description, action);
};
export function put<IN, OUT> (description: MethodDescription<IN>, action: (input: IN, req?: Request, res?: Response) => PromiseType<OUT>) {
    return any<IN, OUT> ('put', description, action);
};
export function head<IN, OUT> (description: MethodDescription<IN>, action: (input: IN, req?: Request, res?: Response) => PromiseType<OUT>) {
    return any<IN, OUT> ('head', description, action);
};
export function del<IN, OUT> (description: MethodDescription<IN>, action: (input: IN, req?: Request, res?: Response) => PromiseType<OUT>) {
    return any<IN, OUT> ('delete', description, action);
};