export interface ModernizerType {
    (tst: string): any;
    addTest: (feature: any, test?: any) => ModernizerType;
    add: (feature: string, test: any) => ModernizerType;
    prefixed: (prop: any, obj?: any, elem?: any) => any;
    load: () => void;
    testStyles: (rule: any, callback: any, nodes?: any, testnames?: any) => any;
    testAllProps: (prop: any, prefixed?: any, elem?: any) => any;
    _prefixes: string[];
    mq: (mq: any) => boolean;
    [name: string]: any;
}
declare const _default: ModernizerType;
export default _default;
