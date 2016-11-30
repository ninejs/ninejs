(function (dependencies, factory) {
    if (typeof module === 'object' && typeof module.exports === 'object') {
        var v = factory(require, exports); if (v !== undefined) module.exports = v;
    }
    else if (typeof define === 'function' && define.amd) {
        define(dependencies, factory);
    }
})(["require", "exports"], function (require, exports) {
    'use strict';
    function stripFunctionName(fstring) {
        var idx = fstring.indexOf('(');
        if (idx > 9) {
            fstring = fstring.substr(0, 9) + fstring.substr(idx);
        }
        return fstring;
    }
    function resolveArray(obj) {
        var result, idx;
        result = '[';
        for (idx = 0; idx < obj.length; idx += 1) {
            if (idx > 0) {
                result += ',';
            }
            result += deepToString(obj[idx]);
        }
        result += ']';
        return result;
    }
    function deepToString(obj) {
        var result = '', o, idx;
        if ((obj !== null) && (obj !== undefined)) {
            if (obj instanceof Array) {
                result = resolveArray(obj);
            }
            else if (typeof (obj) === 'string') {
                result = '\'' + obj.toString() + '\'';
            }
            else if (typeof (obj) === 'function') {
                result = stripFunctionName(obj.toString());
            }
            else if (obj instanceof Object) {
                result = '{';
                idx = 0;
                for (o in obj) {
                    if (obj.hasOwnProperty(o)) {
                        if (idx > 0) {
                            result += ',';
                        }
                        result += o + ':' + deepToString(obj[o]);
                        idx += 1;
                    }
                }
                result += '}';
            }
            else {
                result = obj.toString();
            }
        }
        else if (obj === null) {
            result = 'null';
        }
        return result;
    }
    exports.deepToString = deepToString;
    function protoClone(obj) {
        var A = (function () {
            function A() {
            }
            return A;
        }());
        A.prototype = obj;
        return new A();
    }
    exports.protoClone = protoClone;
    function isFunction(f) {
        return typeof (f) === 'function';
    }
    exports.isFunction = isFunction;
    function isString(obj) {
        return Object.prototype.toString.call(obj) === '[object String]';
    }
    exports.isString = isString;
    function isArray(obj) {
        return (Object.prototype.toString.call(obj) === '[object Array]');
    }
    exports.isArray = isArray;
    function isArrayLike(value) {
        return value &&
            typeof value === 'object' &&
            typeof value.length === 'number' &&
            ((!value.length) || Object.prototype.hasOwnProperty.call(value, value.length - 1));
    }
    exports.isArrayLike = isArrayLike;
    function isNumber(n) {
        return !isNaN(parseFloat(n)) && isFinite(n);
    }
    exports.isNumber = isNumber;
    function isDate(date) {
        return (date instanceof Date) && (!isNaN(date.valueOf()));
    }
    exports.isDate = isDate;
    function isHTMLElement(v) {
        return v && (v.nodeType === 1);
    }
    exports.isHTMLElement = isHTMLElement;
});
//# sourceMappingURL=objUtils.js.map