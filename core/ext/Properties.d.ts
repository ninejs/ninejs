export interface WatchHandle {
    new (action: (name: string, oldValue: any, newValue: any) => void, watchList: WatchHandle[]): WatchHandle;
    pause: () => void;
    resume: () => void;
    remove: () => void;
    id: number;
    action: (name: string, oldValue: any, newValue: any) => void;
    watchList: WatchHandle[];
}
export interface EventedArray extends Array<any> {
    new (arr: any[]): EventedArray;
}
export default class Properties {
    [name: string]: any;
    get(name: string): any;
    set(name: any, ...values: any[]): any;
    watch(name: string, action: (name: string, oldValue: any, newValue: any) => void): WatchHandle;
    mixinProperties(target: any): this;
    mixinRecursive(target: any): this;
    $njsWatch: {
        [name: string]: {
            action: (name: string, oldValue: any, newValue: any) => void;
            remove: () => void;
        }[];
    };
    $njsConstructors: ((args: any) => void)[];
    constructor(...argslist: any[]);
    static mixin(target: any): (args: any) => void;
}
