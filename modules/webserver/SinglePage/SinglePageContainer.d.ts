import NineplateResource from '../NineplateResource';
import { Request, Response } from '../WebServer';
declare class SinglePageContainer extends NineplateResource {
    context: any;
    handler(req: Request, res: Response): void;
    constructor(arg: any);
}
export default SinglePageContainer;
