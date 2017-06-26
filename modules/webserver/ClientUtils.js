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
        define(["require", "exports", "../../core/ext/Properties", "fs", "path", "../../core/extend", "../../core/ext/Evented"], factory);
    }
})(function (require, exports) {
    'use strict';
    Object.defineProperty(exports, "__esModule", { value: true });
    var Properties_1 = require("../../core/ext/Properties");
    var fs = require("fs");
    var path = require("path");
    var extend_1 = require("../../core/extend");
    var Evented_1 = require("../../core/ext/Evented");
    var CacheManifest = (function (_super) {
        __extends(CacheManifest, _super);
        function CacheManifest(args) {
            var _this = _super.call(this, args) || this;
            _this.defaultCreationDate = new Date();
            _this.networkResources = [];
            _this.cacheResources = [];
            _this.offlineResources = [];
            _this.config = {};
            return _this;
        }
        CacheManifest.prototype.addToCache = function (collection, url, prefix, filter) {
            var fileStat, baseName, self = this, filter = filter || (function (url) { return true; });
            if (prefix) {
                baseName = path.basename(url);
                fileStat = fs.statSync(url);
                if (fileStat.isDirectory()) {
                    fs.readdirSync(url).forEach(function (item) {
                        var realPath = path.resolve(url, item);
                        self.addToCache(collection, realPath, prefix + '/' + baseName, filter);
                    });
                }
                else if (fileStat.isFile() && filter(url)) {
                    collection.push(this.baseUrl + prefix + '/' + baseName);
                }
            }
            else {
                this.cacheResources.push(url);
            }
        };
        CacheManifest.prototype.cache = function (url, prefix, filter) {
            return this.addToCache(this.cacheResources, url, prefix, filter);
        };
        CacheManifest.prototype.network = function (url, prefix, filter) {
            return this.addToCache(this.networkResources, url, prefix, filter);
        };
        CacheManifest.prototype.handler = function (req, res) {
            var r = [], result;
            r.push('CACHE MANIFEST\n\n\n');
            r.push('# App cache manifest. Date: ' + (this.config.cacheDate || this.defaultCreationDate) + '\n\n');
            r.push('CACHE:\n');
            this.cacheResources.forEach(function (item) {
                r.push(item + '\n');
            });
            r.push('\n\n');
            r.push('FALLBACK:\n');
            this.offlineResources.forEach(function (item) {
                r.push(item + '\n');
            });
            r.push('\n\n');
            r.push('NETWORK:\n');
            this.networkResources.forEach(function (item) {
                r.push(item + '\n');
            });
            r.push('*\n');
            r.push('\n\n');
            result = r.join('');
            if (this.cacheEndpoint) {
                this.cacheEndpoint.applyETag(res, result);
            }
            res.end(result);
        };
        return CacheManifest;
    }(Properties_1.default));
    exports.CacheManifest = CacheManifest;
    var Utils = (function () {
        function Utils() {
            this.amdPaths = {
                'ninejs': path.resolve(__dirname, '../../')
            };
            this.aliases = [];
            this.has = {};
            this.modules = {};
            this.units = {};
            this.boot = [];
            this.postActions = [];
            var requireJsLocation = require.resolve('requirejs');
            if (requireJsLocation) {
                requireJsLocation = path.dirname(requireJsLocation);
                this.amdPaths['requirejs'] = path.resolve(requireJsLocation, '..');
            }
            var reqwestLocation = require.resolve('reqwest');
            if (reqwestLocation) {
                this.amdPaths['reqwest'] = path.dirname(reqwestLocation);
            }
            this.appCache = new CacheManifest(undefined);
        }
        Utils.prototype.on = function (type, listener) {
            return Evented_1.default.on.apply(this, arguments);
        };
        Utils.prototype.emit = function (type, data) {
            return Evented_1.default.emit.apply(this, arguments);
        };
        Utils.prototype.init = function (webServer) {
            this.logger = webServer.get('logger');
            this.webServer = webServer;
            this.appCache.set('baseUrl', webServer.baseUrl);
            var p, paths = this.amdPaths, directory, self = this;
            for (p in paths) {
                if (paths.hasOwnProperty(p)) {
                    directory = new webServer.StaticResource({ path: paths[p], route: webServer.jsUrl + '/' + p });
                    webServer.add(directory);
                }
            }
            this.requireJsConfigEndpoint = new webServer.StaticResource({
                type: 'endpoint',
                contentType: 'application/javascript',
                route: webServer.jsUrl + '/requireJsConfig.js',
                action: function (req, res) {
                    return self.requireJsConfigHandler(req, res);
                }
            });
            webServer.add(this.requireJsConfigEndpoint);
            this.appCache.cache(this.webServer.baseUrl + this.webServer.jsUrl + '/requireJsConfig.js');
            this.cacheEndpoint = new webServer.StaticResource({ type: 'endpoint', contentType: 'text/cache-manifest', route: webServer.baseUrl + '/manifest.appcache', action: function () {
                    self.appCache.handler.apply(self.appCache, arguments);
                }
            });
            this.appCache.cacheEndpoint = this.cacheEndpoint;
            webServer.add(this.cacheEndpoint);
            this.addBoot('ninejs/modules/clientBoot');
        };
        Utils.prototype.addAmdPath = function (prefix, path) {
            this.amdPaths[prefix] = path;
        };
        Utils.prototype.addAmdAlias = function (moduleName, alias) {
            this.aliases.push([moduleName, alias]);
        };
        Utils.prototype.addBoot = function (target) {
            if (this.boot.indexOf(target) < 0) {
                this.boot.push(target);
            }
        };
        Utils.prototype.addModule = function (name, target) {
            this.modules[name] = target;
        };
        Utils.prototype.getUnit = function (name) {
            if (!this.units[name]) {
                this.units[name] = {};
            }
            return this.units[name];
        };
        Utils.prototype.addPostAction = function (action) {
            this.postActions.push(action);
        };
        Utils.prototype.requireJsConfigHandler = function (req, res) {
            var r = ['window.requireJsConfig = '], result, cfg, packages = this.amdPaths, modules = this.modules, units = this.units, p;
            cfg = {
                parseOnLoad: false,
                isDebug: true,
                has: {
                    'dojo-built': 0,
                    'dojo-inject-api': 1,
                    'dojo-sync-loader': 1,
                    'dojo-loader': 1,
                    'dojo-v1x-i18n-Api': 1
                },
                locale: 'en-us',
                selectorEngine: 'css3',
                isAsync: true,
                async: true,
                applicationUrl: this.webServer.baseUrl,
                packages: [],
                ninejs: {
                    modules: {},
                    units: {}
                },
                callback: function () {
                }
            };
            for (p in packages) {
                if (packages.hasOwnProperty(p)) {
                    cfg.packages.push({ name: p, location: this.webServer.jsUrl + '/' + p });
                }
            }
            for (p in modules) {
                if (modules.hasOwnProperty(p)) {
                    cfg.ninejs.modules[p] = modules[p];
                }
            }
            for (p in units) {
                if (units.hasOwnProperty(p)) {
                    cfg.ninejs.units[p] = units[p];
                }
            }
            extend_1.default.mixinRecursive(cfg.has, this.has);
            cfg.map = { '*': {} };
            this.aliases.forEach(function (alias) {
                cfg.map['*'][alias[0]] = alias[1];
            });
            this.emit('config', cfg);
            r.push(JSON.stringify(cfg, null, '  '));
            r.push(';\n');
            var hasReleaseBoot = (this.webServer.config.clientUtils && this.webServer.config.clientUtils.boot && this.webServer.config.clientUtils.boot.length);
            var hasModuleBoot = (this.boot && this.boot.length);
            if (hasReleaseBoot || hasModuleBoot) {
                r.push('window.requireJsConfig.callback = function() {\n');
                if (hasReleaseBoot) {
                    r.push("require(['" + this.webServer.config.clientUtils.boot + "'], function() {\n");
                }
                if (hasModuleBoot) {
                    r.push("require([" + this.boot.map(function (mid) { return "'" + mid + "'"; }).join(',') + "], function() {\n");
                    r.push('});\n');
                }
                if (hasReleaseBoot) {
                    r.push("});\n");
                }
                r.push('};\n');
            }
            r.push('setTimeout(function () { \n  require.config(window.requireJsConfig);\n});');
            this.postActions.forEach(function (item) {
                r.push('(' + item.toString() + ').apply();');
            });
            result = r.join('');
            this.requireJsConfigEndpoint.applyETag(res, result);
            res.end(result);
        };
        return Utils;
    }());
    exports.Utils = Utils;
    exports.default = Utils;
});
//# sourceMappingURL=ClientUtils.js.map