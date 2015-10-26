import * as def from './core/deferredUtils';
export interface StyleType {
    enable: (parent?: any) => StyleType;
    disable: () => StyleType;
}
export declare class StyleObject implements StyleType {
    globalWindow: Window;
    children: StyleObject[];
    path: string;
    data: string;
    [name: string]: any;
    document: HTMLDocument;
    handle: StyleInstance;
    normalizeUrls(css: string): string;
    enableOldIE(styleNode: any, result: StyleInstance, parent: any, document: HTMLDocument): void;
    enable(parent?: any): StyleInstance;
    disable(): StyleInstance;
    constructor();
}
export declare class StyleInstance implements StyleType {
    styleNode: HTMLStyleElement;
    children: StyleInstance[];
    enable(): this;
    disable(): this;
}
export declare function style(processResult: StyleObject): StyleObject;
export declare function loadFromString(css: string, uniqueId: string): def.PromiseType<{}>;
export declare function load(id: string, require: any, load: (r: StyleObject) => void): void;
