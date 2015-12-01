(function (factory) {
    if (typeof module === 'object' && typeof module.exports === 'object') {
        var v = factory(require, exports); if (v !== undefined) module.exports = v;
    }
    else if (typeof define === 'function' && define.amd) {
        define(["require", "exports", '../../core/ext/Properties', 'fs', 'path', '../../core/extend'], factory);
    }
})(function (require, exports) {
    var Properties_1 = require('../../core/ext/Properties');
    var fs = require('fs');
    var path = require('path');
    var extend_1 = require('../../core/extend');
    class CacheManifest extends Properties_1.default {
        constructor(args) {
            super(args);
            this.defaultCreationDate = new Date();
            this.networkResources = [];
            this.cacheResources = [];
            this.offlineResources = [];
            this.config = {};
        }
        addToCache(collection, url, prefix, filter) {
            var fileStat, baseName, self = this, filter = filter || ((url) => { return true; });
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
        }
        cache(url, prefix, filter) {
            return this.addToCache(this.cacheResources, url, prefix, filter);
        }
        network(url, prefix, filter) {
            return this.addToCache(this.networkResources, url, prefix, filter);
        }
        handler(req, res) {
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
        }
    }
    exports.CacheManifest = CacheManifest;
    class Utils {
        constructor() {
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
        init(webServer) {
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
            this.requireJsConfigEndpoint = new webServer.StaticResource({ type: 'endpoint', contentType: 'application/javascript', route: webServer.jsUrl + '/requireJsConfig.js', action: function () {
                    self.requireJsConfigHandler.apply(self, arguments);
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
        }
        addAmdPath(prefix, path) {
            this.amdPaths[prefix] = path;
        }
        addAmdAlias(moduleName, alias) {
            this.aliases.push([moduleName, alias]);
        }
        addBoot(target) {
            if (this.boot.indexOf(target) < 0) {
                this.boot.push(target);
            }
        }
        addModule(name, target) {
            this.modules[name] = target;
        }
        getUnit(name) {
            if (!this.units[name]) {
                this.units[name] = {};
            }
            return this.units[name];
        }
        addPostAction(action) {
            this.postActions.push(action);
        }
        requireJsConfigHandler(req, res) {
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
                deps: this.boot,
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
            cfg.aliases = this.aliases;
            r.push(JSON.stringify(cfg));
            r.push(';');
            r.push('require.config(window.requireJsConfig);');
            this.postActions.forEach(function (item) {
                r.push('(' + item.toString() + ').apply();');
            });
            result = r.join('');
            this.requireJsConfigEndpoint.applyETag(res, result);
            res.end(result);
        }
    }
    exports.Utils = Utils;
    exports.default = Utils;
});
//# sourceMappingURL=ClientUtils.js.map