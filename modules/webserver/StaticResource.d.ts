/// <reference path="../../typings/node/node.d.ts" />
/// <reference path="../../typings/express/express.d.ts" />
import { Endpoint } from './Endpoint';
import { Request, Response } from './WebServer';
declare class NonCachedStaticResource extends Endpoint {
    contentType: string;
    content: any;
    props: any;
    path: string;
    options: any;
    action: (req: Request, res: Response) => void;
    handler(req: Request, res: Response): void;
    constructor(args: any);
}
declare class StaticResource extends NonCachedStaticResource {
    maxAge: number;
    cacheType: string;
    lastModifiedSince: Date;
    etag: string;
    path: string;
    applyETag(res: Response, content: string): void;
    mustRevalidate(req: Request, res: Response): boolean;
    handler(req: Request, res: Response): void;
    constructor(args: any);
}
export { NonCachedStaticResource, StaticResource };
export default StaticResource;
