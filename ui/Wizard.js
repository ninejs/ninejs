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
        define(["require", "exports", "./Skins/Wizard/Default", './Widget', './bootstrap/Button', "../core/deferredUtils"], factory);
    }
})(function (require, exports, DefaultSkin) {
    'use strict';
    var Widget_1 = require('./Widget');
    var Button_1 = require('./bootstrap/Button');
    var deferredUtils_1 = require("../core/deferredUtils");
    function i18n(key) {
        return key;
    }
    var Wizard = (function (_super) {
        __extends(Wizard, _super);
        function Wizard(args) {
            _super.call(this, args);
            var Button = this.ButtonConstructor;
            this.helpButton = new Button({ label: i18n('Help') });
            this.previousButton = new Button({ label: '< ' + i18n('Back') });
            this.nextButton = new Button({ label: i18n('Next') + ' >' });
            this.finishButton = new Button({ label: i18n('Finish') });
            this.cancelButton = new Button({ label: i18n('Cancel') });
        }
        Wizard.prototype.addStep = function (panel, beforePanel) {
            var cnt, stepList = this.stepList, current;
            if (beforePanel) {
                for (cnt = 0; cnt < stepList.length; cnt += 1) {
                    current = stepList[cnt];
                    if (current === beforePanel) {
                        current.set('previousPanel', panel);
                        stepList.splice(cnt, 0, panel);
                        break;
                    }
                }
            }
            else {
                if (stepList.length) {
                    stepList[stepList.length - 1].set('nextPanel', panel);
                }
                else {
                    panel.show(this.containerNode);
                    panel.set('active', true);
                }
                stepList.push(panel);
            }
            if (!this.get('currentStep')) {
                this.set('currentStep', panel);
            }
        };
        Wizard.prototype.currentStepSetter = function (step) {
            var currentStep = this.get('currentStep'), currentIndex = this.stepList.indexOf(currentStep), targetIndex, tempStep = currentStep;
            if (typeof (step) === 'number') {
                targetIndex = step;
                step = this.stepList[step];
            }
            if (currentStep !== step) {
                if (typeof (targetIndex) === 'undefined') {
                    targetIndex = this.stepList.indexOf(step);
                }
                if (targetIndex < 0) {
                    throw new Error('Step not found');
                }
                if (currentIndex >= 0) {
                    if (targetIndex < currentIndex) {
                        while (tempStep !== step) {
                            tempStep = tempStep.previous();
                        }
                    }
                    else {
                        while (tempStep !== step) {
                            tempStep = tempStep.next();
                        }
                    }
                }
                this.currentStep = step;
                if (this.domNode) {
                    this.emit('stepChanged', { index: targetIndex, step: step });
                }
            }
        };
        Wizard.prototype.show = function () {
            var _this = this;
            return deferredUtils_1.when(_super.prototype.show.call(this), function (domNode) {
                var cnt, stepList = _this.stepList, current;
                for (cnt = 0; cnt < stepList.length; cnt += 1) {
                    current = stepList[cnt];
                    current.show(_this.containerNode);
                    if (cnt < stepList.length - 1) {
                        current.setNextAfter();
                    }
                    if (current.get('active')) {
                        if (cnt > 0) {
                            current.get('previousPanel').set('isLeft', true);
                        }
                        if (cnt < (stepList.length - 1)) {
                            current.get('nextPanel').set('isRight', true);
                        }
                    }
                }
                return domNode;
            });
        };
        Wizard.prototype.onUpdatedSkin = function () {
            var _this = this;
            _super.prototype.onUpdatedSkin.call(this);
            this.helpButton.on('click', function () {
                _this.showHelp();
            });
            this.previousButton.on('click', function () {
                _this.set('currentStep', _this.get('currentStep').previousPanel);
            });
            this.nextButton.on('click', function () {
                _this.set('currentStep', _this.get('currentStep').nextPanel);
            });
            this.finishButton.on('click', function () {
                _this.finish();
            });
            this.cancelButton.on('click', function () {
                _this.cancel();
            });
        };
        Wizard.prototype.showHelp = function () {
        };
        Wizard.prototype.finish = function () {
        };
        Wizard.prototype.cancel = function () {
        };
        return Wizard;
    }(Widget_1.default));
    Wizard.prototype.skin = DefaultSkin;
    Wizard.prototype.stepList = [];
    Wizard.prototype.ButtonConstructor = Button_1.default;
    Wizard.prototype.i18n = i18n;
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = Wizard;
});
//# sourceMappingURL=Wizard.js.map