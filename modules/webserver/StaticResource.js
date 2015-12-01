(function (factory) {
    if (typeof module === 'object' && typeof module.exports === 'object') {
        var v = factory(require, exports); if (v !== undefined) module.exports = v;
    }
    else if (typeof define === 'function' && define.amd) {
        define(["require", "exports", './Endpoint', 'crypto'], factory);
    }
})(function (require, exports) {
    var Endpoint_1 = require('./Endpoint');
    var crypto = require('crypto');
    var parseCacheControl = function (str) {
        var directives = str.split(','), obj = {};
        for (var i = 0, len = directives.length; i < len; i += 1) {
            var parts = directives[i].split('='), key = parts.shift().trim(), val = parseInt(parts.shift(), 10);
            obj[key] = isNaN(val) ? true : val;
        }
        return obj;
    };
    class NonCachedStaticResource extends Endpoint_1.Endpoint {
        constructor(args) {
            super(args);
        }
        handler(req, res) {
            var props = this.props || {}, p;
            res.set('Content-Type', this.contentType);
            for (p in props) {
                if (props.hasOwnProperty(p)) {
                    res.set(p, props[p]);
                }
            }
            if (this.path) {
                res.sendFile(this.path, this.options || {});
            }
            else if (this.content) {
                this.emit('result', { data: this.content, response: res });
                res.end(this.content);
            }
            else if (this.action) {
                this.action.apply(this, arguments);
            }
            else {
                res.status(404);
            }
        }
    }
    exports.NonCachedStaticResource = NonCachedStaticResource;
    NonCachedStaticResource.prototype.type = 'static';
    NonCachedStaticResource.prototype.contentType = 'text/plain; charset=utf-8';
    NonCachedStaticResource.prototype.content = '';
    class StaticResource extends NonCachedStaticResource {
        constructor(args) {
            super(args);
        }
        applyETag(res, content) {
            if (!this.etag) {
                var alg = crypto.createHash('sha256'), digest;
                alg.update(content);
                digest = alg.digest('hex');
                this.etag = content.length + '-' + digest;
            }
            res.set('ETag', this.etag);
        }
        mustRevalidate(req, res) {
            function checkCacheControl(res, cookie, cc) {
                return res.get('set-cookie') || (res.get('content-range')) || cookie || cc['no-cache'] || cc['no-store'] || cc['private'] || cc['must-revalidate'];
            }
            var result = false, cacheControl = res.get('cache-control'), cc = parseCacheControl(cacheControl || ''), etagReq = req.get('If-None-Match');
            if (checkCacheControl(res, req.headers['cookie'], cc)) {
                result = true;
            }
            if (etagReq && (etagReq !== this.etag)) {
                result = true;
            }
            if (!cacheControl) {
                result = true;
            }
            return result;
        }
        handler(req, res) {
            if (req.method === 'GET' || req.method === 'HEAD') {
                if (this.mustRevalidate(req, res)) {
                    if (!this.lastModifiedSince) {
                        this.lastModifiedSince = new Date();
                    }
                    if (!res.get('Last-Modified')) {
                        res.set('Last-Modified', this.lastModifiedSince.toUTCString());
                    }
                    if (this.maxAge) {
                        res.set('Cache-Control', this.cacheType + ', max-age=' + (this.maxAge / 1000));
                        res.set('Expires', new Date(Date.now() + this.maxAge).toUTCString());
                    }
                    return super.handler(req, res);
                }
                else {
                    res.writeHead(304, {});
                    res.end();
                }
            }
            else {
                return super.handler(req, res);
            }
        }
    }
    exports.StaticResource = StaticResource;
    StaticResource.prototype.maxAge = 10 * 86400 * 1000;
    StaticResource.prototype.cacheType = 'public';
    exports.default = StaticResource;
});
//# sourceMappingURL=StaticResource.js.map