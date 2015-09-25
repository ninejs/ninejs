import { Extend } from './_common';
declare function isArray(obj: any): boolean;
declare function mixin(obj: any, target: any): void;
declare function mixinRecursive(obj: any, target: any): void;
declare var extend: Extend;
declare var after: Function, before: Function, around: Function;
export { after, before, around, isArray, mixin, mixinRecursive };
export default extend;
