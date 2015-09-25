export interface RemovableType {
    remove: () => any;
}
export declare class EventHandler implements RemovableType {
    owner: any;
    action: (e?: any) => any;
    bubbles: boolean;
    cancelled: boolean;
    stopPropagation: () => void;
    remove: () => any;
    constructor(owner: any, collection: EventHandler[], action: (e?: any) => any);
}
export interface PausableResult extends RemovableType {
    pause: () => void;
    resume: () => void;
}
declare var on: {
    (target: any, type: string, listener: (e: any) => any, dontFix?: boolean): RemovableType;
    pausable: (target: any, type: string, listener: (e: any) => any, dontFix?: boolean) => PausableResult;
    once: (target: any, type: string, listener: (e: any) => any, dontFix?: boolean) => RemovableType;
    parse: (target: any, type: any, listener: (e: any) => any, addListener?: any, dontFix?: boolean, matchesTarget?: any) => RemovableType;
    selector: (selector: string, eventType: string, children?: boolean) => (target: any, listener: (e?: any) => any) => RemovableType;
    emit: (target: any, type: string, event: any) => any;
    _fixEvent: (evt: any, sender: any) => any;
    _preventDefault: () => void;
};
export declare var emit: (target: any, type: string, event: any) => any;
export declare var pausable: (target: any, type: string, listener: (e: any) => any, dontFix?: boolean) => PausableResult;
export declare var once: (target: any, type: string, listener: (e: any) => any, dontFix?: boolean) => RemovableType;
export default on;
