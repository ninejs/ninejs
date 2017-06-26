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
        define(["require", "exports", "./core/text", "./core/extend", "./core/ext/Properties", "./core/deferredUtils", "./_nineplate/domProcessor", "./_nineplate/textProcessor", "./_nineplate/utils/node/text"], factory);
    }
})(function (require, exports) {
    'use strict';
    Object.defineProperty(exports, "__esModule", { value: true });
    var extend_1 = require("./core/extend");
    var Properties_1 = require("./core/ext/Properties");
    var deferredUtils_1 = require("./core/deferredUtils");
    var domProcessor_1 = require("./_nineplate/domProcessor");
    var textProcessor_1 = require("./_nineplate/textProcessor");
    require("./_nineplate/utils/node/text");
    var requireText, req = require;
    var isNode = typeof (window) === 'undefined', isAmd = (typeof (define) !== 'undefined') && (define.amd), isDojo = isAmd && define.amd.vendor === 'dojotoolkit.org';
    if ((typeof (window) === 'undefined') && (!isDojo)) {
        requireText = req('./_nineplate/utils/node/text');
    }
    else {
        requireText = require('./core/text');
    }
    var Nineplate = extend_1.default({
        buildTemplate: function (val) {
            var template = new Template({});
            template.set('text', val);
            return template;
        },
        getTemplate: function (path, callback) {
            var self = this;
            requireText.load(path, require, function (val) {
                callback(self.buildTemplate(val));
            });
        },
        load: function (name, req, onLoad, config) {
            if (isDojo && require.cache[name]) {
                require([name], function (templateModule) {
                    onLoad(templateModule);
                });
            }
            else {
                var loadText = function (val) {
                    onLoad(new Nineplate().buildTemplate(val));
                };
                requireText.load(name, req, loadText, config);
            }
        }
    });
    var result = new Nineplate();
    if (isNode) {
        var cache = {};
        result.__express = function (path, options, callback) {
            var self = result;
            if (typeof (options) === 'function') {
                callback = options;
                options = undefined;
            }
            options = options || {};
            if (cache[path]) {
                return callback(null, cache[path](options));
            }
            else {
                self.getTemplate(path, function (template) {
                    template.compileText(false).then(function (fnTemplate) {
                        cache[path] = fnTemplate;
                        return callback(null, fnTemplate(options));
                    });
                });
            }
        };
    }
    function load(name, req, onLoad, config) {
        return result.load(name, req, onLoad, config);
    }
    exports.load = load;
    exports.default = result;
    var Template = (function (_super) {
        __extends(Template, _super);
        function Template() {
            var _this = _super !== null && _super.apply(this, arguments) || this;
            _this.text = '';
            return _this;
        }
        Template.prototype.toAmd = function (sync, options) {
            if (options === void 0) { options = {}; }
            var prefix = options.ninejsPrefix || 'ninejs';
            var preText = "(function (factory) {\n\t\t\t\t\tif (typeof module === 'object' && typeof module.exports === 'object') { \n\n\t\t\t\t\t\tvar v = factory(require, exports); if (v !== undefined) module.exports = v; \n\n\t\t\t\t\t} \n\n\t\t\t\t\telse if (typeof define === 'function' && define.amd) { \n\n\t\t\t\t\t\tdefine(['require', 'module'", prePostText = "], factory); \n\n\t\t\t\t\t} \n\n\t\t\t\t})(function (require, module) {\n/* jshint -W074 */\n/* globals window: true */\n'use strict';\nvar r = ", postText = ';\nmodule.exports = r;	});\n';
            if (isNode && !sync) {
                return deferredUtils_1.when(this.compileDom(false, options), function (fn) {
                    var depsText = (fn.amdDependencies || []).map(function (item) {
                        return '\'' + item + '\'';
                    }).join(',');
                    return preText + (depsText ? ', ' : '') + depsText + prePostText + fn.toString() + postText;
                }, function (err) {
                    throw err;
                });
            }
            var fn = this.compileDom(sync, options);
            var depsText = (fn.amdDependencies || []).map(function (item) {
                return '\'' + item + '\'';
            }).join(',');
            return preText + depsText + prePostText + fn + postText;
        };
        Template.prototype.toCommonJs = function () {
            var preText = '/* jshint -W074 */\n/* globals window: true */\n\'use strict\';\nmodule.exports =', postText = ';';
            if (isNode) {
                if (isDojo) {
                    return preText + this.compileText(false) + postText;
                }
                else {
                    return deferredUtils_1.when(this.compileText(false), function (value) {
                        return preText + value + postText;
                    });
                }
            }
            return preText + this.compileText(false) + postText;
        };
        Template.prototype.compileDomSync = function (options) {
            if (this.compiledDomVersion) {
                return this.compiledDomVersion;
            }
            var result = domProcessor_1.compileDom(this.text, true, options || { ignoreHtmlOptimization: true });
            this.compiledDomVersion = result;
            return result;
        };
        Template.prototype.compileDom = function (sync, options) {
            if (sync) {
                return this.compileDomSync(options);
            }
            else {
                var result = this.compiledDomVersion, self = this;
                if (!result) {
                    result = deferredUtils_1.when(domProcessor_1.compileDom(this.text, sync, options || { ignoreHtmlOptimization: true }), function (val) {
                        self.compiledDomVersion = val;
                        return val;
                    }, function (err) {
                        throw err;
                    });
                }
                return result;
            }
        };
        Template.prototype.renderDom = function (context) {
            var compiled = this.compileDom(true);
            return compiled(context);
        };
        Template.prototype.compileTextSync = function () {
            if (this.compiledTextVersion) {
                return this.compiledTextVersion;
            }
            else {
                return textProcessor_1.compileText(this.text, true);
            }
        };
        Template.prototype.compileText = function (sync) {
            if (sync) {
                return this.compileTextSync();
            }
            else {
                var result = this.compiledTextVersion, self = this;
                if (!result) {
                    result = textProcessor_1.compileText(this.text, sync);
                    if (sync) {
                        this.compiledTextVersion = result;
                    }
                    else {
                        result = deferredUtils_1.when(result, function (val) {
                            self.compiledTextVersion = val;
                            return val;
                        });
                    }
                }
                return result;
            }
        };
        Template.prototype.renderText = function (context) {
            var compiled = this.compileText(true);
            return compiled(context);
        };
        return Template;
    }(Properties_1.default));
    exports.Template = Template;
});
//# sourceMappingURL=nineplate.js.map