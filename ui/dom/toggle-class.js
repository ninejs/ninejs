(function (factory) {
    if (typeof module === 'object' && typeof module.exports === 'object') {
        var v = factory(require, exports); if (v !== undefined) module.exports = v;
    }
    else if (typeof define === 'function' && define.amd) {
        define(["require", "exports", '../../core/on', '../utils/setClass', '../../core/objUtils'], factory);
    }
})(function (require, exports) {
    'use strict';
    var on_1 = require('../../core/on');
    var setClass_1 = require('../utils/setClass');
    var objUtils_1 = require('../../core/objUtils');
    function default_1(node, context, value, options) {
        var classes = (value || '').split(/,| /).filter(function (s) {
            return !!s;
        });
        var target = options.target || '';
        var targetNodes;
        if (!target) {
            targetNodes = [function () { return node; }];
        }
        else {
            targetNodes = target.split(/,/).filter(function (s) {
                return !!s;
            }).map(function (t) {
                if (t[0] === '#') {
                    return function () {
                        return Array.prototype.slice.call(window.document.getElementById(t.substr(1)), 0);
                    };
                }
                else if ((t.indexOf('.') >= 0) || (t.indexOf(' ') >= 0)) {
                    return function () {
                        return Array.prototype.slice.call(context.domNode.querySelectorAll(t), 0);
                    };
                }
                else {
                    if (objUtils_1.isArray(context[t])) {
                        return function () {
                            return context[t];
                        };
                    }
                    else {
                        return function () {
                            return [context[t]];
                        };
                    }
                }
            });
        }
        var setClasses = function (t) {
            classes.forEach(function (c) {
                setClass_1.default(t, '~' + c);
            });
        };
        (options.event || 'click').split(',').map(function (eventName) {
            return on_1.default(node, eventName, function (e) {
                targetNodes.reduce(function (previous, f) {
                    var t = f(), cnt, len;
                    if (objUtils_1.isArray(t)) {
                        var arr = t;
                        len = arr.length;
                        for (cnt = 0; cnt < len; cnt += 1) {
                            previous.push(arr[cnt]);
                        }
                    }
                    else {
                        previous.push(t);
                    }
                    return previous;
                }, []).forEach(setClasses);
                e.stopPropagation();
            });
        }).forEach(function (handler) {
            if (context.own) {
                context.own(handler);
            }
        });
    }
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = default_1;
    ;
});
//# sourceMappingURL=toggle-class.js.map