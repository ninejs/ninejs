(function (deps, factory) {
    if (typeof module === 'object' && typeof module.exports === 'object') {
        var v = factory(require, exports); if (v !== undefined) module.exports = v;
    }
    else if (typeof define === 'function' && define.amd) {
        define(deps, factory);
    }
})(["require", "exports", './modules/Module', './modules/client', './modules/clientBoot', './modules/config', './modules/empty', './modules/moduleDefine', './modules/moduleRegistry', './modules/ninejs-client', './modules/ninejs-server', './modules/serverBoot', './modules/webserver'], function (require, exports) {
    exports.Module = require('./modules/Module');
    exports.client = require('./modules/client');
    exports.clientBoot = require('./modules/clientBoot');
    exports.config = require('./modules/config');
    exports.empty = require('./modules/empty');
    exports.moduleDefine = require('./modules/moduleDefine');
    exports.moduleRegistry = require('./modules/moduleRegistry');
    exports.ninejsClient = require('./modules/ninejs-client');
    exports.ninejsServer = require('./modules/ninejs-server');
    exports.serverBoot = require('./modules/serverBoot');
    exports.webserver = require('./modules/webserver');
});
//# sourceMappingURL=modules.js.map