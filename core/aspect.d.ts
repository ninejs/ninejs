export interface AdviserType {
    advice: (target: any, args: any) => any;
    next?: AdviserType;
    previous?: AdviserType;
    receiveArguments?: any;
    id?: number;
}
export interface SignalType {
    remove: () => void;
    advice: (target: any, ...args: any[]) => any;
    previous?: AdviserType;
    next?: AdviserType;
    [name: string]: any;
}
export interface DispatcherType {
    (...args: any[]): any;
    [name: string]: AdviserType;
    around?: AdviserType;
    before?: AdviserType;
    after?: AdviserType;
    target?: any;
}
export declare var after: (target: any, methodName: string, advice: (...args: any[]) => any, receiveArguments: any) => any;
export declare var before: (target: any, methodName: string, advice: (...args: any[]) => any, receiveArguments: any) => any;
export declare var around: (target: any, methodName: string, advice: (...args: any[]) => any, receiveArguments: any) => any;
