import Widget from '../../ui/Widget';
import { Container } from './container';
declare class FullScreenFrame extends Widget {
    init: Promise<HTMLElement>;
    containerNode: HTMLElement;
    container: Container;
    selectedSetter(idx: any): void;
    addChild(child: any): any;
    constructor(args: any, containerModule: Container);
}
export default FullScreenFrame;
