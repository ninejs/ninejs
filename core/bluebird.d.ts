import { PromiseManagerType, PromiseConstructorType } from './deferredUtils';
declare var bluebird: PromiseManagerType;
declare var defer: <T>() => PromiseConstructorType<T>;
export { defer };
export default bluebird;
