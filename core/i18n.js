(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports", "./extend", "./ext/Evented", "./text", "./deferredUtils"], factory);
    }
})(function (require, exports) {
    'use strict';
    var extend_1 = require("./extend");
    var Evented_1 = require("./ext/Evented");
    var amdText = require("./text");
    var deferredUtils_1 = require("./deferredUtils");
    var isAmd = (typeof (define) !== 'undefined' && define.amd), isDojo = isAmd && define.amd.vendor === 'dojotoolkit.org', isNode = (typeof (window) === 'undefined'), req = require;
    function getFile(src, require, load, config) {
        var obj;
        if (isAmd) {
            amdText.load(src, require, load, config);
        }
        else if (isNode) {
            obj = req(src);
            if (load) {
                load(obj);
            }
        }
        else {
            throw new Error('environment not yet supported');
        }
        return obj;
    }
    var I18nResourceSet = extend_1.default(Evented_1.default, {
        loadResource: function (locale, require, load) {
            var shrt, parent = this.loaded.root, result, pathPart = locale;
            if (locale && (locale.length > 2)) {
                shrt = locale.substr(0, 2);
                if (this.available[shrt]) {
                    if (this.loaded[shrt]) {
                        parent = this.loaded[shrt];
                    }
                }
                pathPart = shrt + '/' + locale.substr(3);
            }
            locale = locale || 'root';
            if (locale !== 'root') {
                getFile(this.baseUrl + '/' + pathPart + '/' + this.baseName, require, function (a) {
                    var Constr = (function () {
                        function Constr() {
                        }
                        return Constr;
                    }());
                    ;
                    Constr.prototype = parent;
                    result = new Constr();
                    result.$njsLocale = locale;
                    if (typeof (a) === 'string') {
                        a = JSON.parse(a);
                    }
                    extend_1.default.mixin(result, a);
                    load(result);
                });
            }
            else {
                result = this.loaded.root;
                result.$njsLocale = locale;
                load(result);
            }
            return result;
        },
        setLocale: function (locale, ignoreChangedEvent, req, originalLoad) {
            var require = req || require;
            var self = this;
            var deferred = deferredUtils_1.defer();
            function load(val) {
                if (originalLoad) {
                    deferred.promise.then(originalLoad);
                }
                deferred.resolve(val);
            }
            if (this.locale !== locale) {
                (function (self) {
                    if (!self.loaded.root) {
                        self.loaded.root = self.root;
                    }
                })(this);
                if (this.loaded[locale || 'root']) {
                    this.resource = this.loaded[locale || 'root'];
                    this.locale = locale;
                    if (!ignoreChangedEvent) {
                        self.emit('localeChanged', { locale: self.locale });
                    }
                    load(this.resource);
                }
                else if (this.available[locale]) {
                    this.loadResource(locale, require, function (obj) {
                        self.resource = obj;
                        self.loaded[locale || 'root'] = self.resource;
                        self.locale = locale;
                        if (!ignoreChangedEvent) {
                            self.emit('localeChanged', { locale: self.locale });
                        }
                        load(obj);
                    });
                }
                else if (((locale || '').length > 2) && (this.available[locale.substr(0, 2)])) {
                    this.setLocale(locale.substr(0, 2), ignoreChangedEvent, require).then(function () {
                        self.locale = locale;
                        self.setLocale(locale, ignoreChangedEvent, require).then(function (val) {
                            load(val);
                        });
                    });
                }
                else {
                    this.resource = this.root;
                    load(this.root);
                }
            }
            else {
                load(this.resource);
            }
            return deferred.promise;
        },
        getResource: function () {
            return this.resource;
        }
    }, function () {
        this.loaded = {};
    });
    function getResource(src, require, load, config) {
        var obj, root, available = {}, current, locale;
        require = require || {};
        locale = (config || require.rawConfig || {}).locale || null;
        function rest(obj, load) {
            root = obj.root;
            for (var p in obj) {
                if (obj.hasOwnProperty(p)) {
                    if (p !== 'root') {
                        current = obj[p];
                        if (current) {
                            available[p] = true;
                        }
                    }
                }
            }
            var resourceSet = new I18nResourceSet();
            resourceSet.root = root;
            if (isNode) {
                var path = req('path');
                resourceSet.baseUrl = path.dirname(src);
                resourceSet.baseName = path.basename(src);
            }
            else {
                resourceSet.baseUrl = src.substr(0, src.lastIndexOf('/'));
                resourceSet.baseName = src.substr(src.lastIndexOf('/') + 1);
            }
            resourceSet.available = available;
            resourceSet.setLocale(locale, null, require, function () {
                if (load) {
                    load(resourceSet);
                }
            });
            return resourceSet;
        }
        if (!load) {
            obj = getFile(src, require, load, config);
            return rest(obj);
        }
        else {
            getFile(src, require, function (obj) {
                if (typeof (obj) === 'string') {
                    obj = JSON.parse(obj);
                }
                rest(obj, load);
            }, config);
        }
    }
    exports.getResource = getResource;
    function load(mid, require, load, config) {
        getResource(mid, require, load, config);
    }
    exports.load = load;
});
//# sourceMappingURL=i18n.js.map