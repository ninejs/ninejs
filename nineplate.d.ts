import Properties from './core/ext/Properties';
import * as _domProcessor from './_nineplate/domProcessor';
import * as _textProcessor from './_nineplate/textProcessor';
export interface ResultFunction {
    (context: any, doc?: HTMLDocument): any;
    amdDependencies?: string[];
}
export interface NineplateType {
    buildTemplate: (val: string) => Template;
    getTemplate: (path: string, callback: (t: Template) => void) => void;
    load: (name: string, req: any, onLoad: (v: any) => void, config?: any) => void;
    __express: (path: string, options: any, callback: (err: any, val: any) => void) => void;
}
declare var result: NineplateType;
export declare function load(name: string, req: any, onLoad: (v: any) => void, config?: any): void;
export default result;
export declare var domProcessor: typeof _domProcessor;
export declare var textProcessor: typeof _textProcessor;
export declare class Template extends Properties {
    text: string;
    compiledDomVersion: (v: any) => any;
    compiledTextVersion: (v: any) => any;
    toAmd(sync: boolean, options?: any): any;
    toCommonJs(): any;
    compileDomSync(options?: any): (val: any) => any;
    compileDom(sync: boolean, options?: any): any;
    renderDom(context: any): any;
    compileTextSync(): any;
    compileText(sync: boolean): any;
    renderText(context: any): any;
}
