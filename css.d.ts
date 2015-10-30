import * as def from './core/deferredUtils';
export interface StyleType {
    enable: (parent?: any) => StyleType;
    disable: () => StyleType;
}
export declare class StyleObject implements StyleType {
    children: StyleObject[];
    path: string;
    data: string;
    [name: string]: any;
    document: HTMLDocument;
    handle: StyleInstance;
    enableOldIE(styleNode: any, result: StyleInstance, parent: any, document: HTMLDocument): void;
    enable(parent?: any): StyleInstance;
    disable(): StyleInstance;
    constructor();
}
export declare class StyleInstance implements StyleType {
    styleNode: HTMLStyleElement;
    children: StyleInstance[];
    enable(): StyleInstance;
    disable(): StyleInstance;
}
export declare function style(processResult: StyleObject): StyleObject;
export declare function loadFromString(css: string, uniqueId: string): def.PromiseType<{}>;
export declare function load(id: string, require: any, load: (r: StyleObject) => void): void;
