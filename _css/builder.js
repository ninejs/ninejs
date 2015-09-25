(function (deps, factory) {
    if (typeof module === 'object' && typeof module.exports === 'object') {
        var v = factory(require, exports); if (v !== undefined) module.exports = v;
    }
    else if (typeof define === 'function' && define.amd) {
        define(deps, factory);
    }
})(["require", "exports", '../request'], function (require, exports) {
    ///<reference path='../typings/node/node.d.ts'/>
    var request = require('../request');
    var req = require;
    function resolveUrl(url, path, prefixes, baseUrl, toBase64) {
        function attachBaseUrl(baseUrl, r) {
            if (baseUrl) {
                if (!/\:/.test(r) && !/^\//.test(r)) {
                    if (/\/$/.test(r)) {
                        r = baseUrl + r;
                    }
                    else {
                        r = baseUrl + '/' + r;
                    }
                }
            }
            return r;
        }
        function tryPrefixes(r, prefixes) {
            for (var cnt = 0; cnt < prefixes.length; cnt += 1) {
                var prefix = prefixes[cnt].name;
                if (r.indexOf(prefix + '/') === 0) {
                    var prefixPath = prefixes[cnt].location;
                    if (/\/$/.test(prefixPath)) {
                        r = prefixPath + r.substr(prefix.length + 1);
                    }
                    else {
                        r = prefixPath + '/' + r.substr(prefix.length + 1);
                    }
                    break;
                }
            }
            return r;
        }
        var r;
        if (/^data:/.test(url)) {
            r = url;
        }
        else {
            var pathSplit = path.split(/\/|\\/), urlSplit = url.split('/');
            pathSplit.pop();
            while (pathSplit.length && urlSplit[0] && (urlSplit[0] === '..')) {
                pathSplit.pop();
                urlSplit.shift();
            }
            while (pathSplit.length && urlSplit[0] && (urlSplit[0] === '.')) {
                urlSplit.shift();
            }
            url = urlSplit.join('/');
            if (/^\//.test(url)) {
                r = url;
            }
            else {
                if (pathSplit.length) {
                    r = pathSplit.join('/') + '/' + urlSplit.join('/');
                }
                else {
                    r = urlSplit.join('/');
                }
                r = tryPrefixes(r, prefixes);
            }
        }
        r = attachBaseUrl(baseUrl, r);
        if (toBase64) {
            var b64String = convertToBase64Url(r, path);
            if (b64String) {
                r = b64String;
            }
        }
        return r;
    }
    var fs, pathModule;
    function convertToBase64Url(url, path) {
        if (/^data:/.test(url)) {
            return url;
        }
        var suffixIdx = url.indexOf('?');
        if (suffixIdx >= 0) {
            url = url.substr(0, suffixIdx);
        }
        if (!fs || !pathModule) {
            fs = req('fs');
            pathModule = req('path');
        }
        var sizeLimit = 30000;
        var mimeTypes = {
            '.gif': 'image/gif',
            '.png': 'image/png',
            '.jpg': 'image/jpeg',
            '.jpeg': 'image/jpeg',
            '.svg': 'image/svg+xml',
            '.woff': 'application/x-font-woff',
            '.ttf': 'font/opentype'
        };
        var extension = pathModule.extname(url);
        if (mimeTypes[extension]) {
            if (fs.existsSync(url)) {
                var buf = fs.readFileSync(url);
                if (buf.length < sizeLimit) {
                    return 'data:' + mimeTypes[extension] + ';base64,' + buf.toString('base64');
                }
                else {
                    console.log('ninejs/css did not embed resource ' + url + ' due to it surpassing the size limit ' + sizeLimit + ' in ' + path);
                }
            }
            else {
                console.error('ninejs/css did not embed resource ' + url + ' because it was NOT FOUND in ' + path);
            }
        }
        return null;
    }
    function embedUrls(data, path, prefixes, baseUrl, toBase64) {
        var r = data;
        r = r.replace(/(embed)?url\s*\(\s*['"]?([^'"\)]*)['"]?\s*\)/g, function ($0) {
            var matches = [];
            for (var _i = 1; _i < arguments.length; _i++) {
                matches[_i - 1] = arguments[_i];
            }
            var url = matches[0];
            var newUrl = resolveUrl(url, path, prefixes, baseUrl, false);
            if (toBase64) {
                var embedded = convertToBase64Url(newUrl, path);
                if (embedded) {
                    url = embedded;
                }
            }
            else {
                url = newUrl;
            }
            return 'url(\'' + url + '\')';
        });
        return r;
    }
    function processCss(data, path, realPath, prefixes, baseUrl, options, callback) {
        function addImports(data, path, prefixes, baseUrl, toBase64) {
            var children = [];
            data = data.replace(/\@import\s*url\s*\(\s*['"]?([^'"\)]*)['"]?\s*\)/g, function ($0) {
                var matches = [];
                for (var _i = 1; _i < arguments.length; _i++) {
                    matches[_i - 1] = arguments[_i];
                }
                var url = matches[0];
                var realUrl = resolveUrl(url, realPath, prefixes, baseUrl, toBase64);
                function loadHandler(childData) {
                    var childOptions = {};
                    for (var p in options) {
                        if (options.hasOwnProperty(p)) {
                            childOptions[p] = options[p];
                        }
                    }
                    childOptions.parentPath = childOptions.path;
                    processCss(childData, url, realUrl, prefixes, baseUrl, childOptions, function (result) {
                        var child = result;
                        children.push(child);
                    });
                }
                request.get(realUrl, { type: 'html' }).then(loadHandler);
                return '';
            });
            var r = { children: children, css: data };
            return r;
        }
        if (!options) {
            options = {};
        }
        var toBase64 = !!options.toBase64;
        data = embedUrls(data, realPath, prefixes, baseUrl, toBase64);
        path = path.split('\\').join('/');
        options.path = path;
        if (options.parentPath) {
            options.path = options.parentPath + ' => ' + options.path;
        }
        var r = {
            path: options.path
        };
        var importResult = addImports(data, path, prefixes, baseUrl, toBase64);
        r.data = importResult.css;
        r.children = importResult.children;
        var tr = r;
        callback(tr);
    }
    exports.processCss = processCss;
});
//# sourceMappingURL=builder.js.map