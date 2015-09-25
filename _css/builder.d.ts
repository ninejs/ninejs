/// <reference path="../typings/node/node.d.ts" />
export interface AMDPrefixesType {
    name: string;
    location: string;
}
export interface ProcessedCssType {
    path: string;
    data: string;
    children: ProcessedCssType[];
}
export interface ProcessCssOptionsType {
    path?: string;
    parentPath?: string;
    toBase64?: boolean;
    [name: string]: any;
}
export interface ProcessCssImportType {
    children: ProcessedCssType[];
    css: string;
}
export declare function processCss(data: string, path: string, realPath: string, prefixes: AMDPrefixesType[], baseUrl: string, options: ProcessCssOptionsType, callback: (t: ProcessedCssType) => void): void;
