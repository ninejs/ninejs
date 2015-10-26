var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
(function (factory) {
    if (typeof module === 'object' && typeof module.exports === 'object') {
        var v = factory(require, exports); if (v !== undefined) module.exports = v;
    }
    else if (typeof define === 'function' && define.amd) {
        define(["require", "exports", '../Module', './WebServer'], factory);
    }
})(function (require, exports) {
    var Module_1 = require('../Module');
    var WebServer_1 = require('./WebServer');
    var packageJson = require('../../package.json');
    var servers = {};
    var Mod = (function (_super) {
        __extends(Mod, _super);
        function Mod(args) {
            _super.call(this, args);
            this.consumes = [
                {
                    id: 'ninejs'
                }
            ];
            this.provides = [
                {
                    id: 'webserver',
                    version: packageJson.version
                }
            ];
        }
        Mod.prototype.getProvides = function (name) {
            var args = [];
            for (var _i = 1; _i < arguments.length; _i++) {
                args[_i - 1] = arguments[_i];
            }
            if (name === 'webserver') {
                var serverName = args[0] || 'default';
                return servers[serverName];
            }
        };
        Mod.prototype.init = function (name, config) {
            _super.prototype.init.call(this, name, config);
            if (name === 'webserver') {
                var p, first;
                for (p in config) {
                    if (config.hasOwnProperty(p)) {
                        var server = new WebServer_1.default({});
                        server.set('logger', this.getUnit('ninejs').get('logger'));
                        server.init(config[p]);
                        servers[p] = server;
                        if (!first) {
                            first = server;
                        }
                    }
                }
                if (!servers['default']) {
                    servers['default'] = first;
                }
                if (!first) {
                    throw new Error('Must configure at least one webserver. See webserver docs');
                }
            }
        };
        return Mod;
    })(Module_1.default);
    var result = new Mod(undefined);
    result.on('modulesEnabled', function () {
        process.nextTick(function () {
            var item, p;
            for (p in servers) {
                if (servers.hasOwnProperty(p)) {
                    item = servers[p];
                    item.postCreate();
                }
            }
        });
    });
    result.on('build', function (data) {
        var promises = data.promises;
        process.nextTick(function () {
            var item, p;
            for (p in servers) {
                if (servers.hasOwnProperty(p)) {
                    item = servers[p];
                    promises.push(item.build());
                }
            }
        });
    });
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = result;
});
//# sourceMappingURL=module.js.map