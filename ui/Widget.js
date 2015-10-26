var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
(function (factory) {
    if (typeof module === 'object' && typeof module.exports === 'object') {
        var v = factory(require, exports); if (v !== undefined) module.exports = v;
    }
    else if (typeof define === 'function' && define.amd) {
        define(["require", "exports", '../core/extend', '../core/ext/Properties', '../core/on', '../core/deferredUtils', './utils/setClass', './utils/append', '../core/objUtils'], factory);
    }
})(function (require, exports) {
    var extend_1 = require('../core/extend');
    var Properties_1 = require('../core/ext/Properties');
    var on_1 = require('../core/on');
    var deferredUtils_1 = require('../core/deferredUtils');
    var setClass_1 = require('./utils/setClass');
    var append_1 = require('./utils/append');
    var objUtils_1 = require('../core/objUtils');
    var widgetSpecialEvents = {
        'updatedSkin': true,
        'updatingSkin': true,
        'removing': true,
        'show': true
    };
    window.setTimeout(function () {
        on_1.default(window.document.body, 'click', function () {
            on_1.default.emit(window.document.body, '9jsclosewidgets', { target: null });
        });
    }, 0);
    function createWaitNode(parent, self) {
        if (!self.waiting) {
            self.waiting = true;
            setClass_1.default(parent, 'njsWaiting');
            return setClass_1.default(append_1.default(parent, 'div'), 'njsWaitNode');
        }
    }
    function destroyWaitNode(parent, node, self) {
        if (self.waiting) {
            setClass_1.default(parent, '!njsWaiting');
            delete self.waiting;
        }
        if (node) {
            parent.removeChild(node);
        }
    }
    var collectReduce = function (previous, current) {
        var data = previous.data, t = current(data), arr = previous.array;
        if (typeof (t) !== 'undefined') {
            if (objUtils_1.isArray(t)) {
                t.forEach(function (item) {
                    arr.push(item);
                });
            }
            else {
                arr.push(t);
            }
        }
        return previous;
    };
    var Widget = (function (_super) {
        __extends(Widget, _super);
        function Widget(args) {
            _super.call(this, args);
            this.skin = this.skin || [];
            this.skinContract = this.skinContract || {};
            this.$njsEventListeners = {};
            this.$njsEventListenerHandlers = [];
            this.$njsCollect = {};
            this.$njsChildWidgets = [];
            this.$njsShowDefer = deferredUtils_1.defer();
            if (!this.domNode) {
                this.domNode = this.$njsShowDefer.promise;
            }
            else {
                this.$njsShowDefer.resolve(this.domNode);
                this.$njsShowDefer = null;
            }
        }
        Widget.extend = function () {
            var args = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                args[_i - 0] = arguments[_i];
            }
            args.unshift(this);
            return extend_1.default.apply(null, args);
        };
        Widget.prototype.destroy = function () {
            var cnt, len = this.$njsChildWidgets.length;
            for (cnt = 0; cnt < len; cnt += 1) {
                this.$njsChildWidgets[cnt].destroy();
            }
            len = this.$njsEventListenerHandlers.length;
            this.remove();
            for (cnt = 0; cnt < len; cnt += 1) {
                this.$njsEventListenerHandlers[cnt].remove();
            }
        };
        Widget.prototype.registerChildWidget = function (w) {
            this.$njsChildWidgets.push(w);
        };
        Widget.prototype.remove = function () {
            var domNode = this.domNode;
            if (objUtils_1.isHTMLElement(domNode)) {
                this.emit('removing', {});
                domNode.parentNode.removeChild(domNode);
                return true;
            }
            return false;
        };
        Widget.prototype.skinSetter = function (value) {
            if (typeof (value) === 'string') {
                return this.loadSkin(value);
            }
            var self = this;
            this.skin = value;
            return deferredUtils_1.when(value, function (sk) {
                var skinContract = self.skinContract, p, item;
                if (skinContract) {
                    for (p in skinContract) {
                        if (skinContract.hasOwnProperty(p)) {
                            item = skinContract[p];
                            if (item.type === 'function') {
                                if (typeof (sk[p]) !== 'function') {
                                    throw new Error('incompatible skins. This skin must have a ' + p + ' function defined');
                                }
                            }
                            else if (item.type === 'property') {
                                if ((typeof (sk[p]) === 'undefined') || (typeof (sk[p]) === 'function')) {
                                    throw new Error('incompatible skins. This skin must have a ' + p + ' property defined');
                                }
                            }
                        }
                    }
                }
                self.skin = sk;
                return sk;
            }, function (err) {
                throw new Error(err);
            });
        };
        Widget.prototype.classSetter = function (v) {
            var arg = v.split(' ');
            return deferredUtils_1.when(this.domNode, function (domNode) {
                arg.unshift(domNode);
                return setClass_1.default.apply(null, arg);
            });
        };
        Widget.prototype.idSetter = function (v) {
            return deferredUtils_1.when(this.domNode, function (domNode) {
                domNode.id = v;
                return domNode;
            });
        };
        Widget.prototype.styleSetter = function (v) {
            return deferredUtils_1.when(this.domNode, function (domNode) {
                domNode.setAttribute('style', v);
                return domNode;
            });
        };
        Widget.prototype.updateSkin = function () {
            var self = this;
            function doUpdateSkin(sk) {
                var cnt, itemSkin, currentSkin = self.currentSkin, skinList = [], toApply;
                if ((typeof (sk) === 'object') && !extend_1.default.isArray(sk)) {
                    skinList.push(sk);
                    if (sk.applies()) {
                        toApply = sk;
                    }
                }
                else if (sk && sk.length) {
                    for (cnt = 0; cnt < sk.length; cnt += 1) {
                        itemSkin = sk[cnt];
                        if (!toApply && itemSkin.applies()) {
                            toApply = itemSkin;
                        }
                        skinList.push(itemSkin);
                    }
                }
                if (toApply !== currentSkin) {
                    if (currentSkin) {
                        self.emit('updatingSkin', {});
                        for (cnt = 0; cnt < skinList.length; cnt += 1) {
                            itemSkin = skinList[cnt];
                            itemSkin.disable();
                        }
                    }
                    self.currentSkin = toApply;
                    try {
                        return deferredUtils_1.when(toApply.enable(self), function () {
                            if (self.$njsShowDefer) {
                                self.$njsShowDefer.resolve(self.domNode);
                                self.$njsShowDefer = null;
                            }
                            try {
                                return self.onUpdatedSkin();
                            }
                            catch (err) {
                                console.error(err);
                            }
                        }, function (err) {
                            console.error(err);
                        });
                    }
                    catch (err) {
                        console.error(err);
                        throw err;
                    }
                }
            }
            if (deferredUtils_1.isPromise(this.skin)) {
                return deferredUtils_1.when(this.skin, doUpdateSkin, console.error);
            }
            else {
                return doUpdateSkin(this.skin);
            }
        };
        Widget.prototype.onUpdatedSkin = function () {
            var self = this;
            this.currentSkin.updated(this);
            setTimeout(function () {
                self.emit('updatedSkin', {});
            }, 10);
        };
        Widget.prototype.forceUpdateSkin = function () {
            if (this.currentSkin) {
                this.currentSkin.disable();
            }
            this.currentSkin = null;
            this.updateSkin();
        };
        Widget.prototype.loadSkin = function (name) {
            var _defer = deferredUtils_1.defer();
            this.set('skin', _defer.promise);
            require([name], function (skin) {
                _defer.resolve(skin);
            });
            return _defer.promise;
        };
        Widget.prototype.own = function () {
            var args = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                args[_i - 0] = arguments[_i];
            }
            var cnt, len = args.length;
            for (cnt = 0; cnt < len; cnt += 1) {
                this.$njsEventListenerHandlers.push(args[cnt]);
            }
        };
        Widget.prototype.show = function (parentNode) {
            var listeners, current, cnt, parent, self = this;
            function appendIt(domNode) {
                if (typeof (parentNode) === 'string') {
                    parent = window.document.getElementById(parentNode);
                }
                else if (objUtils_1.isHTMLElement(parentNode)) {
                    parent = parentNode;
                }
                if (parent) {
                    parent.appendChild(domNode);
                }
                return deferredUtils_1.defer(domNode).promise;
            }
            if (this.waitSkin) {
                if (parentNode) {
                    return deferredUtils_1.when(this.waitSkin, function () {
                        self.waitSkin = null;
                        return self.show(parentNode);
                    });
                }
                return this.waitSkin;
            }
            if (!this.currentSkin) {
                var domNode = this.domNode;
                if (objUtils_1.isHTMLElement(domNode)) {
                    appendIt(domNode);
                }
                for (cnt = 0; cnt < self.$njsEventListenerHandlers.length; cnt += 1) {
                    self.$njsEventListenerHandlers[cnt].remove();
                }
                self.$njsEventListenerHandlers = [];
                this.waitSkin = deferredUtils_1.when(this.updateSkin(), function () {
                    if (self.domNode) {
                        listeners = self.$njsEventListeners;
                        for (var p in listeners) {
                            if (listeners.hasOwnProperty(p)) {
                                current = listeners[p];
                                for (cnt = 0; cnt < current.length; cnt += 1) {
                                    self.$njsEventListenerHandlers.push(on_1.default(self.domNode, p, current[cnt].action));
                                }
                            }
                        }
                    }
                    var domNode = self.domNode;
                    if (objUtils_1.isHTMLElement(domNode)) {
                        var result = appendIt(self.domNode);
                        self.waitSkin = null;
                        return result;
                    }
                    else {
                        throw new Error('Invalid domNode');
                    }
                }, console.error);
                return this.waitSkin;
            }
            else {
                return appendIt(this.domNode);
            }
        };
        Widget.prototype.on = function (type, action, persistEvent) {
            var r;
            if (!this.$njsEventListeners[type]) {
                this.$njsEventListeners[type] = [];
            }
            r = new on_1.EventHandler(this, this.$njsEventListeners[type], function (e) {
                action.apply(this.owner, arguments);
                if (this.owner.domNode && e.bubbles && (!e.cancelled)) {
                    on_1.default.emit(this.owner.domNode, type, e);
                }
            });
            if (persistEvent || widgetSpecialEvents[type]) {
                this.$njsEventListenerHandlers.push(r);
            }
            else {
                this.own(r);
            }
            return r;
        };
        Widget.prototype.emit = function (type, data) {
            var method = 'on' + type;
            if (!this[method]) {
                this[method] = function (e) {
                    var cnt, arr = this.$njsEventListeners[type] || [], len = arr.length;
                    for (cnt = 0; cnt < len; cnt += 1) {
                        arr[cnt].action.call(arr[cnt], e);
                    }
                };
            }
            this[method].call(this, data);
        };
        Widget.prototype.subscribe = function (type, action) {
            if (!this.$njsCollect[type]) {
                this.$njsCollect[type] = [];
            }
            this.$njsCollect[type].push(action);
        };
        Widget.prototype.collect = function (type, data) {
            return (this.$njsCollect[type] || []).reduce(collectReduce, { array: [], data: data }).array;
        };
        Widget.prototype.wait = function (_defer) {
            var d, self = this;
            if (_defer) {
                if (typeof (_defer.then) === 'function') {
                    if (this.domNode) {
                        return deferredUtils_1.when(this.domNode, function () {
                            var w = (self.waitNode || self.domNode), waitNode = createWaitNode(w, self);
                            return deferredUtils_1.when(_defer, function () {
                                destroyWaitNode(w, waitNode, self);
                            }, function () {
                                destroyWaitNode(w, waitNode, self);
                            });
                        });
                    }
                    else {
                        return deferredUtils_1.when(this.show(), function () {
                            var w = (self.waitNode || self.domNode);
                            var waitNode = createWaitNode(w, self);
                            return deferredUtils_1.when(_defer, function () {
                                destroyWaitNode(w, waitNode, self);
                            }, function () {
                                destroyWaitNode(w, waitNode, self);
                            });
                        }, function (err) {
                            throw err;
                        });
                    }
                }
            }
            d = deferredUtils_1.defer();
            d.resolve(true);
            return d.promise;
        };
        return Widget;
    })(Properties_1.default);
    Widget.prototype.$njsWidget = true;
    Widget.prototype.waiting = false;
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = Widget;
});
//# sourceMappingURL=Widget.js.map