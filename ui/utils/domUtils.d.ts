import _setClass from './setClass';
import _setText from './setText';
import _append from './append';
export declare function isHidden(control: any): boolean;
export declare function isShown(control: any): boolean;
export declare function hide(control: any): void;
export declare function show(control: any, showAttr: string): void;
export declare function empty(node: HTMLElement): void;
export declare function enableHovering(control: any, enter: (e: Event) => void, leave: (e: Event) => void, options: {
    pausable: boolean;
}): any;
export declare var setText: typeof _setText;
export declare var setClass: typeof _setClass;
export declare var append: typeof _append;
