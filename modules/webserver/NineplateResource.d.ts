import StaticResource from './StaticResource';
import { Request, Response } from './WebServer';
declare class NineplateResource extends StaticResource {
    type: string;
    contentType: string;
    doctype: string;
    context: any;
    handler(req: Request, res: Response): void;
    constructor(arg: any);
}
export default NineplateResource;
