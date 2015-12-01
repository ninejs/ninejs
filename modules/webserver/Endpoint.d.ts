/// <reference path="../../typings/express/express.d.ts" />
import Properties from '../../core/ext/Properties';
import WebServer from './WebServer';
import { Request, Response, Application } from './WebServer';
declare class Endpoint extends Properties {
    type: string;
    method: string;
    children: Endpoint[];
    app: Application;
    server: WebServer;
    route: string;
    order: number;
    validate: (req: Request, res: Response) => any;
    handleAs: string;
    parserOptions: any;
    on(eventType: string, callback: (ev: any) => void): any;
    emit(eventType: string, data: any): any;
    handler(req: Request, res: Response, next?: () => void): void;
    constructor(args: any);
}
export { Endpoint };
export default Endpoint;
