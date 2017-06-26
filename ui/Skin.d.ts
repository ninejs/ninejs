import Properties from '../core/ext/Properties';
import { ResultFunction } from '../nineplate';
import { StyleType } from '../css';
declare class Skin extends Properties {
    cssList: StyleType[];
    template: ResultFunction | string;
    enabled: boolean;
    applies(): boolean;
    templateSetter(value: any): void;
    enable(widget: {
        domNode: any;
        mixinProperties: (obj: any) => void;
    }): Promise<{}>;
    disable(): void;
    updated(control: any): void;
}
export default Skin;
