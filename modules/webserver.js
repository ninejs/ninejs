(function (factory) {
    if (typeof module === 'object' && typeof module.exports === 'object') {
        var v = factory(require, exports); if (v !== undefined) module.exports = v;
    }
    else if (typeof define === 'function' && define.amd) {
        define(["require", "exports", './webserver/ClientUtils', './webserver/Endpoint', './webserver/NineplateResource', './webserver/SinglePage', './webserver/StaticResource', './webserver/WebServer', './webserver/module'], factory);
    }
})(function (require, exports) {
    exports.ClientUtils = require('./webserver/ClientUtils');
    exports.Endpoint = require('./webserver/Endpoint');
    exports.NineplateResource = require('./webserver/NineplateResource');
    exports.SinglePage = require('./webserver/SinglePage');
    exports.StaticResource = require('./webserver/StaticResource');
    exports.WebServer = require('./webserver/WebServer');
    exports.module = require('./webserver/module');
});
//# sourceMappingURL=webserver.js.map