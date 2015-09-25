///<amd-dependency path="../client/bluebird" />
import { PromiseManagerType, PromiseConstructorType } from './deferredUtils'
declare var require: any;
var bluebird: PromiseManagerType = require('../client/bluebird');
var defer = bluebird.defer;
export { defer }
export default bluebird;
