(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports", "./Endpoint", "../../core/deferredUtils"], factory);
    }
})(function (require, exports) {
    'use strict';
    Object.defineProperty(exports, "__esModule", { value: true });
    var Endpoint_1 = require("./Endpoint");
    var deferredUtils_1 = require("../../core/deferredUtils");
    var ResponseType;
    (function (ResponseType) {
        ResponseType[ResponseType["JSON"] = 0] = "JSON";
        ResponseType[ResponseType["RAW"] = 1] = "RAW";
    })(ResponseType = exports.ResponseType || (exports.ResponseType = {}));
    function any(method, description, action) {
        var endpoint = new Endpoint_1.default({
            children: [],
            route: description.route,
            method: method,
            handleAs: description.handleAs || 'json',
            handler: function (req, res) {
                deferredUtils_1.when(description.inputMap(req), function (inputArgs) {
                    try {
                        action(inputArgs, req, res).then(function (output) {
                            if (description.contentType) {
                                res.header('Content-Type', description.contentType);
                            }
                            if (description.responseType === ResponseType.RAW) {
                                res.send(output);
                            }
                            else {
                                if (!description.contentType) {
                                    res.header('Content-Type', 'application/json');
                                }
                                res.json(output);
                            }
                        }, function (err) {
                            res.status(400).send(err.message);
                        });
                    }
                    catch (err) {
                        res.status(400).send(err.message);
                    }
                }, function (err) {
                    res.status(400).send(err.message);
                });
            }
        });
        return endpoint;
    }
    ;
    function get(description, action) {
        return any('get', description, action);
    }
    exports.get = get;
    ;
    function post(description, action) {
        return any('post', description, action);
    }
    exports.post = post;
    ;
    function put(description, action) {
        return any('put', description, action);
    }
    exports.put = put;
    ;
    function head(description, action) {
        return any('head', description, action);
    }
    exports.head = head;
    ;
    function del(description, action) {
        return any('delete', description, action);
    }
    exports.del = del;
    ;
});
//# sourceMappingURL=Rest.js.map