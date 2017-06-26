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
    Object.defineProperty(exports, "__esModule", { value: true });
    var nextId = 0;
    function advise(dispatcher, type, advice, receiveArguments) {
        var previous = dispatcher[type];
        var around = (type === 'around');
        var signal;
        if (around) {
            var advised = advice(function () {
                return previous.advice(this, arguments);
            });
            signal = {
                remove: function () {
                    if (advised) {
                        advised = dispatcher = advice = null;
                    }
                },
                advice: function (target, args) {
                    return advised ? advised.apply(target, args) :
                        previous.advice(target, args);
                }
            };
        }
        else {
            signal = {
                remove: function () {
                    if (signal.advice) {
                        var previous = signal.previous;
                        var next = signal.next;
                        if (!next && !previous) {
                            delete dispatcher[type];
                        }
                        else {
                            if (previous) {
                                previous.next = next;
                            }
                            else {
                                dispatcher[type] = next;
                            }
                            if (next) {
                                next.previous = previous;
                            }
                        }
                        dispatcher = advice = signal.advice = null;
                    }
                },
                id: nextId,
                advice: advice,
                receiveArguments: receiveArguments
            };
            nextId += 1;
        }
        if (previous && !around) {
            if (type === 'after') {
                while (previous.next) {
                    previous = previous.next;
                }
                previous.next = signal;
                signal.previous = previous;
            }
            else if (type === 'before') {
                dispatcher[type] = signal;
                signal.next = previous;
                previous.previous = signal;
            }
        }
        else {
            dispatcher[type] = signal;
        }
        return signal;
    }
    function aspect(type) {
        return function (target, methodName, advice, receiveArguments) {
            var existing = target[methodName], dispatcher, results;
            if (!existing || existing.target !== target) {
                target[methodName] = dispatcher = function () {
                    var args = [];
                    for (var _i = 0; _i < arguments.length; _i++) {
                        args[_i] = arguments[_i];
                    }
                    var executionId = nextId;
                    var before = dispatcher.before;
                    while (before) {
                        args = before.advice.apply(this, args) || args;
                        before = before.next;
                    }
                    if (dispatcher.around) {
                        results = dispatcher.around.advice(this, args);
                    }
                    var after = dispatcher.after;
                    while (after && after.id < executionId) {
                        if (after.receiveArguments) {
                            var newResults = after.advice.apply(this, args);
                            results = newResults === undefined ? results : newResults;
                        }
                        else {
                            results = after.advice.call(this, results, args);
                        }
                        after = after.next;
                    }
                    return results;
                };
                if (existing) {
                    dispatcher.around = {
                        advice: function (target, args) {
                            return existing.apply(target, args);
                        }
                    };
                }
                dispatcher.target = target;
            }
            var results = advise((dispatcher || existing), type, advice, receiveArguments);
            advice = null;
            return results;
        };
    }
    exports.after = aspect('after');
    exports.before = aspect('before');
    exports.around = aspect('around');
});
//# sourceMappingURL=aspect.js.map