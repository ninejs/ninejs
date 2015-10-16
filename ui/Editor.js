var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
(function (deps, factory) {
    if (typeof module === 'object' && typeof module.exports === 'object') {
        var v = factory(require, exports); if (v !== undefined) module.exports = v;
    }
    else if (typeof define === 'function' && define.amd) {
        define(deps, factory);
    }
})(["require", "exports", './Widget', '../core/extend', './Skins/Editor/Default', '../core/deferredUtils', '../modernizer', '../core/array', '../core/objUtils', '../core/on', './utils/domUtils', '../config'], function (require, exports) {
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
    var ControlBase = (function (_super) {
        __extends(ControlBase, _super);
        function ControlBase(args) {
            var _this = this;
            _super.call(this, args);
            var valueField = (this.domNode.type === 'checkbox') ? 'checked' : 'value';
            this.own(on_1.default(this.domNode, 'change', function () {
                _this.set('value', _this.domNode[valueField]);
            }));
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
            this.domNode.focus();
        };
        ControlBase.prototype.valueSetter = function (v) {
            if (v && (this.domNode.type === 'time')) {
                var d = new Date(v);
                if (isNaN(d.valueOf())) {
                    d = parseTime(v);
                }
                v = padTime('' + d.getHours()) + ':' + padTime('' + d.getMinutes()) + ':' + padTime('' + d.getSeconds());
            }
            this.value = v;
            this.domNode.value = v;
        };
        ControlBase.prototype.valueGetter = function () {
            return this.value;
        };
        ControlBase.prototype.nameSetter = function (v) {
            this.name = v;
            this.domNode.name = v;
        };
        return ControlBase;
    })(Widget_1.default);
    exports.ControlBase = ControlBase;
    var goodNumber = /^(\+|-)?((\d+(\.\d+)?)|(\.\d+))$/, goodPrefix = /^(\+|-)?((\d*(\.?\d*)?)|(\.\d*))$/;
    var NativeNumberTextBox = (function (_super) {
        __extends(NativeNumberTextBox, _super);
        function NativeNumberTextBox(args) {
            var _this = this;
            this.domNode = domUtils_1.append.create('input');
            this.domNode.type = 'number';
            var previousValue;
            on_1.default(this.domNode, 'input,propertyChange', function () {
                if (!goodPrefix.test(_this.value)) {
                    _this.value = previousValue;
                }
                if (!goodNumber.test(_this.value)) {
                    domUtils_1.setClass(_this.domNode, 'invalid');
                }
                else {
                    domUtils_1.setClass(_this.domNode, '!invalid');
                    previousValue = _this.value;
                }
            });
            _super.call(this, args);
        }
        NativeNumberTextBox.prototype.stepSetter = function (p) {
            this.domNode.step = p;
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
    var NativeDateTextBox = (function (_super) {
        __extends(NativeDateTextBox, _super);
        function NativeDateTextBox(args) {
            this.domNode = domUtils_1.append.create('input');
            this.domNode.type = 'date';
            _super.call(this, args);
        }
        NativeDateTextBox.prototype.valueSetter = function (val) {
            if (Object.prototype.toString.call(val) === '[object Date]') {
                this.value = val;
                this.domNode.value = toHTML5Date(val);
            }
            else {
                this.value = new Date(val);
                this.domNode.value = val;
            }
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
            this.domNode = domUtils_1.append.create('input');
            this.domNode.type = 'time';
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
    var NativeCheckBox = (function (_super) {
        __extends(NativeCheckBox, _super);
        function NativeCheckBox(args) {
            this.domNode = domUtils_1.append.create('input');
            this.domNode.type = 'checkbox';
            this.domNode.checked = '';
            _super.call(this, args);
        }
        NativeCheckBox.prototype.valueSetter = function (v) {
            _super.prototype.valueSetter.call(this, v);
            var self = this;
            deferredUtils_1.when(this.domNode, function () {
                self.domNode.checked = (v) ? 'checked' : '';
            });
        };
        return NativeCheckBox;
    })(ControlBase);
    exports.NativeCheckBox = NativeCheckBox;
    var NativeTextBox = (function (_super) {
        __extends(NativeTextBox, _super);
        function NativeTextBox(args) {
            this.domNode = domUtils_1.append.create('input');
            this.domNode.type = 'text';
            _super.call(this, args);
        }
        return NativeTextBox;
    })(ControlBase);
    exports.NativeTextBox = NativeTextBox;
    var NativeSelect = (function (_super) {
        __extends(NativeSelect, _super);
        function NativeSelect(args) {
            this.domNode = domUtils_1.append.create('select');
            _super.call(this, args);
        }
        NativeSelect.prototype.optionsSetter = function (v) {
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
            var node = this.domNode, self = this;
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
            return deferredUtils_1.when(control.show(self.domNode), function () {
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
            return deferredUtils_1.when(control.show(self.domNode), function () {
                self.own(on_1.default(getEventTarget(control), 'blur', function (e) {
                    control.editor.emit('blur', e);
                }), on_1.default(getEventTarget(control), 'input', function (e) {
                    control.editor.emit('input', e);
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
            var _this = this;
            return deferredUtils_1.when(this.show(), function () {
                domUtils_1.setClass(_this.domNode, '!dataType-integer', '!dataType-decimal', '!dataType-date', '!dataType-datetime', '!dataType-boolean', '!dataType-record', '!dataType-alphanumeric', '!dataType-list');
            });
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
            var self = this;
            return deferredUtils_1.when(this.control, function () {
                if (self.control) {
                    var arg = v.split(' ');
                    arg.unshift(self.control.domNode);
                    domUtils_1.setClass.apply(null, arg);
                }
                else {
                    throw new Error('Please set control\'s dataType property prior to assigning \'controlClass\' property');
                }
            });
        };
        Editor.prototype.placeholderSetter = function (v) {
            this.placeholder = v;
            var self = this;
            return deferredUtils_1.when(this.control, function () {
                if (self.control) {
                    self.control.domNode.placeholder = v;
                }
                else {
                    throw new Error('Please set control\'s dataType property prior to assigning \'placeholder\' property');
                }
            });
        };
        Editor.prototype.nameSetter = function (v) {
            this.name = v;
            var self = this;
            return deferredUtils_1.when(this.control, function () {
                if (self.control) {
                    self.control.set('name', v);
                }
                else {
                    throw new Error('Please set control\'s dataType property prior to assigning \'name\' property');
                }
            });
        };
        Editor.prototype.autocompleteSetter = function (v) {
            var _this = this;
            return deferredUtils_1.when(this.control, function () {
                if (_this.control) {
                    _this.control.domNode.autocomplete = v;
                }
                else {
                    throw new Error('Please set control\'s dataType property prior to assigning \'autocomplete\' property');
                }
            });
        };
        Editor.prototype.inputTypeSetter = function (v) {
            var self = this;
            return deferredUtils_1.when(this.control, function () {
                if (self.control) {
                    self.control.domNode.type = v;
                }
                else {
                    throw new Error('Please set control\'s dataType property prior to assigning \'inputType\' property');
                }
            });
        };
        Editor.prototype.requiredSetter = function (v) {
            var _this = this;
            return deferredUtils_1.when(this.control, function () {
                if (_this.control.domNode) {
                    if (!!v) {
                        _this.control.domNode.required = 'required';
                    }
                    else {
                        _this.control.domNode.required = null;
                    }
                }
                else {
                    on_1.default.once(_this, 'updatedSkin', function (_) {
                        if (!!v) {
                            this.control.domNode.required = 'required';
                        }
                        else {
                            this.control.domNode.required = null;
                        }
                    });
                }
            });
        };
        Editor.prototype.minSetter = function (v) {
            var self = this;
            return deferredUtils_1.when(this.control, function () {
                if (self.control) {
                    self.control.domNode.min = v;
                }
                else {
                    throw new Error('Please set control\'s dataType property prior to assigning \'min\' property');
                }
            });
        };
        Editor.prototype.maxSetter = function (v) {
            var self = this;
            return deferredUtils_1.when(this.control, function () {
                if (self.control) {
                    self.control.domNode.max = v;
                }
                else {
                    throw new Error('Please set control\'s dataType property prior to assigning \'max\' property');
                }
            });
        };
        Editor.prototype.maxLengthSetter = function (v) {
            this.maxLength = v;
            var self = this;
            return deferredUtils_1.when(this.control, function () {
                if (self.control) {
                    self.control.domNode.maxLength = v;
                }
                else {
                    throw new Error('Please set control\'s dataType property prior to assigning \'maxlength\' property');
                }
            });
        };
        Editor.prototype.titleSetter = function (v) {
            this.title = v;
            var self = this;
            return deferredUtils_1.when(this.control, function () {
                if (self.control) {
                    self.control.domNode.title = v;
                }
                else {
                    throw new Error('Please set control\'s dataType property prior to assigning \'title\' property');
                }
            });
        };
        Editor.prototype.patternSetter = function (v) {
            this.pattern = v;
            var self = this;
            return deferredUtils_1.when(this.control, function () {
                if (self.control) {
                    self.control.domNode.pattern = v;
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
            return deferredUtils_1.when(this.control, function () {
                if (self.control && (typeof (self.control.focus) === 'function')) {
                    self.control.focus();
                }
            });
        };
        Editor.prototype.dataTypeSetter = function (val) {
            var self = this;
            if (val && (val !== this.dataType)) {
                if (this.control) {
                    if (typeof (this.control.destroy) === 'function') {
                        this.control.destroy();
                    }
                    else if (typeof (this.control.destroyRecursive) === 'function') {
                        this.control.destroyRecursive(false);
                    }
                }
                var p = deferredUtils_1.when(this._clearDataTypeClasses(), function () {
                    domUtils_1.setClass(self.domNode, ('dataType-' + val));
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
                        var controlPromise = self.control;
                        if (self.control && (self.control.startup || self.control.show)) {
                            self.control.destroy();
                            domUtils_1.setText.emptyNode(self.domNode);
                        }
                        self.control = ctrl;
                        if (deferredUtils_1.isPromise(controlPromise)) {
                            self.controlDefer.resolve(ctrl);
                            self.controlDefer = null;
                        }
                        (self.control.startup || self.control.show).call(self.control);
                        domUtils_1.append(self.domNode, self.control.domNode);
                        return ctrl;
                    });
                });
                this.dataType = val;
                return p;
            }
        };
        Editor.prototype.nullValueSetter = function (val) {
            var self = this;
            return deferredUtils_1.when(this.control, function () {
                if (self.control) {
                    self.control.nullValue = val;
                }
            });
        };
        Editor.prototype.valueSetter = function (val, stopPropagate) {
            var self = this;
            if ((val === null) && this.control && (this.control.nullValue !== undefined) && (this.control.nullValue !== null)) {
                val = this.control.nullValue;
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
                        self.control.set('value', implied);
                    }
                    else {
                        self.control.set('value', val);
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
            this.options = values;
            var self = this;
            return deferredUtils_1.when(this.control, function () {
                if (self.get('dataType') === 'list') {
                    self.control.set('options', values);
                    self.control.set('value', self.value);
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
});
//# sourceMappingURL=Editor.js.map