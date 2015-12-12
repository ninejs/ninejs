(function (factory) {
    if (typeof module === 'object' && typeof module.exports === 'object') {
        var v = factory(require, exports); if (v !== undefined) module.exports = v;
    }
    else if (typeof define === 'function' && define.amd) {
        define(["require", "exports", './cache'], factory);
    }
})(function (require, exports) {
    'use strict';
    var cache_1 = require('./cache');
    var getText = cache_1.default.getText;
    var notFound = {}, pending = {};
    exports.dynamic = true;
    function normalize(id, toAbsMid) {
        var parts = id.split('!'), url = parts[0];
        return (/^\./.test(url) ? toAbsMid(url) : url) + (parts[1] ? '!' + parts[1] : '');
    }
    exports.normalize = normalize;
    function load(id, require, load, config) {
        var parts = id.split('!'), stripFlag = parts.length > 1, absMid = parts[0], url = require.toUrl(parts[0]), requireCacheUrl = 'url:' + url, text = notFound, finish = function (text) {
            load(stripFlag ? cache_1.default.strip(text) : text);
        };
        if (absMid in cache_1.default.data) {
            text = cache_1.default.data[absMid];
        }
        else if (require.cache && requireCacheUrl in require.cache) {
            text = require.cache[requireCacheUrl];
        }
        else if (url in cache_1.default.data) {
            text = cache_1.default.data[url];
        }
        if (text === notFound) {
            if (pending[url]) {
                pending[url].push(finish);
            }
            else {
                var pendingList = pending[url] = [finish];
                getText(url, !require.async, function (text) {
                    cache_1.default.data[absMid] = cache_1.default.data[url] = text;
                    for (var i = 0; i < pendingList.length;) {
                        pendingList[i](text);
                        i += 1;
                    }
                    delete pending[url];
                });
            }
        }
        else {
            finish(text);
        }
    }
    exports.load = load;
});
//# sourceMappingURL=text.js.map