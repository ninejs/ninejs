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
        define(["require", "exports", "../Module"], factory);
    }
})(function (require, exports) {
    'use strict';
    Object.defineProperty(exports, "__esModule", { value: true });
    var Module_1 = require("../Module");
    var Container = (function () {
        function Container() {
            this.containerList = {};
            this.setContainer = function (name, obj) {
                this.containerList[name] = obj;
            };
            this.getContainer = function (name) {
                return this.containerList[name];
            };
        }
        return Container;
    }());
    exports.Container = Container;
    var container = new Container();
    var ContainerModule = (function (_super) {
        __extends(ContainerModule, _super);
        function ContainerModule() {
            var _this = _super.call(this) || this;
            _this.consumes = [
                {
                    id: 'ninejs'
                }
            ];
            _this.provides = [
                {
                    id: 'container'
                }
            ];
            return _this;
        }
        ContainerModule.prototype.getProvides = function (name) {
            if (name === 'container') {
                return container;
            }
            return null;
        };
        return ContainerModule;
    }(Module_1.default));
    var result = new ContainerModule();
    exports.default = result;
});
//# sourceMappingURL=container.js.map