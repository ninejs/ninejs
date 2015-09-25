export interface ArrayLike {
    length: number;
    [name: string]: any;
}
declare var map: (arr: any, callback: (src: any, idx?: number, arr?: ArrayLike) => any) => any[];
declare var forEach: (arr: any, callback: (src: any, idx?: number, arr?: ArrayLike) => void) => void;
declare var indexOf: (arr: any, obj: any) => number;
declare var filter: (arr: any, callback: (src: any) => boolean, self?: any) => any[];
export { map, forEach, indexOf, filter };
