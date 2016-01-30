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
        define(["require", "exports", './Widget', '../core/extend', './Skins/Editor/Default', '../core/deferredUtils', '../modernizer', '../core/array', '../core/objUtils', '../core/on', './utils/domUtils', '../config'], factory);
    }
})(function (require, exports) {
    'use strict';
    var _this = this;
    var Widget_1 = require('./Widget');
    var extend_1 = require('../core/extend');
    var Default_1 = require('./Skins/Editor/Default');
    var deferredUtils_1 = require('../core/deferredUtils');
    var modernizer_1 = require('../modernizer');
    var array_1 = require('../core/array');
    var objUtils_1 = require('../core/objUtils');
    var on_1 = require('../core/on');
    var domUtils_1 = require('./utils/domUtils');
    var config_1 = require('../config');
    var editorConfig = (((config_1.default.ninejs || {}).ui || {}).Editor || {}), NumberTextBox, numberTextBoxDefer, timeTextBoxDefer, DateTextBox, dateTextBoxDefer, TimeTextBox, numberTextBoxImpl = editorConfig.NumberTextBox || 'dijit/form/NumberTextBox', dateTextBoxImpl = editorConfig.DateTextBox || 'dijit/form/DateTextBox', timeTextBoxImpl = editorConfig.TimeTextBox || 'dijit/form/TimeTextBox', ENTER = 13;
    var pad = '00';
    var applyToNode = function (node, callback, self) {
        if (objUtils_1.isHTMLElement(node)) {
            return deferredUtils_1.resolve(callback.call(self, node));
        }
        else {
            return deferredUtils_1.when(node, function (domNode) {
                return callback.call(self, domNode);
            });
        }
    };
    function padTime(str) {
        return pad.substring(0, pad.length - str.length) + str;
    }
    function parseTime(time) {
        var b = time.match(/\d+/g);
        if (!b) {
            return undefined;
        }
        var d = new Date();
        var b0 = parseInt(b[0], 10), b1 = parseInt(b[1], 10), b2 = parseInt(b[2], 10);
        d.setHours(b0 >= 12 ? b0 : b0 % 12 + (/p/i.test(time) ? 12 : 0), /\d/.test(b[1]) ? b1 : 0, /\d/.test(b[2]) ? b2 : 0);
        return d;
    }
    var focus = function (node) {
        node.focus();
    };
    var setName = function (node) {
        node.name = _this.value;
    };
    function controlBaseSetValue(node) {
        var input = node, v = this.value;
        if (v && (input.type === 'time')) {
            var d = new Date(v);
            if (isNaN(d.valueOf())) {
                d = parseTime(v);
            }
            v = padTime('' + d.getHours()) + ':' + padTime('' + d.getMinutes()) + ':' + padTime('' + d.getSeconds());
        }
        this.self.value = v;
        input.value = v;
    }
    function selectSetValue(node) {
        var _this = this;
        var input = node, v = this.value, arr = input.options;
        deferredUtils_1.when(v, (function (v) {
            for (var cnt = 0; cnt < arr.length; cnt += 1) {
                var opt = arr[cnt];
                opt.selected = (opt.value == v);
            }
            _this.self.value = v;
        }));
        return v;
    }
    function selectGetValue(node) {
        var input = node, arr = input.options;
        for (var cnt = 0; cnt < arr.length; cnt += 1) {
            var opt = arr[cnt];
            if (opt.selected) {
                return opt.value;
            }
        }
        return undefined;
    }
    function controlBaseOnChange(node) {
        var _this = this;
        this.own(on_1.default(node, 'change', function (e) {
            var node = e.currentTarget;
            if (node.type === 'checkbox') {
                _this.set('value', node.checked);
            }
            else {
                _this.set('value', node.value);
            }
        }));
    }
    ;
    var setStep = function (domNode) {
        domNode.step = _this.value + '';
    };
    var ControlBase = (function (_super) {
        __extends(ControlBase, _super);
        function ControlBase(args) {
            _super.call(this, args);
            applyToNode(this.domNode, controlBaseOnChange, this);
        }
        ControlBase.prototype.on = function (type, action, persistEvent) {
            var handler = on_1.default(this.domNode, type, action, false);
            this.own(handler);
            return handler;
        };
        ControlBase.prototype.destroyRecursive = function () {
            this.destroy();
        };
        ControlBase.prototype.startup = function () {
        };
        ControlBase.prototype.focus = function () {
            applyToNode(this.domNode, focus, this);
        };
        ControlBase.prototype.valueSetter = function (v) {
            applyToNode(this.domNode, controlBaseSetValue, { self: this, value: v });
        };
        ControlBase.prototype.valueGetter = function () {
            return this.value;
        };
        ControlBase.prototype.nameSetter = function (v) {
            this.name = v;
            return applyToNode(this.domNode, setName, { value: v });
        };
        return ControlBase;
    })(Widget_1.default);
    exports.ControlBase = ControlBase;
    var goodNumber = /^(\+|-)?((\d+(\.\d+)?)|(\.\d+))$/, goodPrefix = /^(\+|-)?((\d*(\.?\d*)?)|(\.\d*))$/;
    var NativeNumberTextBox = (function (_super) {
        __extends(NativeNumberTextBox, _super);
        function NativeNumberTextBox(args) {
            var _this = this;
            var node = domUtils_1.append.create('input');
            node.type = 'number';
            var previousValue;
            on_1.default(node, 'input,propertyChange', function () {
                if (!goodPrefix.test(_this.value)) {
                    _this.value = previousValue;
                }
                if (!goodNumber.test(_this.value)) {
                    domUtils_1.setClass(node, 'invalid');
                }
                else {
                    domUtils_1.setClass(node, '!invalid');
                    previousValue = _this.value;
                }
            });
            this.domNode = node;
            _super.call(this, args);
        }
        NativeNumberTextBox.prototype.stepSetter = function (p) {
            var node = this.domNode;
            applyToNode(node, setStep, { value: p });
        };
        return NativeNumberTextBox;
    })(ControlBase);
    exports.NativeNumberTextBox = NativeNumberTextBox;
    function getNumberTextBoxConstructor() {
        var NumberTextBox;
        if (!modernizer_1.default['inputtypes'].number) {
            numberTextBoxDefer = deferredUtils_1.defer();
            NumberTextBox = numberTextBoxDefer.promise;
            require([numberTextBoxImpl], function (C) {
                NumberTextBox = C;
                numberTextBoxDefer.resolve(C);
                numberTextBoxDefer = null;
            });
            if (!NumberTextBox) {
                throw new Error('Implementation for NumberTextBox: ' + numberTextBoxImpl + ' must be previously loaded.');
            }
        }
        else {
            NumberTextBox = NativeNumberTextBox;
        }
        return NumberTextBox;
    }
    function toHTML5Date(date) {
        var year = date.getUTCFullYear(), month = date.getUTCMonth() + 1 < 10 ? '0' + (date.getUTCMonth() + 1) : date.getUTCMonth() + 1, day = date.getUTCDate() < 10 ? '0' + date.getUTCDate() : date.getUTCDate(), formated = year + '-' + month + '-' + day;
        return formated;
    }
    var inputSetValue = function (domNode) {
        domNode.value = _this.value;
    };
    var NativeDateTextBox = (function (_super) {
        __extends(NativeDateTextBox, _super);
        function NativeDateTextBox(args) {
            var node = domUtils_1.append.create('input');
            node.type = 'date';
            this.domNode = node;
            _super.call(this, args);
        }
        NativeDateTextBox.prototype.valueSetter = function (val) {
            var value, node = this.domNode;
            if (objUtils_1.isDate(val)) {
                this.value = val;
                value = toHTML5Date(val);
            }
            else {
                this.value = new Date(val);
                value = val;
            }
            applyToNode(node, inputSetValue, { value: value });
        };
        return NativeDateTextBox;
    })(ControlBase);
    exports.NativeDateTextBox = NativeDateTextBox;
    function getDateTextBoxConstructor() {
        var DateTextBox;
        if (!modernizer_1.default['inputtypes'].date) {
            dateTextBoxDefer = deferredUtils_1.defer();
            DateTextBox = dateTextBoxDefer.promise;
            setTimeout(function () {
                require([dateTextBoxImpl], function (C) {
                    DateTextBox = C;
                    dateTextBoxDefer.resolve(C);
                    dateTextBoxDefer = null;
                });
            });
            if (!DateTextBox) {
                throw new Error('Implementation for DateTextBox: ' + dateTextBoxImpl + ' must be previously loaded.');
            }
        }
        else {
            DateTextBox = NativeDateTextBox;
        }
        return DateTextBox;
    }
    var NativeTimeTextBox = (function (_super) {
        __extends(NativeTimeTextBox, _super);
        function NativeTimeTextBox(args) {
            var node = domUtils_1.append.create('input');
            node.type = 'time';
            this.domNode = node;
            _super.call(this, args);
        }
        return NativeTimeTextBox;
    })(ControlBase);
    exports.NativeTimeTextBox = NativeTimeTextBox;
    function getTimeTextBoxConstructor() {
        if (!modernizer_1.default['inputtypes'].time) {
            timeTextBoxDefer = deferredUtils_1.defer();
            TimeTextBox = timeTextBoxDefer.promise;
            setTimeout(function () {
                require([timeTextBoxImpl], function (C) {
                    TimeTextBox = C;
                    timeTextBoxDefer.resolve(C);
                    timeTextBoxDefer = null;
                });
            });
            if (!TimeTextBox) {
                throw new Error('Implementation for TimeTextBox: ' + timeTextBoxImpl + ' must be previously loaded.');
            }
        }
        else {
            TimeTextBox = NativeTimeTextBox;
        }
        return TimeTextBox;
    }
    NumberTextBox = getNumberTextBoxConstructor();
    DateTextBox = getDateTextBoxConstructor();
    var setChecked = function (domNode) {
        domNode.checked = _this.value;
    };
    var NativeCheckBox = (function (_super) {
        __extends(NativeCheckBox, _super);
        function NativeCheckBox(args) {
            var node = domUtils_1.append.create('input');
            node.type = 'checkbox';
            node.checked = false;
            this.domNode = node;
            _super.call(this, args);
        }
        NativeCheckBox.prototype.valueSetter = function (v) {
            _super.prototype.valueSetter.call(this, v);
            applyToNode(this.domNode, setChecked, { value: v });
        };
        return NativeCheckBox;
    })(ControlBase);
    exports.NativeCheckBox = NativeCheckBox;
    var NativeTextBox = (function (_super) {
        __extends(NativeTextBox, _super);
        function NativeTextBox(args) {
            var node = domUtils_1.append.create('input');
            node.type = 'text';
            this.domNode = node;
            _super.call(this, args);
        }
        return NativeTextBox;
    })(ControlBase);
    exports.NativeTextBox = NativeTextBox;
    function isValue(val) {
        return (val !== undefined) && (val !== null);
    }
    function getKey(item) {
        var key;
        if (isValue(item.key)) {
            key = item.key;
        }
        else if (isValue(item.value)) {
            key = item.value;
        }
        else {
            key = item;
        }
        return key;
    }
    function getValue(item) {
        var value;
        if (isValue(item.label)) {
            value = item.label;
        }
        else if (isValue(item.value)) {
            value = item.value;
        }
        else {
            value = item;
        }
        return value;
    }
    var setOptions = function (domNode) {
        var node = domNode, self = this.self, v = this.value;
        domUtils_1.setText.emptyNode(node);
        if (v) {
            array_1.forEach(v, function (item) {
                var key = getKey(item), value = getValue(item), opt;
                opt = domUtils_1.append.create('option');
                opt.setAttribute('value', key);
                if (item.disabled === true) {
                    opt.setAttribute('disabled', 'disabled');
                }
                if (item.selected === true || key === self.get('value')) {
                    opt.setAttribute('selected', 'selected');
                }
                domUtils_1.setText(domUtils_1.append(node, opt), value);
            });
        }
    };
    var NativeSelect = (function (_super) {
        __extends(NativeSelect, _super);
        function NativeSelect(args) {
            this.domNode = domUtils_1.append.create('select');
            _super.call(this, args);
        }
        NativeSelect.prototype.optionsSetter = function (v) {
            applyToNode(this.domNode, setOptions, { self: this, value: v });
        };
        NativeSelect.prototype.valueSetter = function (v) {
            applyToNode(this.domNode, selectSetValue, { self: this, value: v });
        };
        NativeSelect.prototype.valueGetter = function () {
            return selectGetValue.call({ self: this }, this.domNode);
        };
        return NativeSelect;
    })(ControlBase);
    exports.NativeSelect = NativeSelect;
    TimeTextBox = getTimeTextBoxConstructor();
    function getControlSetter(propName) {
        return function (c) {
            var self = this;
            if (typeof (c) === 'string') {
                var deferred = deferredUtils_1.defer();
                self[propName] = deferred.promise;
                require([c], function (Control) {
                    self[propName] = Control;
                    deferred.resolve(Control);
                });
            }
            else {
                self[propName] = c;
            }
        };
    }
    function getEventTarget(control) {
        if (control.domNode && control.domNode.localName) {
            return control.domNode;
        }
        return control;
    }
    var normalKeyDownEventHandler = function (e) {
        if (e.keyCode === ENTER) {
            on_1.default.emit(this, 'blur', {
                bubbles: true,
                cancellable: true
            });
        }
    };
    var buildNumberTextBox = function (self, places) {
        var NumberTextBoxControl = self.NumberTextBoxControl || NumberTextBox;
        var args = {
            places: places,
            step: (typeof (places) === 'number') ? Math.pow(0.1, places).toString() : 'any',
            editor: self,
            onKeyDown: normalKeyDownEventHandler,
            intermediateChanges: true
        };
        extend_1.default.mixin(args, self.args);
        return deferredUtils_1.when(NumberTextBoxControl, function (NumberTextBoxControl) {
            var control = new NumberTextBoxControl(args);
            self.own(on_1.default(getEventTarget(control), 'blur', function (e) {
                control.editor.emit('blur', e);
            }), on_1.default(getEventTarget(control), 'input', function (e) {
                control.editor.emit('input', e);
            }));
            control.watch('value', function (name, old, newv) {
                self.set('value', newv, true);
            });
            return control;
        });
    };
    var buildDateTextBox = function (self) {
        var DateTextBoxControl = self.DateTextBoxControl || DateTextBox;
        var args = {
            editor: self,
            onBlur: function (e) {
                this.editor.emit('blur', e);
            }
        };
        extend_1.default.mixin(args, self.args);
        return deferredUtils_1.when(DateTextBoxControl, function (DateTextBoxControl) {
            var control = new DateTextBoxControl(args);
            self.own(on_1.default(getEventTarget(control), 'blur', function (e) {
                control.editor.emit('blur', e);
            }), on_1.default(getEventTarget(control), 'input', function (e) {
                control.editor.emit('input', e);
            }));
            control.watch('value', function (name, old, newv) {
                self.set('value', newv, true);
            });
            return control;
        });
    };
    var buildTimeTextBox = function (self) {
        var TimeTextBoxControl = self.TimeTextBoxControl || TimeTextBox;
        var args = {
            editor: self,
            onBlur: function (e) {
                this.editor.emit('blur', e);
            }
        };
        extend_1.default.mixin(args, self.args);
        return deferredUtils_1.when(TimeTextBoxControl, function (TimeTextBoxControl) {
            var control = new TimeTextBoxControl(args);
            self.own(on_1.default(getEventTarget(control), 'blur', function (e) {
                control.editor.emit('blur', e);
            }), on_1.default(getEventTarget(control), 'input', function (e) {
                control.editor.emit('input', e);
            }));
            control.watch('value', function (name, old, newv) {
                self.set('value', newv, true);
            });
            return control;
        });
    };
    var buildCheckBox = function (self) {
        var CheckBoxControl = self.CheckBoxControl || NativeCheckBox;
        var args = {
            editor: self,
            nullValue: false,
            onBlur: function (e) {
                this.editor.emit('blur', e);
            }
        };
        extend_1.default.mixin(args, self.args);
        return deferredUtils_1.when(CheckBoxControl, function (CheckBoxControl) {
            var control = new CheckBoxControl(args);
            return deferredUtils_1.when(self.domNode, function (domNode) {
                return deferredUtils_1.when(control.show(domNode), function () {
                    self.own(on_1.default(getEventTarget(control), 'blur', function (e) {
                        control.get('editor').emit('blur', e);
                    }));
                    control.watch('value', function (name, old, newv) {
                        self.set('value', newv, true);
                        control.get('editor').emit('input', { value: self.get('value') });
                    });
                    return control;
                });
            });
        });
    };
    var buildTextBox = function (self) {
        var TextBoxControl = self.TextBoxControl || NativeTextBox;
        var args = {
            editor: self,
            nullValue: '',
            intermediateChanges: true,
            onKeyDown: normalKeyDownEventHandler,
            onBlur: function (e) {
                this.editor.emit('blur', e);
            }
        };
        extend_1.default.mixin(args, self.args);
        return deferredUtils_1.when(TextBoxControl, function (TextBoxControl) {
            var control = new TextBoxControl(args);
            self.own(on_1.default(getEventTarget(control), 'blur', function (e) {
                control.editor.emit('blur', e);
            }), on_1.default(getEventTarget(control), 'input', function (e) {
                control.editor.emit('input', e);
            }));
            control.watch('value', function (name, old, newv) {
                self.set('value', newv, true);
            });
            return control;
        });
    };
    var buildSelect = function (self) {
        var SelectControl = self.SelectControl || NativeSelect;
        var args = {
            editor: self,
            options: self.get('options'),
            onBlur: function (e) {
                this.editor.emit('blur', e);
            }
        };
        extend_1.default.mixin(args, self.args);
        return deferredUtils_1.when(SelectControl, function (SelectControl) {
            var control = new SelectControl(args);
            return deferredUtils_1.when(self.domNode, function (domNode) {
                return deferredUtils_1.when(control.show(domNode), function (domNode) {
                    self.own(on_1.default(getEventTarget(control), 'blur', function (e) {
                        control['editor'].emit('blur', e);
                    }), on_1.default(getEventTarget(control), 'input', function (e) {
                        control['editor'].emit('input', e);
                    }));
                    control.watch('value', function (name, old, newv) {
                        self.set('value', newv, true);
                    });
                    control.on('change', function () {
                        self.set('value', control.get('value'), true);
                        self.emit('change', {});
                    });
                    return control;
                });
            });
        });
    };
    var editorFunctions = {
        clearDataTypeClasses: function (domNode) {
            domUtils_1.setClass(domNode, '!dataType-integer', '!dataType-decimal', '!dataType-date', '!dataType-datetime', '!dataType-boolean', '!dataType-record', '!dataType-alphanumeric', '!dataType-list');
        }
    };
    var Editor = (function (_super) {
        __extends(Editor, _super);
        function Editor(args) {
            this.dataType = null;
            _super.call(this, args);
            this.controlDefer = deferredUtils_1.defer();
            this.control = this.controlDefer.promise;
        }
        Editor.prototype._clearDataTypeClasses = function () {
            return deferredUtils_1.when(this.show(), editorFunctions.clearDataTypeClasses);
        };
        Editor.prototype.onUpdatedSkin = function () {
            var _this = this;
            var self = this;
            _super.prototype.onUpdatedSkin.call(this);
            this.own(this.on('blur', function () {
                return self.onBlur.apply(self, arguments);
            }));
            this.watch('value', function () {
                _this.emit('change', {});
            });
        };
        Editor.prototype.controlClassSetter = function (v) {
            return deferredUtils_1.when(this.control, function (control) {
                if (control) {
                    return deferredUtils_1.when(control.domNode, function (domNode) {
                        var arg = v.split(' ');
                        arg.unshift(domNode);
                        domUtils_1.setClass.apply(null, arg);
                    });
                }
                else {
                    throw new Error('Please set control\'s dataType property prior to assigning \'controlClass\' property');
                }
            });
        };
        Editor.prototype.placeholderSetter = function (v) {
            this.placeholder = v;
            return deferredUtils_1.when(this.control, function (control) {
                if (control) {
                    return deferredUtils_1.when(control.domNode, function (domNode) {
                        var node = domNode;
                        node.placeholder = v;
                    });
                }
                else {
                    throw new Error('Please set control\'s dataType property prior to assigning \'placeholder\' property');
                }
            });
        };
        Editor.prototype.nameSetter = function (v) {
            this.name = v;
            return deferredUtils_1.when(this.control, function (control) {
                if (control) {
                    control.set('name', v);
                }
                else {
                    throw new Error('Please set control\'s dataType property prior to assigning \'name\' property');
                }
            });
        };
        Editor.prototype.autocompleteSetter = function (v) {
            var _this = this;
            this.autocomplete = v;
            return deferredUtils_1.when(this.control, function (control) {
                if (_this.control) {
                    return deferredUtils_1.when(control.domNode, function (domNode) {
                        var node = domNode;
                        node.autocomplete = v;
                    });
                }
                else {
                    throw new Error('Please set control\'s dataType property prior to assigning \'autocomplete\' property');
                }
            });
        };
        Editor.prototype.inputTypeSetter = function (v) {
            return deferredUtils_1.when(this.control, function (control) {
                if (control) {
                    return deferredUtils_1.when(control.domNode, function (domNode) {
                        var node = domNode;
                        node.type = v;
                    });
                }
                else {
                    throw new Error('Please set control\'s dataType property prior to assigning \'inputType\' property');
                }
            });
        };
        Editor.prototype.requiredSetter = function (v) {
            this.required = v;
            return deferredUtils_1.when(this.control, function (control) {
                if (control) {
                    return deferredUtils_1.when(control.domNode, function (domNode) {
                        var node = domNode;
                        if (v) {
                            node.required = 'required';
                        }
                        else {
                            node.required = null;
                        }
                    });
                }
                else {
                    throw new Error('Please set control\'s dataType property prior to assigning \'min\' property');
                }
            });
        };
        Editor.prototype.minSetter = function (v) {
            this.min = v;
            return deferredUtils_1.when(this.control, function (control) {
                if (control) {
                    return deferredUtils_1.when(control.domNode, function (domNode) {
                        var node = domNode;
                        node.min = v;
                    });
                }
                else {
                    throw new Error('Please set control\'s dataType property prior to assigning \'min\' property');
                }
            });
        };
        Editor.prototype.maxSetter = function (v) {
            this.max = v;
            return deferredUtils_1.when(this.control, function (control) {
                if (control) {
                    return deferredUtils_1.when(control.domNode, function (domNode) {
                        var node = domNode;
                        node.max = v;
                    });
                }
                else {
                    throw new Error('Please set control\'s dataType property prior to assigning \'max\' property');
                }
            });
        };
        Editor.prototype.maxLengthSetter = function (v) {
            this.maxLength = v;
            return deferredUtils_1.when(this.control, function (control) {
                if (control) {
                    return deferredUtils_1.when(control.domNode, function (domNode) {
                        var node = domNode;
                        node.maxLength = v;
                    });
                }
                else {
                    throw new Error('Please set control\'s dataType property prior to assigning \'maxlength\' property');
                }
            });
        };
        Editor.prototype.titleSetter = function (v) {
            this.title = v;
            return deferredUtils_1.when(this.control, function (control) {
                if (control) {
                    return deferredUtils_1.when(control.domNode, function (domNode) {
                        var node = domNode;
                        node.title = v;
                    });
                }
                else {
                    throw new Error('Please set control\'s dataType property prior to assigning \'title\' property');
                }
            });
        };
        Editor.prototype.patternSetter = function (v) {
            this.pattern = v;
            return deferredUtils_1.when(this.control, function (control) {
                if (control) {
                    return deferredUtils_1.when(control.domNode, function (domNode) {
                        var node = domNode;
                        node.pattern = v;
                    });
                }
                else {
                    throw new Error('Please set control\'s dataType property prior to assigning \'pattern\' property');
                }
            });
        };
        Editor.prototype.onBlur = function () {
        };
        Editor.prototype.bind = function (target, name) {
            if (target) {
                var self = this;
                this.watch('value', function (pname, oldv, newv) {
                    target.set(name, newv);
                });
                target.watch(name, function (pname, oldv, newv) {
                    self.set('value', newv);
                });
            }
            return this;
        };
        Editor.prototype.focus = function () {
            var self = this;
            return deferredUtils_1.when(this.control, function (control) {
                var ctrl = control;
                if (ctrl && (typeof (ctrl.focus) === 'function')) {
                    ctrl.focus();
                }
            });
        };
        Editor.prototype.dataTypeSetter = function (val) {
            var _this = this;
            var self = this, domNode = this.domNode;
            return deferredUtils_1.when(this.domNode, function (domNode) {
                if (val && (val !== _this.dataType)) {
                    var ctrl = _this.control;
                    if (ctrl) {
                        if (typeof (ctrl.destroy) === 'function') {
                            ctrl.destroy();
                        }
                        else if (typeof (ctrl.destroyRecursive) === 'function') {
                            ctrl.destroyRecursive(false);
                        }
                    }
                    var p = deferredUtils_1.when(_this._clearDataTypeClasses(), function () {
                        domUtils_1.setClass(domNode, ('dataType-' + val));
                        var controlMap = {
                            'integer': function (self) {
                                return buildNumberTextBox(self, 0);
                            },
                            'decimal': function (self) {
                                return buildNumberTextBox(self);
                            },
                            'date': buildDateTextBox,
                            'time': buildTimeTextBox,
                            'datetime': buildTimeTextBox,
                            'boolean': buildCheckBox,
                            'record': buildTextBox,
                            'alphanumeric': buildTextBox,
                            'list': buildSelect
                        };
                        return deferredUtils_1.when(controlMap[val](self), function (ctrl) {
                            var controlPromise = self.control, anyControl = self.control;
                            if (anyControl && (anyControl.startup || anyControl.show)) {
                                anyControl.destroy();
                                domUtils_1.setText.emptyNode(domNode);
                            }
                            self.control = ctrl;
                            anyControl = ctrl;
                            if (deferredUtils_1.isPromise(controlPromise)) {
                                self.controlDefer.resolve(ctrl);
                                self.controlDefer = null;
                            }
                            (anyControl.startup || ctrl.show).call(ctrl);
                            return deferredUtils_1.when(ctrl.domNode, function (controlDomNode) {
                                domUtils_1.append(domNode, controlDomNode);
                                return ctrl;
                            });
                        });
                    });
                    _this.dataType = val;
                    return p;
                }
            });
        };
        Editor.prototype.nullValueSetter = function (val) {
            var self = this;
            return deferredUtils_1.when(this.control, function (control) {
                var ctrl = control;
                if (ctrl) {
                    ctrl.nullValue = val;
                }
            });
        };
        Editor.prototype.valueSetter = function (val, stopPropagate) {
            var self = this, control = this.control;
            if ((val === null) && control && (control.nullValue !== undefined) && (control.nullValue !== null)) {
                val = control.nullValue;
                this.value = val;
                this.set('value', val, true);
            }
            else {
                if ((this.dataType === 'boolean') && (objUtils_1.isString(val))) {
                    val = val.toLowerCase() !== 'false';
                }
                this.value = val;
            }
            var setter = function (control) {
                if (!stopPropagate) {
                    var dataType = self.get('dataType'), implied;
                    if (!self.control) {
                        self.set('dataType', self.get('dataType'));
                    }
                    if ((dataType === 'integer') || (dataType === 'decimal')) {
                        implied = val;
                        if (val && objUtils_1.isString(val)) {
                            implied = val * 1;
                        }
                        control.set('value', implied);
                    }
                    else {
                        control.set('value', val);
                    }
                }
            };
            if (deferredUtils_1.isPromise(this.control)) {
                return deferredUtils_1.when(this.control, setter);
            }
            else {
                setter(this.control);
            }
        };
        Editor.prototype.optionsSetter = function (values) {
            var _this = this;
            this.options = values;
            var self = this;
            return deferredUtils_1.when(this.control, function (control) {
                if (_this.get('dataType') === 'list') {
                    control.set('options', values);
                    control.set('value', self.value);
                }
            });
        };
        return Editor;
    })(Widget_1.default);
    exports.Editor = Editor;
    Editor.prototype.skin = Default_1.default;
    Editor.prototype.SelectControlSetter = getControlSetter('SelectControl');
    Editor.prototype.TextBoxControlSetter = getControlSetter('TextBoxControl');
    Editor.prototype.CheckBoxControlSetter = getControlSetter('CheckBoxControl');
    Editor.prototype.TimeTextBoxControlSetter = getControlSetter('TimeTextBoxControl');
    Editor.prototype.DateTextBoxControlSetter = getControlSetter('DateTextBoxControl');
    Editor.prototype.NumberTextBoxControlSetter = getControlSetter('NumberTextBoxControl');
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = Editor;
});
//# sourceMappingURL=Editor.js.map