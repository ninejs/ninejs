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
    (...rest: any[]): {
        new (...rest: any[]): any;
    };
    registerDecorator: (name: string, dec: (original: Function, current: Function) => any) => void;
    after: Function;
    before: Function;
    around: Function;
    isArray: (obj: any) => boolean;
    mixin: (obj: any, target: any) => void;
    mixinRecursive: (obj: any, target: any) => void;
    postConstruct: (construct: Function) => any;
    decorators: {
        [decoratorName: string]: {
            (fn: Function): any;
            $$ninejsType: string;
            method: Function;
        };
    };
}
