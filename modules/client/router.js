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
        define(["require", "exports", '../Module', '../../client/router', '../../client/hash', '../config'], factory);
    }
})(function (require, exports) {
    'use strict';
    var Module_1 = require('../Module');
    var router = require('../../client/router');
    var hash_1 = require('../../client/hash');
    var config_1 = require('../config');
    var HashRouter = (function (_super) {
        __extends(HashRouter, _super);
        function HashRouter() {
            _super.call(this);
            this.consumes = [
                {
                    id: 'ninejs'
                }
            ];
            this.provides = [
                {
                    id: 'router'
                }
            ];
        }
        HashRouter.prototype.getProvides = function (name) {
            if (name === 'router') {
                return router;
            }
        };
        HashRouter.prototype.init = function (name, config) {
            _super.prototype.init.call(this, name, config);
            var p, action;
            if (name === 'router') {
                for (p in config) {
                    if (config.hasOwnProperty(p)) {
                        if (typeof (config[p]) === 'string') {
                            action = require(config[p]);
                            router.register(p, action);
                        }
                    }
                }
            }
        };
        return HashRouter;
    })(Module_1.default);
    var result = new HashRouter();
    result.on('modulesEnabled', function () {
        router.startup();
        var start;
        start = hash_1.default() || config_1.default.boot;
        setTimeout(function () {
            if (start) {
                if (typeof (start) === 'function') {
                    start();
                }
                else if (typeof (start) === 'string') {
                    router.go(start, true);
                }
            }
            else {
                router.go('/', true);
            }
        });
    });
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = result;
});
//# sourceMappingURL=router.js.map