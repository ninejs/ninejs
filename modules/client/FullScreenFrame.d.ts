import Widget from '../../ui/Widget';
import { PromiseType } from '../../core/deferredUtils';
import { Container } from './container';
declare class FullScreenFrame extends Widget {
    init: PromiseType<HTMLElement>;
    containerNode: HTMLElement;
    container: Container;
    selectedSetter(idx: any): void;
    addChild(child: any): any;
    constructor(args: any, containerModule: Container);
}
export default FullScreenFrame;
