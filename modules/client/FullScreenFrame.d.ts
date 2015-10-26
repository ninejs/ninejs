import Widget from '../../ui/Widget';
import { PromiseType } from '../../core/deferredUtils';
declare class FullScreenFrame extends Widget {
    init: PromiseType<HTMLElement>;
    containerNode: HTMLElement;
    selectedSetter(idx: any): void;
    addChild(child: any): any;
}
export default FullScreenFrame;
