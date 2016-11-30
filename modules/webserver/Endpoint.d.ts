import Properties from '../../core/ext/Properties';
import WebServer from './WebServer';
import { Request, Response, Application } from './WebServer';
export declare class Endpoint extends Properties {
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
    constructor(args: EndpointArgs);
}
export interface EndpointArgs {
    type?: string;
    method?: string;
    children?: Endpoint[];
    route: string;
    order?: number;
    validate?: (req: Request, res: Response) => any;
    handleAs?: string;
    parserOptions?: any;
    handler?: (req: Request, res: Response, next?: () => void) => void;
}
export default Endpoint;
