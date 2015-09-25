import { StyleInstance } from '../../css';
export declare class BootstrapProto {
    map: {
        [name: string]: string;
    };
    enable(...args: string[]): void;
    disable(...args: string[]): void;
    bootstrapCss: StyleInstance;
    enableCss(val: boolean): void;
    commonCss: StyleInstance;
    enableCommonCss(val: boolean): void;
    verticalResponsiveDeviceCss: StyleInstance;
    enableVResponsiveDevice(val: boolean): void;
    verticalResponsiveCss: StyleInstance;
    enableVResponsiveViewPort(val: boolean): void;
    gridMaxCss: StyleInstance;
    enableGridMax(val: boolean): void;
    constructor();
}
declare var bootstrap: BootstrapProto;
export default bootstrap;
