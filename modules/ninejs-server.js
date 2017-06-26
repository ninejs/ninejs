var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports", "../core/extend", "./Module", "winston"], factory);
    }
})(function (require, exports) {
    'use strict';
    Object.defineProperty(exports, "__esModule", { value: true });
    var extend_1 = require("../core/extend");
    var Module_1 = require("./Module");
    var winston = require("winston");
    var njs = require('../lib/ninejs');
    var packageJson = require('../package.json');
    var NineJs = (function (_super) {
        __extends(NineJs, _super);
        function NineJs(args) {
            var _this = _super.call(this, args) || this;
            var provide = {
                id: 'ninejs',
                version: packageJson.version,
                features: {}
            };
            extend_1.default.mixin(_this, {
                provides: [
                    provide
                ],
                logger: {}
            });
            provide.features['node.js'] = process.version.substr(1);
            if ((typeof (global) !== 'undefined') && (typeof (global.Map) === 'function')) {
                provide.features['harmony'] = true;
            }
            return _this;
        }
        NineJs.prototype.configGetter = function () {
            var r = null;
            if (this.config) {
                r = this.config['ninejs'];
            }
            return r;
        };
        NineJs.prototype.loggerGetter = function (name) {
            function createLogger(config) {
                var loggingConfig = (config || {}).logging || [];
                var cnt;
                if (Object.prototype.toString.call(loggingConfig) !== '[object Array]') {
                    loggingConfig = [loggingConfig];
                }
                var cfg;
                for (cnt = 0; cnt < loggingConfig.length; cnt += 1) {
                    if (loggingConfig[cnt].name === name) {
                        cfg = loggingConfig[cnt];
                    }
                }
                cfg = cfg || (loggingConfig[0] || {
                    transports: [
                        new (winston.transports.Console)(),
                    ]
                });
                var transports = winston.transports;
                cfg.transports = (cfg.transports || []).map(function (item) {
                    if (transports[item.type]) {
                        return new (transports[item.type])(item);
                    }
                    return item;
                });
                return new (winston.Logger)(cfg);
            }
            name = name || 'default';
            if (!this.logger[name]) {
                this.logger[name] = createLogger(this.config);
            }
            return this.logger[name];
        };
        NineJs.prototype.init = function (name, config) {
            if (name === 'ninejs') {
                this.config = config;
                var log = this.get('logger');
                njs.on('log', function (data) {
                    log.info(data.message);
                });
            }
        };
        return NineJs;
    }(Module_1.default));
    exports.NineJs = NineJs;
    var result = new NineJs(undefined);
    exports.default = result;
});
//# sourceMappingURL=ninejs-server.js.map