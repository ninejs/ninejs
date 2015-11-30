(function (factory) {
    if (typeof module === 'object' && typeof module.exports === 'object') {
        var v = factory(require, exports); if (v !== undefined) module.exports = v;
    }
    else if (typeof define === 'function' && define.amd) {
        define(["require", "exports", './modules/client', './modules/clientBoot', './modules/config', './modules/empty', './modules/Module', './modules/moduleDefine', './modules/moduleRegistry', './modules/ninejs-client', './modules/ninejs-server', './modules/serverBoot', './modules/webserver'], factory);
    }
})(function (require, exports) {
    exports.client = require('./modules/client');
    exports.clientBoot = require('./modules/clientBoot');
    exports.config = require('./modules/config');
    exports.empty = require('./modules/empty');
    exports.Module = require('./modules/Module');
    exports.moduleDefine = require('./modules/moduleDefine');
    exports.moduleRegistry = require('./modules/moduleRegistry');
    exports.ninejsClient = require('./modules/ninejs-client');
    exports.ninejsServer = require('./modules/ninejs-server');
    exports.serverBoot = require('./modules/serverBoot');
    exports.webserver = require('./modules/webserver');
});
//# sourceMappingURL=modules.js.map