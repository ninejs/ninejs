export interface DecoratorFunction {
    (fn: Function): any;
    $$ninejsType: string;
    method: Function;
}
export interface Extendable {
    (fn: Function): any;
    extend: (...rest: any[]) => any;
}
export interface Extend {
    <T>(...rest: any[]): {
        new (...rest: any[]): T;
    };
    registerDecorator: (name: string, dec: (original: Function, current: Function) => any) => void;
    after: Function;
    before: Function;
    around: Function;
    isArray: (obj: any) => boolean;
    mixin: (obj: any, target: any) => any;
    mixinRecursive: (obj: any, target: any) => any;
    postConstruct: (construct: Function) => any;
    decorators: {
        [decoratorName: string]: {
            (fn: Function): any;
            $$ninejsType: string;
            method: Function;
        };
    };
}
declare function isArray(obj: any): boolean;
declare function mixin(obj: any, target: any): any;
declare function mixinRecursive(obj: any, target: any): void;
declare var extend: Extend;
declare var after: Function, before: Function, around: Function;
export { after, before, around, isArray, mixin, mixinRecursive };
export default extend;
