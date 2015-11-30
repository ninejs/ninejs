(function (factory) {
    if (typeof module === 'object' && typeof module.exports === 'object') {
        var v = factory(require, exports); if (v !== undefined) module.exports = v;
    }
    else if (typeof define === 'function' && define.amd) {
        define(["require", "exports", './webserver/ClientUtils', './webserver/Endpoint', './webserver/module', './webserver/NineplateResource', './webserver/SinglePage', './webserver/StaticResource', './webserver/WebServer'], factory);
    }
})(function (require, exports) {
    exports.ClientUtils = require('./webserver/ClientUtils');
    exports.Endpoint = require('./webserver/Endpoint');
    exports.module = require('./webserver/module');
    exports.NineplateResource = require('./webserver/NineplateResource');
    exports.SinglePage = require('./webserver/SinglePage');
    exports.StaticResource = require('./webserver/StaticResource');
    exports.WebServer = require('./webserver/WebServer');
});
//# sourceMappingURL=webserver.js.map