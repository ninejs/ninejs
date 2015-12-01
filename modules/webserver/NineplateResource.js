(function (factory) {
    if (typeof module === 'object' && typeof module.exports === 'object') {
        var v = factory(require, exports); if (v !== undefined) module.exports = v;
    }
    else if (typeof define === 'function' && define.amd) {
        define(["require", "exports", './StaticResource'], factory);
    }
})(function (require, exports) {
    var StaticResource_1 = require('./StaticResource');
    class NineplateResource extends StaticResource_1.default {
        constructor(arg) {
            super(arg);
        }
        handler(req, res) {
            var props = this.props || {}, p, self = this;
            res.set('Content-Type', this.contentType);
            for (p in props) {
                if (props.hasOwnProperty(p)) {
                    res.set(p, props[p]);
                }
            }
            this.app.render(this.path, this.context, function (err, html) {
                var result;
                if (err) {
                    res.send(err);
                }
                else {
                    result = (self.doctype ? '<!DOCTYPE ' + self.doctype + '>\n' : '') + html;
                    self.emit('result', { data: result, response: res });
                    res.end(result);
                }
            });
        }
    }
    NineplateResource.prototype.type = 'endpoint';
    NineplateResource.prototype.contentType = 'text/html; charset=utf-8';
    NineplateResource.prototype.doctype = 'html';
    NineplateResource.prototype.context = {};
    exports.default = NineplateResource;
});
//# sourceMappingURL=NineplateResource.js.map