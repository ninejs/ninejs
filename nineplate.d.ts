import Properties from './core/ext/Properties';
import * as _domProcessor from './_nineplate/domProcessor';
import * as _textProcessor from './_nineplate/textProcessor';
export interface ResultFunction {
    (context: any, doc?: HTMLDocument): any;
    amdDependencies?: string[];
}
declare var result: any;
export declare function load(name: string, req: any, onLoad: (v: any) => void, config?: any): any;
export default result;
export declare var domProcessor: typeof _domProcessor;
export declare var textProcessor: typeof _textProcessor;
export declare class Template extends Properties {
    text: string;
    compiledDomVersion: (v: any) => any;
    compiledTextVersion: (v: any) => any;
    toAmd(sync: boolean): any;
    toCommonJs(): any;
    compileDomSync(): (val: any) => any;
    compileDom(sync: boolean): any;
    renderDom(context: any): any;
    compileTextSync(): any;
    compileText(sync: boolean): any;
    renderText(context: any): any;
}
