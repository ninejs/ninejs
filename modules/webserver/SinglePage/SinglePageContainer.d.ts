/// <reference path="../../../typings/node/node.d.ts" />
/// <reference path="../../../typings/express/express.d.ts" />
import NineplateResource from '../NineplateResource';
import { Request, Response } from '../WebServer';
export default class SinglePageContainer extends NineplateResource {
    context: any;
    handler(req: Request, res: Response): void;
    constructor(arg: any);
}
