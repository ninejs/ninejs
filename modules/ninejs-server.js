/// <reference path="../typings/node/node.d.ts" />
/// <reference path="../typings/bunyan/bunyan.d.ts" />
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
(function (deps, factory) {
    if (typeof module === 'object' && typeof module.exports === 'object') {
        var v = factory(require, exports); if (v !== undefined) module.exports = v;
    }
    else if (typeof define === 'function' && define.amd) {
        define(deps, factory);
    }
})(["require", "exports", '../core/extend', './Module', 'bunyan'], function (require, exports) {
    var extend_1 = require('../core/extend');
    var Module_1 = require('./Module');
    var bunyan = require('bunyan');
    var njs = require('../lib/ninejs');
    var packageJson = require('../package.json');
    var NineJs = (function (_super) {
        __extends(NineJs, _super);
        function NineJs(args) {
            _super.call(this, args);
            var provide = {
                id: 'ninejs',
                version: packageJson.version,
                features: {}
            };
            extend_1.default.mixin(this, {
                provides: [
                    provide
                ],
                logger: {}
            });
            provide.features['node.js'] = process.version.substr(1);
            if ((typeof (global) !== 'undefined') && (typeof (global.Map) === 'function')) {
                provide.features['harmony'] = true;
            }
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
                    name: 'ninejs',
                    streams: [{
                            level: 'info',
                            type: 'raw',
                            stream: {
                                write: function (data) {
                                    console.log('[' + data.time.toDateString() + ' ' + data.time.toLocaleTimeString() + '] ' + data.msg);
                                }
                            }
                        }]
                });
                (cfg.streams || []).forEach(function (item) {
                    if (item.stream === 'console') {
                        item.type = 'raw';
                        item.stream = {
                            write: function (data) {
                                console.log('[' + data.time.toDateString() + ' ' + data.time.toLocaleTimeString() + '] ' + data.msg);
                            }
                        };
                    }
                });
                return bunyan.createLogger(cfg);
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
    })(Module_1.default);
    var result = new NineJs(undefined);
    exports.default = result;
});
//# sourceMappingURL=ninejs-server.js.map