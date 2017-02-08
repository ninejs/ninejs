(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports"], factory);
    }
})(function (require, exports) {
    'use strict';
    var fs;
    function load(name, req, onLoad) {
        if (!fs) {
            fs = require('fs');
        }
        if (req.toUrl) {
            name = req.toUrl(name);
        }
        fs.readFile(name, 'utf8', function (error, data) {
            if (error) {
                throw new Error(error);
            }
            else {
                onLoad(data);
            }
        });
    }
    exports.load = load;
});
//# sourceMappingURL=text.js.map