(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports", "../request"], factory);
    }
})(function (require, exports) {
    'use strict';
    var request = require("../request");
    var isAmd = (typeof (define) !== 'undefined') && define.amd;
    var isDojo = isAmd && (define.amd.vendor === 'dojotoolkit.org');
    var isNode = (typeof (window) === 'undefined');
    var req = require;
    var theCache = {};
    var strip = function (text) {
        if (text) {
            text = text.replace(/^\s*<\?xml(\s)+version=[\'\'](\d)*.(\d)*[\'\'](\s)*\?>/im, '');
            var matches = text.match(/<body[^>]*>\s*([\s\S]+)\s*<\/body>/im);
            if (matches) {
                text = matches[1];
            }
        }
        else {
            text = '';
        }
        return text;
    };
    var getText;
    if (!isNode) {
        getText = function (url, sync, load) {
            var requestType = 'html';
            if (url.indexOf('.json') === url.length - ('.json').length) {
                requestType = 'json';
            }
            request.get({ url: url, type: requestType }).then(load);
        };
    }
    else {
        if (req.getText) {
            getText = req.getText;
        }
        else {
            getText = function (url, sync, load) {
                if ((url.indexOf('http:') === 0) || (url.indexOf('https:') === 0)) {
                    request.get({
                        url: url,
                        sync: !!sync,
                        type: 'html'
                    }).then(load);
                }
                else {
                    if (isAmd) {
                        var fsModule = 'fs';
                        if (isDojo) {
                            fsModule = 'dojo/node!fs';
                        }
                        req([fsModule], function (fs) {
                            fs.readFile(url, { encoding: 'utf-8' }, function (err, content) {
                                if (!err) {
                                    load(content);
                                }
                                else {
                                    throw new Error('Error loading ' + url);
                                }
                            });
                        });
                    }
                    else {
                        req('fs').readFile(url, { encoding: 'utf-8' }, function (err, content) {
                            if (!err) {
                                load(content);
                            }
                            else {
                                throw new Error('Error loading ' + url);
                            }
                        });
                    }
                }
            };
        }
    }
    var cache;
    cache = (function () {
        var cache = function (module, url, value) {
            var key;
            if (typeof module === 'string') {
                if (/\//.test(module)) {
                    key = module;
                    value = url;
                }
                else {
                    key = req.toUrl(module.replace(/\./g, '/') + (url ? ('/' + url) : ''));
                }
            }
            else {
                key = module + '';
                value = url;
            }
            var val = (value !== undefined && typeof value !== 'string') ? value.value : value, sanitize = value && value.sanitize;
            if (typeof val === 'string') {
                theCache[key] = val;
                return sanitize ? strip(val) : val;
            }
            else if (val === null) {
                delete theCache[key];
                return null;
            }
            else {
                if (!(key in theCache)) {
                    getText(key, true, function (text) {
                        theCache[key] = text;
                    });
                }
                return sanitize ? strip(theCache[key]) : theCache[key];
            }
        };
        cache.strip = strip;
        cache.data = theCache;
        cache.getText = getText;
        return cache;
    })();
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = cache;
});
//# sourceMappingURL=cache.js.map