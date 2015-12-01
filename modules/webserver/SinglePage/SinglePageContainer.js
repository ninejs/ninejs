(function (factory) {
    if (typeof module === 'object' && typeof module.exports === 'object') {
        var v = factory(require, exports); if (v !== undefined) module.exports = v;
    }
    else if (typeof define === 'function' && define.amd) {
        define(["require", "exports", '../NineplateResource', 'path'], factory);
    }
})(function (require, exports) {
    var NineplateResource_1 = require('../NineplateResource');
    var path = require('path');
    class SinglePageContainer extends NineplateResource_1.default {
        constructor(arg) {
            super(arg);
            this.on('result', function (evt) {
                this.applyETag(evt.response, evt.data);
            });
        }
        handler(req, res) {
            this.context.jsBase = this.server.baseUrl + this.server.jsUrl;
            this.context.baseUrl = this.server.baseUrl;
            this.context.html.manifest = this.server.baseUrl + '/manifest.appcache';
            this.path = path.resolve(__dirname, 'SinglePageContainer.9plate');
            super.handler(req, res);
        }
    }
    exports.SinglePageContainer = SinglePageContainer;
    SinglePageContainer.prototype.context = {
        html: {
            lang: 'en',
            manifest: 'manifest.appcache',
            head: {
                meta: {
                    charset: 'utf-8'
                }
            },
            body: {
                callbackScript: function () {
                    if (this.boot) {
                        return 'require.s.contexts._.config.callback = function() { require([\'' + this.boot + '\'], function() {  }); };';
                    }
                    else {
                        return '';
                    }
                }
            }
        }
    };
});
//# sourceMappingURL=SinglePageContainer.js.map