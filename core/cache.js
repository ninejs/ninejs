(function (deps, factory) {
    if (typeof module === 'object' && typeof module.exports === 'object') {
        var v = factory(require, exports); if (v !== undefined) module.exports = v;
    }
    else if (typeof define === 'function' && define.amd) {
        define(deps, factory);
    }
})(["require", "exports", '../request'], function (require, exports) {
    /// <reference path="../typings/tsd.d.ts" />
    var request = require('../request');
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
            // summary:
            //		A getter and setter for storing the string content associated with the
            //		module and url arguments.
            // description:
            //		If module is a string that contains slashes, then it is interpretted as a fully
            //		resolved path (typically a result returned by require.toUrl), and url should not be
            //		provided. This is the preferred signature. If module is a string that does not
            //		contain slashes, then url must also be provided and module and url are used to
            //		call `dojo.moduleUrl()` to generate a module URL. This signature is deprecated.
            //		If value is specified, the cache value for the moduleUrl will be set to
            //		that value. Otherwise, dojo.cache will fetch the moduleUrl and store it
            //		in its internal cache and return that cached value for the URL. To clear
            //		a cache value pass null for value. Since XMLHttpRequest (XHR) is used to fetch the
            //		the URL contents, only modules on the same domain of the page can use this capability.
            //		The build system can inline the cache values though, to allow for xdomain hosting.
            // module: String||Object
            //		If a String with slashes, a fully resolved path; if a String without slashes, the
            //		module name to use for the base part of the URL, similar to module argument
            //		to `dojo.moduleUrl`. If an Object, something that has a .toString() method that
            //		generates a valid path for the cache item. For example, a dojo._Url object.
            // url: String
            //		The rest of the path to append to the path derived from the module argument. If
            //		module is an object, then this second argument should be the 'value' argument instead.
            // value: String||Object?
            //		If a String, the value to use in the cache for the module/url combination.
            //		If an Object, it can have two properties: value and sanitize. The value property
            //		should be the value to use in the cache, and sanitize can be set to true or false,
            //		to indicate if XML declarations should be removed from the value and if the HTML
            //		inside a body tag in the value should be extracted as the real value. The value argument
            //		or the value property on the value argument are usually only used by the build system
            //		as it inlines cache content.
            // example:
            //		To ask dojo.cache to fetch content and store it in the cache (the dojo['cache'] style
            //		of call is used to avoid an issue with the build system erroneously trying to intern
            //		this example. To get the build system to intern your dojo.cache calls, use the
            //		'dojo.cache' style of call):
            //		| //If template.html contains '<h1>Hello</h1>' that will be
            //		| //the value for the text variable.
            //		| var text = dojo['cache']('my.module', 'template.html');
            // example:
            //		To ask dojo.cache to fetch content and store it in the cache, and sanitize the input
            //		 (the dojo['cache'] style of call is used to avoid an issue with the build system
            //		erroneously trying to intern this example. To get the build system to intern your
            //		dojo.cache calls, use the 'dojo.cache' style of call):
            //		| //If template.html contains '<html><body><h1>Hello</h1></body></html>', the
            //		| //text variable will contain just '<h1>Hello</h1>'.
            //		| var text = dojo['cache']('my.module', 'template.html', {sanitize: true});
            // example:
            //		Same example as previous, but demonstrates how an object can be passed in as
            //		the first argument, then the value argument can then be the second argument.
            //		| //If template.html contains '<html><body><h1>Hello</h1></body></html>', the
            //		| //text variable will contain just '<h1>Hello</h1>'.
            //		| var text = dojo['cache'](new dojo._Url('my/module/template.html'), {sanitize: true});
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
    exports.default = cache;
});
//# sourceMappingURL=cache.js.map