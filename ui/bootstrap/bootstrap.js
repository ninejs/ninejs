/// <amd-dependency path="../../css!./less/bootstrap.css" />
/// <amd-dependency path="../../css!./vresponsive.css" />
/// <amd-dependency path="../../css!./vresponsive-device.css" />
/// <amd-dependency path="../../css!../css/common.css" />
/// <amd-dependency path="../../css!./gridMax.css" />
(function (deps, factory) {
    if (typeof module === 'object' && typeof module.exports === 'object') {
        var v = factory(require, exports); if (v !== undefined) module.exports = v;
    }
    else if (typeof define === 'function' && define.amd) {
        define(deps, factory);
    }
})(["require", "exports", "../../css!./less/bootstrap.css", "../../css!./vresponsive.css", "../../css!./vresponsive-device.css", "../../css!../css/common.css", "../../css!./gridMax.css"], function (require, exports) {
    var bootstrapCss = require('../../css!./less/bootstrap.css'), verticalResponsiveCss = require('../../css!./vresponsive.css'), verticalResponsiveDeviceCss = require('../../css!./vresponsive-device.css'), commonCss = require('../../css!../css/common.css'), gridMaxCss = require('../../css!./gridMax.css');
    var BootstrapProto = (function () {
        function BootstrapProto() {
            this.map = {
                css: 'enableCss',
                commonCss: 'enableCommonCss',
                vresponsive: 'enableVResponsiveDevice',
                vresponsiveViewPort: 'enableVResponsiveViewPort',
                gridMax: 'enableGridMax'
            };
            var cnt;
            for (cnt = 0; cnt < arguments.length; cnt += 1) {
                this.enable(arguments[cnt]);
            }
        }
        BootstrapProto.prototype.enable = function () {
            var args = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                args[_i - 0] = arguments[_i];
            }
            var map = this.map, self = this;
            if (!args.length) {
                for (var p in map) {
                    if (map.hasOwnProperty(p)) {
                        self[map[p]].call(this, true);
                    }
                }
            }
            else {
                var cnt;
                for (cnt = 0; cnt < args.length; cnt += 1) {
                    if (self[map[arguments[cnt]]]) {
                        self[map[arguments[cnt]]].call(this, true);
                    }
                }
            }
        };
        BootstrapProto.prototype.disable = function () {
            var args = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                args[_i - 0] = arguments[_i];
            }
            var map = this.map, self = this;
            if (!args.length) {
                for (var p in map) {
                    if (map.hasOwnProperty(p)) {
                        self[map[p]].call(this);
                    }
                }
            }
            else {
                var cnt;
                for (cnt = 0; cnt < arguments.length; cnt += 1) {
                    if (self[map[arguments[cnt]]]) {
                        self[map[arguments[cnt]]].call(this);
                    }
                }
            }
        };
        BootstrapProto.prototype.enableCss = function (val) {
            if (!this.bootstrapCss) {
                if (val) {
                    this.bootstrapCss = bootstrapCss.enable();
                }
            }
            else {
                if (val) {
                    this.bootstrapCss.enable();
                }
                else {
                    this.bootstrapCss.disable();
                }
            }
        };
        BootstrapProto.prototype.enableCommonCss = function (val) {
            if (!this.commonCss) {
                if (val) {
                    this.commonCss = commonCss.enable();
                }
            }
            else {
                if (val) {
                    this.commonCss.enable();
                }
                else {
                    this.commonCss.disable();
                }
            }
        };
        BootstrapProto.prototype.enableVResponsiveDevice = function (val) {
            if (!this.verticalResponsiveDeviceCss) {
                if (val) {
                    this.verticalResponsiveDeviceCss = verticalResponsiveDeviceCss.enable();
                }
            }
            else {
                if (val) {
                    this.verticalResponsiveDeviceCss.enable();
                }
                else {
                    this.verticalResponsiveDeviceCss.disable();
                }
            }
        };
        BootstrapProto.prototype.enableVResponsiveViewPort = function (val) {
            if (!this.verticalResponsiveCss) {
                if (val) {
                    this.verticalResponsiveCss = verticalResponsiveCss.enable();
                }
            }
            else {
                if (val) {
                    this.verticalResponsiveCss.enable();
                }
                else {
                    this.verticalResponsiveCss.disable();
                }
            }
        };
        BootstrapProto.prototype.enableGridMax = function (val) {
            if (!this.gridMaxCss) {
                if (val) {
                    this.gridMaxCss = gridMaxCss.enable();
                }
            }
            else {
                if (val) {
                    this.gridMaxCss.enable();
                }
                else {
                    this.gridMaxCss.disable();
                }
            }
        };
        return BootstrapProto;
    })();
    exports.BootstrapProto = BootstrapProto;
    var bootstrap = new BootstrapProto();
    bootstrap.enable('commonCss');
    bootstrap.enable('gridMax');
    exports.default = bootstrap;
});
//# sourceMappingURL=bootstrap.js.map