(function (dependencies, factory) {
    if (typeof module === 'object' && typeof module.exports === 'object') {
        var v = factory(require, exports); if (v !== undefined) module.exports = v;
    }
    else if (typeof define === 'function' && define.amd) {
        define(dependencies, factory);
    }
})(["require", "exports"], function (require, exports) {
    'use strict';
    var decoratorList = {};
    function isArray(obj) {
        return Object.prototype.toString.call(obj) === '[object Array]';
    }
    exports.isArray = isArray;
    function mixin(obj, target) {
        for (var p in target) {
            if (target.hasOwnProperty(p)) {
                obj[p] = target[p];
            }
        }
    }
    exports.mixin = mixin;
    function mixinAll(obj, target) {
        for (var p in target) {
            obj[p] = target[p];
        }
    }
    function mixinRecursive(obj, target) {
        for (var p in target) {
            if (target.hasOwnProperty(p)) {
                if (!isArray(obj[p]) && (!isArray(target[p])) && (typeof (obj[p]) === 'object') && (typeof (target[p]) === 'object')) {
                    mixinRecursive(obj[p], target[p]);
                }
                else {
                    obj[p] = target[p];
                }
            }
        }
    }
    exports.mixinRecursive = mixinRecursive;
    function registerDecorator(decoratorName, decoratorFn) {
        extend.decorators[decoratorName] = (function () {
            var dec = function () {
                var decorator = decoratorFn.apply(this, arguments);
                decorator.$$ninejsType = decoratorName;
                decorator.method = arguments[0];
                return decorator;
            };
            dec.$$ninejsType = decoratorName;
            decoratorList[decoratorName] = dec;
            return dec;
        })();
    }
    function injectMethod(targetType, currentMethod, name) {
        var toInjectMethod = currentMethod;
        if (currentMethod.$$ninejsType && decoratorList[currentMethod.$$ninejsType]) {
            var existingMethod = targetType.prototype[name];
            var resultFunction = decoratorList[currentMethod.$$ninejsType].call(targetType, existingMethod, currentMethod.method);
            toInjectMethod = resultFunction;
        }
        targetType.prototype[name] = toInjectMethod;
    }
    var extend = (function () {
        var extend = function () {
            var idx = 0, SuperClass, njsType, typeArgs = [];
            var fillArguments = function (args) {
                while (args[idx]) {
                    typeArgs.push(args[idx]);
                    idx += 1;
                }
            };
            fillArguments.call(this, arguments);
            njsType = (function () {
                var njsType = function () {
                    var idx = 0, current, currentFn;
                    if (!this.$njsConstructors) {
                        this.$njsConstructors = [];
                    }
                    while (typeArgs[idx]) {
                        current = typeArgs[idx];
                        if (typeof (current) === 'function') {
                            if (!this.$njsInstanceDepth) {
                                this.$njsInstanceDepth = 1;
                            }
                            else {
                                this.$njsInstanceDepth += 1;
                            }
                            currentFn = current;
                            currentFn.apply(this, arguments);
                            this.$njsInstanceDepth -= 1;
                        }
                        idx += 1;
                    }
                    if (!this.$njsInstanceDepth) {
                        for (idx = 0; idx < this.$njsConstructors.length; idx += 1) {
                            current = this.$njsConstructors[idx];
                            current.apply(this, arguments);
                        }
                        this.$njsInstanceDepth = null;
                        this.$njsConstructors = null;
                        delete this.$njsInstanceDepth;
                        delete this.$njsConstructors;
                    }
                };
                for (idx = 0; idx < typeArgs.length; idx += 1) {
                    var current = typeArgs[idx];
                    if (typeof (current) === 'function') {
                        if (idx === 0) {
                            SuperClass = current;
                            njsType.prototype = Object.create(SuperClass.prototype);
                        }
                        else {
                            mixinAll(njsType.prototype, current.prototype);
                        }
                    }
                    else if (typeof (current) === 'object') {
                        for (var p in current) {
                            if (current.hasOwnProperty(p)) {
                                if (typeof (current[p]) === 'function') {
                                    injectMethod(njsType, current[p], p);
                                }
                                else {
                                    njsType.prototype[p] = current[p];
                                }
                            }
                        }
                    }
                }
                njsType.prototype.constructor = njsType;
                njsType.extend = function () {
                    var args = [njsType], cnt;
                    for (cnt = 0; cnt < arguments.length; cnt += 1) {
                        args.push(arguments[cnt]);
                    }
                    return extend.apply(this, args);
                };
                return njsType;
            })();
            return njsType;
        };
        extend.decorators = {};
        return extend;
    })();
    registerDecorator('after', function (original, currentMethod) {
        return function () {
            original.apply(this, arguments);
            return currentMethod.apply(this, arguments);
        };
    });
    registerDecorator('before', function (original, currentMethod) {
        return function () {
            currentMethod.apply(this, arguments);
            return original.apply(this, arguments);
        };
    });
    registerDecorator('around', function (original, currentMethod) {
        return function () {
            return currentMethod(original).apply(this, arguments);
        };
    });
    extend.after = extend.decorators['after'];
    extend.before = extend.decorators['before'];
    extend.around = extend.decorators['around'];
    extend.registerDecorator = registerDecorator;
    extend.isArray = isArray;
    extend.mixin = mixin;
    extend.mixinRecursive = mixinRecursive;
    extend.postConstruct = function (construct) {
        return function () {
            this.$njsConstructors.push(construct);
        };
    };
    var after = extend.after, before = extend.before, around = extend.around;
    exports.after = after;
    exports.before = before;
    exports.around = around;
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = extend;
});
//# sourceMappingURL=extend.js.map