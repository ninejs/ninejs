import { PromiseManagerType, PromiseConstructorType } from './deferredUtils';
declare var bluebird: PromiseManagerType;
declare var defer: (v?: any) => PromiseConstructorType;
export { defer };
export default bluebird;
