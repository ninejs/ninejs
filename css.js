(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports", "./core/deferredUtils", "./_css/builder", "./request"], factory);
    }
})(function (require, exports) {
    'use strict';
    Object.defineProperty(exports, "__esModule", { value: true });
    var def = require("./core/deferredUtils");
    var builder_1 = require("./_css/builder");
    var request = require("./request");
    var ielt10 = (function () {
        if (window.navigator.appName.indexOf('Internet Explorer') !== -1) {
            return (window.navigator.appVersion.indexOf('MSIE 9') === -1);
        }
        return false;
    })(), isAmd = (typeof (define) !== 'undefined') && define.amd, isDojo = isAmd && define.amd.vendor === 'dojotoolkit.org', ieCssText, ieCssUpdating, externalCssCache = {};
    var normalizeUrls = function (css, self) {
        css = css.replace(/url\s*\(\s*['"]?([^'"\)]*)['"]?\s*\)/g, function ($0, url) {
            var newUrl = '', amdPrefix;
            if (!(/:/.test(url) || /^\/\//.test(url))) {
                var arrSplit = self.path.split(' => ');
                var cnt;
                for (cnt = 0; cnt < arrSplit.length; cnt += 1) {
                    var slashSplit = arrSplit[cnt].split('/');
                    if (cnt === 0) {
                        amdPrefix = slashSplit[0];
                    }
                    slashSplit.pop();
                    if (slashSplit.length && cnt > 0) {
                        newUrl += '/';
                    }
                    newUrl += slashSplit.join('/');
                }
                if (newUrl) {
                    newUrl += '/';
                }
                newUrl += url;
            }
            else {
                newUrl = url;
            }
            if (isDojo && amdPrefix) {
                if (require.packs && require.packs[amdPrefix]) {
                    var amdPackage = require.packs[amdPrefix];
                    var loc = amdPackage.location.split('/');
                    if (loc.length) {
                        loc.pop();
                        loc.push(newUrl);
                        newUrl = loc.join('/');
                    }
                }
            }
            return 'url(\'' + newUrl + '\')';
        });
        return css;
    };
    var StyleObject = (function () {
        function StyleObject() {
            this.children = [];
        }
        StyleObject.prototype.enableOldIE = function (styleNode, result, parent, document) {
            var cnt, accumulated, actual, c, ieNode;
            if (!ieNode) {
                ieNode = styleNode;
            }
            if (this.path.indexOf(' => ') < 0) {
                accumulated = [];
                for (cnt = 0; cnt < this.children.length; cnt += 1) {
                    accumulated.push(this.children[cnt].data);
                }
                ieCssText = ieCssText || '';
                actual = ieCssText;
                ieCssText = actual + '\n' + accumulated.join('\n') + '\n' + this.data;
                if (!ieCssUpdating) {
                    ieCssUpdating = true;
                    setTimeout(function () {
                        c = ieNode.lastChild;
                        while (c) {
                            ieNode.removeChild(c);
                            c = ieNode.lastChild;
                        }
                        ieNode.appendChild(document.createTextNode(ieCssText));
                        ieCssUpdating = false;
                        ieNode = null;
                        ieCssText = null;
                    });
                }
                this.children = [];
                result.children = [];
                if (!ieNode.parentNode) {
                    parent.appendChild(ieNode);
                }
            }
        };
        StyleObject.prototype.enable = function (parent) {
            function isDomElement(o) {
                return (typeof HTMLElement === 'object' ? o instanceof HTMLElement :
                    o && typeof o === 'object' && o.nodeType === 1 && typeof o.nodeName === 'string');
            }
            var isScoped = (isDomElement(parent)), linkNode, result;
            var document;
            if (!parent) {
                document = window.document;
                parent = document.getElementsByTagName('head')[0];
            }
            else {
                document = parent.ownerDocument;
            }
            var cssText = '\n' + this.data + '';
            if ((!this.data) && this.path) {
                if (!externalCssCache[this.path]) {
                    linkNode = document.createElement('link');
                    linkNode.type = 'text/css';
                    linkNode.rel = 'stylesheet';
                    linkNode.href = this.path;
                    externalCssCache[this.path] = linkNode;
                }
                else {
                    linkNode = externalCssCache[this.path];
                }
                result = new StyleInstance();
                result.styleNode = linkNode;
                result.children = [];
                parent.appendChild(linkNode);
                return result;
            }
            var searchStyleNode = window.document.querySelector('style[data-ninejs-path="' + this.path + '"]');
            var styleNode, cnt, found;
            if (searchStyleNode) {
                styleNode = searchStyleNode;
            }
            else {
                styleNode = document.createElement('style');
                styleNode.type = 'text/css';
                styleNode.setAttribute('data-ninejs-path', this.path);
                if (styleNode.styleSheet && (!ielt10)) {
                    styleNode.styleSheet.cssText = this.data = normalizeUrls(cssText, this);
                }
                else {
                    this.data = normalizeUrls(cssText, this);
                    styleNode.appendChild(document.createTextNode(this.data));
                }
                if (isScoped) {
                    styleNode.setAttribute('scoped', 'scoped');
                }
                found = true;
            }
            this.document = document;
            result = new StyleInstance();
            result.styleNode = styleNode;
            function getChildren(self) {
                var r = [];
                if (self.children) {
                    for (cnt = 0; cnt < self.children.length; cnt += 1) {
                        var child = self.children[cnt], childHandle;
                        if (isScoped) {
                            childHandle = StyleObject.prototype.enable.call(child, parent);
                        }
                        else {
                            childHandle = StyleObject.prototype.enable.call(child);
                        }
                        r.push(childHandle);
                    }
                }
                return r;
            }
            result.children = getChildren(this);
            function handleFound(self) {
                if (found) {
                    if (ielt10) {
                        self.enableOldIE(styleNode, result, parent, document);
                    }
                    else {
                        parent.appendChild(styleNode);
                    }
                }
            }
            handleFound(this);
            return result;
        };
        StyleObject.prototype.disable = function () {
            return this.enable().disable();
        };
        return StyleObject;
    }());
    exports.StyleObject = StyleObject;
    var StyleInstance = (function () {
        function StyleInstance() {
        }
        StyleInstance.prototype.enable = function () {
            if (this.styleNode) {
                this.styleNode.media = 'screen';
            }
            return this;
        };
        StyleInstance.prototype.disable = function () {
            this.styleNode.media = 'screen and (max-width:0px)';
            return this;
        };
        return StyleInstance;
    }());
    exports.StyleInstance = StyleInstance;
    function style(processResult) {
        var r = new StyleObject(), cnt;
        for (var n in processResult) {
            if (processResult.hasOwnProperty(n)) {
                r[n] = processResult[n];
            }
        }
        if (r.children) {
            for (cnt = 0; cnt < r.children.length; cnt += 1) {
                r.children[cnt] = style(r.children[cnt]);
            }
        }
        return r;
    }
    exports.style = style;
    function loadStyle(data, path, prefixes, baseUrl, autoEnable, load) {
        function processCallback(processResult) {
            var r = style(processResult);
            if (autoEnable) {
                r.handle = r.enable();
            }
            load(r);
        }
        if (!data) {
            var t = new StyleObject();
            t.path = path;
            processCallback(t);
        }
        else {
            builder_1.processCss(data, path, path, prefixes, baseUrl, {}, processCallback);
        }
    }
    function loadFromString(css, uniqueId) {
        var packages;
        if (isDojo) {
            packages = dojoConfig.packages;
        }
        else {
            packages = requirejs.s.contexts._.config.packages;
        }
        var defer = def.defer();
        loadStyle(css, uniqueId, packages, '', true, function (styleObj) {
            defer.resolve(styleObj);
        });
        return defer.promise;
    }
    exports.loadFromString = loadFromString;
    function load(id, require, load) {
        var parts = id.split('!');
        var fname = parts[0];
        var autoEnable = false;
        if (parts[1] && parts[1] === 'enable') {
            autoEnable = true;
        }
        var isDojo = (define.amd && define.amd.vendor === 'dojotoolkit.org');
        var name;
        if (require.cache) {
            if (require.cache[(parts[0] + '.ncss')]) {
                name = (parts[0] + '.ncss');
            }
            else {
                name = parts[0];
            }
        }
        if (isDojo && require.cache[name]) {
            require([name], function (styleModule) {
                if (autoEnable) {
                    styleModule.enable();
                }
                load(styleModule);
            });
        }
        else {
            if ((fname.indexOf('http:') === 0) || (fname.indexOf('https:') === 0)) {
                loadStyle(null, fname, require.rawConfig.packages, '', autoEnable, load);
            }
            else {
                var extIdx = fname.lastIndexOf('.');
                if (extIdx < 0) {
                    fname = fname + '.css';
                }
                var path = require.toUrl(parts[0]);
                if (isDojo) {
                    require.getText(path, false, function (data) {
                        loadStyle(data, path, require.rawConfig.packages, require.rawConfig.baseUrl, autoEnable, load);
                    });
                }
                else {
                    request.get(path, { type: 'html' }).then(function (data) {
                        if ((typeof (window) !== 'undefined') && (data instanceof XMLHttpRequest)) {
                            data = data.responseText;
                        }
                        var packages;
                        if (isDojo) {
                            packages = dojoConfig.packages;
                        }
                        else {
                            packages = requirejs.s.contexts._.config.packages;
                        }
                        loadStyle(data, path, packages, '', autoEnable, load);
                    });
                }
            }
        }
    }
    exports.load = load;
});
//# sourceMappingURL=css.js.map