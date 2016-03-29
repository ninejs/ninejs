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
        define(["require", "exports", '../NineplateResource', 'path'], factory);
    }
})(function (require, exports) {
    'use strict';
    var NineplateResource_1 = require('../NineplateResource');
    var path = require('path');
    var SinglePageContainer = (function (_super) {
        __extends(SinglePageContainer, _super);
        function SinglePageContainer(arg) {
            _super.call(this, arg);
            this.on('result', function (evt) {
                this.applyETag(evt.response, evt.data);
            });
            this.context = {
                html: {
                    lang: 'en',
                    manifest: 'manifest.appcache',
                    head: {
                        meta: {
                            charset: 'utf-8'
                        }
                    },
                    body: {}
                }
            };
        }
        SinglePageContainer.prototype.handler = function (req, res) {
            this.context.jsBase = this.server.baseUrl + this.server.jsUrl;
            this.context.baseUrl = this.server.baseUrl;
            this.context.html.manifest = this.server.baseUrl + '/manifest.appcache';
            this.path = path.resolve(__dirname, 'SinglePageContainer.9plate');
            _super.prototype.handler.call(this, req, res);
        };
        return SinglePageContainer;
    }(NineplateResource_1.default));
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = SinglePageContainer;
});
//# sourceMappingURL=SinglePageContainer.js.map