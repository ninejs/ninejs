var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
(function (dependencies, factory) {
    if (typeof module === 'object' && typeof module.exports === 'object') {
        var v = factory(require, exports); if (v !== undefined) module.exports = v;
    }
    else if (typeof define === 'function' && define.amd) {
        define(dependencies, factory);
    }
})(["require", "exports", "./css/common.ncss", "../core/deferredUtils", "./utils/setClass", "./Widget"], function (require, exports, commonCss) {
    'use strict';
    var deferredUtils_1 = require("../core/deferredUtils");
    var setClass_1 = require("./utils/setClass");
    var Widget_1 = require("./Widget");
    commonCss.enable();
    function insertAfter(node, ref) {
        var parent = ref.parentNode;
        if (parent) {
            if (parent.lastChild === ref) {
                parent.appendChild(node);
            }
            else {
                parent.insertBefore(node, ref.nextSibling);
            }
        }
    }
    function insertBefore(node, ref) {
        var parent = ref.parentNode;
        if (parent) {
            parent.insertBefore(node, ref);
        }
    }
    var transitionClass = 'njsTransition750ms', defaultTransitionClasses = {
        active: 'njsTransitionActive',
        prev: 'njsTransitionPrev',
        next: 'njsTransitionNext',
        left: 'njsTransitionLeft',
        right: 'njsTransitionRight'
    };
    TransitionPanel.prototype.transitionDuration = 750;
    TransitionPanel.prototype.transitionClass = transitionClass;
    TransitionPanel.prototype.activeTransitionClass = defaultTransitionClasses.active;
    TransitionPanel.prototype.previousTransitionClass = defaultTransitionClasses.prev;
    TransitionPanel.prototype.nextTransitionClass = defaultTransitionClasses['next'];
    TransitionPanel.prototype.leftTransitionClass = defaultTransitionClasses.left;
    TransitionPanel.prototype.rightTransitionClass = defaultTransitionClasses.right;
    var TransitionPanel = (function (_super) {
        __extends(TransitionPanel, _super);
        function TransitionPanel() {
            return _super.apply(this, arguments) || this;
        }
        TransitionPanel.prototype.show = function (parent) {
            var _this = this;
            return deferredUtils_1.when(_super.prototype.show.call(this, parent), function () {
                var domNode = _this.domNode;
                setClass_1.default(domNode, _this.transitionClass);
                return domNode;
            });
        };
        TransitionPanel.prototype.activeSetter = function (value) {
            var _this = this;
            this.active = value;
            return deferredUtils_1.when(this.domNode, function (domNode) {
                setClass_1.default(domNode, ((value) ? '' : '!') + _this.activeTransitionClass);
                if (value) {
                    _this.emit('show', {});
                }
                else {
                    _this.emit('hide', {});
                }
            });
        };
        TransitionPanel.prototype.previousPanelSetter = function (value) {
            var _this = this;
            var oldPrev = this.previousPanel;
            this.previousPanel = value;
            if (this.previousPanel) {
                if (oldPrev) {
                    oldPrev.nextPanel = this.previousPanel;
                    this.previousPanel.previousPanel = oldPrev;
                }
                this.previousPanel.nextPanel = this;
                return deferredUtils_1.when(this.show(), function () {
                    return deferredUtils_1.when(_this.previousPanel.show(), function (previousDomNode) {
                        _this.setPreviousBefore();
                        return previousDomNode;
                    });
                });
            }
            else {
                return deferredUtils_1.resolve(this.domNode);
            }
        };
        TransitionPanel.prototype.nextPanelSetter = function (value) {
            var _this = this;
            var oldNext = this.nextPanel;
            this.nextPanel = value;
            if (this.nextPanel) {
                if (oldNext) {
                    oldNext.previousPanel = this.nextPanel;
                    this.nextPanel.nextPanel = oldNext;
                }
                this.nextPanel.previousPanel = this;
                return deferredUtils_1.when(this.show(), function () {
                    return deferredUtils_1.when(_this.nextPanel.show(), function (nextDomNode) {
                        _this.setNextAfter();
                        return nextDomNode;
                    });
                });
            }
            else {
                return deferredUtils_1.resolve(this.domNode);
            }
        };
        TransitionPanel.prototype.setNextAfter = function () {
            var _this = this;
            return deferredUtils_1.when(this.domNode, function (domNode) {
                return deferredUtils_1.when(_this.nextPanel.show(domNode.parentElement), function () {
                    var nextDomNode = _this.nextPanel.domNode;
                    if (nextDomNode.parentNode && (domNode.parentNode !== nextDomNode.parentNode)) {
                        setClass_1.default(domNode, _this.nextTransitionClass);
                        insertBefore(domNode, nextDomNode);
                        if (_this.active) {
                            setClass_1.default(nextDomNode, _this.nextPanel.nextTransitionClass);
                        }
                    }
                });
            });
        };
        TransitionPanel.prototype.setPreviousBefore = function () {
            var _this = this;
            return deferredUtils_1.when(this.domNode, function (domNode) {
                return deferredUtils_1.when(_this.nextPanel.show(domNode.parentElement), function () {
                    var previousDomNode = _this.previousPanel.domNode;
                    if (previousDomNode.parentNode && (domNode.parentNode !== previousDomNode.parentNode)) {
                        setClass_1.default(domNode, _this.previousTransitionClass);
                        insertAfter(domNode, previousDomNode);
                        if (_this.active) {
                            setClass_1.default(previousDomNode, _this.previousPanel.previousTransitionClass);
                        }
                    }
                });
            });
        };
        TransitionPanel.prototype.next = function () {
            var _this = this;
            if (!this.nextPanel) {
                throw new Error('TransitionPanel must have an assigned nextPanel');
            }
            if (this.previousPanel) {
                this.previousPanel.set('isLeft', false);
            }
            return deferredUtils_1.when(this.domNode, function (domNode) {
                setClass_1.default(domNode, _this.leftTransitionClass);
                var nextDomNode = _this.nextPanel.domNode;
                setClass_1.default(nextDomNode, _this.nextTransitionClass, _this.leftTransitionClass);
                setTimeout(function () {
                    setClass_1.default(domNode, '!' + _this.leftTransitionClass, '!' + _this.activeTransitionClass);
                    setClass_1.default(nextDomNode, '!' + _this.nextTransitionClass, '!' + _this.leftTransitionClass, _this.activeTransitionClass);
                }, _this.transitionDuration);
                _this.active = false;
                _this.nextPanel.active = true;
                _this.emit('hide', {});
                _this.nextPanel.emit('show', {});
                return _this.nextPanel;
            });
        };
        TransitionPanel.prototype.previous = function () {
            var _this = this;
            if (!this.previousPanel) {
                throw new Error('TransitionPanel must have an assigned previousPanel');
            }
            if (this.nextPanel) {
                this.nextPanel.set('isRight', false);
            }
            return deferredUtils_1.when(this.domNode, function (domNode) {
                setClass_1.default(domNode, _this.rightTransitionClass);
                var previousDomNode = _this.previousPanel.domNode;
                setClass_1.default(previousDomNode, _this.previousTransitionClass, _this.rightTransitionClass);
                setTimeout(function () {
                    setClass_1.default(domNode, '!' + _this.rightTransitionClass, '!' + _this.activeTransitionClass);
                    setClass_1.default(previousDomNode, '!' + _this.previousTransitionClass, '!' + _this.rightTransitionClass, _this.activeTransitionClass);
                }, _this.transitionDuration);
                _this.active = false;
                _this.previousPanel.active = true;
                _this.emit('hide', {});
                _this.previousPanel.emit('show', {});
                return _this.previousPanel;
            });
        };
        return TransitionPanel;
    }(Widget_1.default));
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = TransitionPanel;
});
//# sourceMappingURL=TransitionPanel.js.map