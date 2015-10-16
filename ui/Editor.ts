import Widget from './Widget'
import extend from '../core/extend'
import Properties from '../core/ext/Properties'
import defaultSkin from './Skins/Editor/Default'
import { defer, when, isPromise, PromiseConstructorType, PromiseType } from '../core/deferredUtils'
import modernizer from '../modernizer'
import { forEach } from '../core/array'
import { isString } from '../core/objUtils'
import { default as on, RemovableType } from '../core/on'
import { setText, setClass, append } from './utils/domUtils'
import config from '../config'

declare var require: any;

/**
 *
 * @author   Eduardo Burgos
 * @version  0.1
 *
 * @id Editor
 * @alias Editor
 * @classDescription Widget used to change the edit control depending on the
 * dataType.
 * @return {ninejs/ui/Editor}   Returns a new Editor.
 * @constructor
 */

var editorConfig: any = (((config.ninejs || {}).ui || {}).Editor || {}),
	NumberTextBox: any,
	numberTextBoxDefer: PromiseConstructorType,
	timeTextBoxDefer: PromiseConstructorType,
	DateTextBox: any,
	dateTextBoxDefer: PromiseConstructorType,
	TimeTextBox: any,
	numberTextBoxImpl: string = editorConfig.NumberTextBox || 'dijit/form/NumberTextBox',
	dateTextBoxImpl: string = editorConfig.DateTextBox || 'dijit/form/DateTextBox',
	timeTextBoxImpl: string = editorConfig.TimeTextBox || 'dijit/form/TimeTextBox',
	ENTER = 13;
var pad = '00';
function padTime(str: string) {
	return pad.substring(0, pad.length - str.length) + str;
}
/**
 * Parse a time in nearly any format
 * @param {string} time - Anything like 1 p, 13, 1:05 p.m., etc.
 * @returns {Date} - Date object for the current date and time set to parsed time
 */
function parseTime(time: string) : Date {
	var b = time.match(/\d+/g);

	// return undefined if no matches
	if (!b) {
		return undefined;
	}

	var d = new Date();
	let b0 = parseInt(b[0], 10),
		b1 = parseInt(b[1], 10),
		b2 = parseInt(b[2], 10);
	d.setHours(b0 >= 12? b0 : b0 % 12 + (/p/i.test(time)? 12 : 0), // hours
		/\d/.test(b[1])? b1 : 0,     // minutes
		/\d/.test(b[2])? b2 : 0);    // seconds
	return d;
}


export class ControlBase extends Widget {
	value: any;
	name: string;
	on (type: string, action: (e?: any) => any, persistEvent?: boolean): RemovableType {
		let handler = on(this.domNode, type, action, false);
		this.own(
			handler
		);
		return handler;
	}
	destroyRecursive () {
		this.destroy();
	}
	startup () {

	}
	focus () {
		this.domNode.focus();
	}
	valueSetter (v: any) {
		if (v && (this.domNode.type === 'time')) {
			var d = new Date(v);
			if (isNaN(d.valueOf())) {
				d = parseTime(v);
			}
			v = padTime('' + d.getHours()) + ':' + padTime('' + d.getMinutes()) + ':' + padTime('' + d.getSeconds());
		}
		this.value = v;
		this.domNode.value = v;
	}
	valueGetter () {
		return this.value;
	}
	nameSetter (v: string) {
		this.name = v;
		this.domNode.name = v;
	}
	constructor (args: any) {
		super(args);
		var valueField = (this.domNode.type === 'checkbox') ? 'checked' : 'value';
		this.own(
			on(this.domNode, 'change', () => {
				this.set('value', this.domNode[valueField]);
			})
		);
	}
}
var goodNumber = /^(\+|-)?((\d+(\.\d+)?)|(\.\d+))$/,
	goodPrefix = /^(\+|-)?((\d*(\.?\d*)?)|(\.\d*))$/;
export class NativeNumberTextBox extends ControlBase {
	stepSetter (p: number) {
		this.domNode.step = p;
	}
	constructor (args: any) {
		this.domNode = append.create('input');
		this.domNode.type = 'number';
		var previousValue: number;
		on(this.domNode, 'input,propertyChange', () => {
			if (!goodPrefix.test(this.value)) {
				this.value = previousValue;
			}
			if (!goodNumber.test(this.value)) {
				setClass(this.domNode, 'invalid');
			}
			else {
				setClass(this.domNode, '!invalid');
				previousValue = this.value;
			}
		});
		super(args);
	}
}
function getNumberTextBoxConstructor() {
	var NumberTextBox: any;
	if (!modernizer['inputtypes'].number) {
		numberTextBoxDefer = defer();
		NumberTextBox = numberTextBoxDefer.promise;
		require([numberTextBoxImpl], function (C: any) {
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
function toHTML5Date(date: Date) {
	var year = date.getUTCFullYear(),
		month = date.getUTCMonth() + 1 < 10 ? '0' + (date.getUTCMonth() + 1) : date.getUTCMonth() + 1,
		day = date.getUTCDate() < 10 ? '0' + date.getUTCDate() : date.getUTCDate(),
		formated = year + '-' + month + '-' + day;
	return formated;
}
export class NativeDateTextBox extends ControlBase {
	constructor (args: any) {
		this.domNode = append.create('input');
		this.domNode.type = 'date';
		super(args);
	}
	valueSetter (val: any) {
		if (Object.prototype.toString.call(val) === '[object Date]') {
			this.value = val;
			this.domNode.value = toHTML5Date(val);
		}
		else {
			this.value = new Date(val);
			this.domNode.value = val;
		}
	}
}
function getDateTextBoxConstructor () {
	var DateTextBox: any;
	if (!modernizer['inputtypes'].date) {
		dateTextBoxDefer = defer();
		DateTextBox = dateTextBoxDefer.promise;
		setTimeout(function () {
			require([dateTextBoxImpl], function (C: any) {
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
export class NativeTimeTextBox extends ControlBase {
	constructor (args: any) {
		this.domNode = append.create('input');
		this.domNode.type = 'time';
		super(args);
	}
}
function getTimeTextBoxConstructor() {
	if (!modernizer['inputtypes'].time) {
		timeTextBoxDefer = defer();
		TimeTextBox = timeTextBoxDefer.promise;
		setTimeout(function () {
			require([timeTextBoxImpl], function (C: any) {
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
export class NativeCheckBox extends ControlBase {
	constructor (args: any) {
		this.domNode = append.create('input');
		this.domNode.type = 'checkbox';
		this.domNode.checked = '';
		super(args);
	}
	valueSetter (v: boolean) {
		super.valueSetter(v);
		var self = this;
		when(this.domNode, function () {
			self.domNode.checked = (v)? 'checked' : '';
		});
	}
}
export class NativeTextBox extends ControlBase {
	constructor (args: any) {
		this.domNode = append.create('input');
		this.domNode.type = 'text'
		super(args);
	}
}
export class NativeSelect extends ControlBase {
	constructor (args: any) {
		this.domNode = append.create('select');
		super(args);
	}
	optionsSetter (v: any[]) {
		function isValue (val: any) {
			return (val !== undefined) && (val !== null);
		}
		function getKey (item: any) {
			var key: string;
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
		function getValue (item: any) {
			var value: string;
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
		var node = this.domNode,
			self = this;
		setText.emptyNode(node);
		if (v) {
			forEach(v, function (item) {
				var key = getKey(item),
					value = getValue(item),
					opt: HTMLElement;

				opt = append.create('option');
				opt.setAttribute('value', key);

				if (item.disabled === true) {
					opt.setAttribute('disabled', 'disabled');
				}

				if (item.selected === true || key === self.get('value')) {
					opt.setAttribute('selected', 'selected');
				}
				setText(append(node, opt), value);
			});
		}
	}
}
TimeTextBox = getTimeTextBoxConstructor();

function getControlSetter (propName: string): (c: any) => void {
	return function (c: any) {
		var self = this;
		if (typeof(c) === 'string') {
			let deferred = defer();
			self[propName] = deferred.promise;
			require([c], function (Control: any) {
				self[propName] = Control;
				deferred.resolve(Control);
			});
		}
		else {
			self[propName] = c;
		}
	};
}

function getEventTarget (control: any) {
	if (control.domNode && control.domNode.localName) {
		return control.domNode;
	}
	return control;
}

let normalKeyDownEventHandler = function (e: any) {
	if (e.keyCode === ENTER) {
		on.emit(this, 'blur', {
			bubbles : true,
			cancellable : true
		});
	}
};

let buildNumberTextBox = function (self: Editor, places?: number) {
	var NumberTextBoxControl = self.NumberTextBoxControl || NumberTextBox;
	var args = {
			places : places,
			step: (typeof(places) === 'number') ? Math.pow(0.1, places).toString() : 'any',
			editor : self,
			onKeyDown: normalKeyDownEventHandler,
			intermediateChanges: true
		};
	extend.mixin(args, self.args);
	return when(NumberTextBoxControl, function (NumberTextBoxControl) {
		var control = new NumberTextBoxControl(args);
		self.own(
			on(getEventTarget(control), 'blur', function (e) {
				control.editor.emit('blur', e);
			}),
			on(getEventTarget(control), 'input', function (e) {
				control.editor.emit('input', e);
			})
		);
		control.watch('value', function (name: string, old: number, newv: number) {
			/* jshint unused: true */
			self.set('value', newv, true);
		});
		return control;
	});
};

let buildDateTextBox = function (self: Editor) {
	var DateTextBoxControl = self.DateTextBoxControl || DateTextBox;
	var args = {
			editor : self,

			onBlur : function(e: any) {
				this.editor.emit('blur', e);
			}
		};
	extend.mixin(args, self.args);
	return when(DateTextBoxControl, function (DateTextBoxControl) {
		var control = new DateTextBoxControl(args);
		self.own(
			on(getEventTarget(control), 'blur', function (e) {
				control.editor.emit('blur', e);
			}),
			on(getEventTarget(control), 'input', function (e) {
				control.editor.emit('input', e);
			})
		);
		control.watch('value', function (name: string, old: any, newv: any) {
			/* jshint unused: true */
			self.set('value', newv, true);
		});
		return control;
	});
};

let buildTimeTextBox = function (self: Editor) {
	var TimeTextBoxControl = self.TimeTextBoxControl || TimeTextBox;
	var args = {
			editor : self,

			onBlur : function(e: any) {
				this.editor.emit('blur', e);
			}
		};
	extend.mixin(args, self.args);
	return when(TimeTextBoxControl, function (TimeTextBoxControl) {
		var control = new TimeTextBoxControl(args);
		self.own(
			on(getEventTarget(control), 'blur', function (e) {
				control.editor.emit('blur', e);
			}),
			on(getEventTarget(control), 'input', function (e) {
				control.editor.emit('input', e);
			})
		);
		control.watch('value', function (name: string, old: any, newv: any) {
			/* jshint unused: true */
			self.set('value', newv, true);
		});
		return control;
	});
};

let buildCheckBox = function (self: Editor) {
	var CheckBoxControl = self.CheckBoxControl || NativeCheckBox;
	var args = {
			editor : self,
			nullValue : false,

			onBlur : function (e: any) {
				this.editor.emit('blur', e);
			}
		};
	extend.mixin(args, self.args);
	return when(CheckBoxControl, function (CheckBoxControl: { new (args: any): Widget }) {
		var control = new CheckBoxControl(args);
		return when(control.show(self.domNode), function () {
			self.own(
				on(getEventTarget(control), 'blur', function (e: any) {
					control.get('editor').emit('blur', e);
				})
			);
			control.watch('value', function (name, old, newv) {
				/* jshint unused: true */
				self.set('value', newv, true);
				control.get('editor').emit('input', { value: self.get('value')});
			});
			return control;
		});
	});
};

let buildTextBox = function (self: Editor) {
	var TextBoxControl = self.TextBoxControl || NativeTextBox;
	var args = {
			editor: self,
			nullValue: '',
			intermediateChanges: true,
			onKeyDown : normalKeyDownEventHandler,
			onBlur : function (e: any) {
				this.editor.emit('blur', e);
			}
		};
	extend.mixin(args, self.args);
	return when(TextBoxControl, function (TextBoxControl) {
		var control = new TextBoxControl(args);
		self.own(
			on(getEventTarget(control), 'blur', function (e: any) {
				control.editor.emit('blur', e);
			}),
			on(getEventTarget(control), 'input', function (e: any) {
				control.editor.emit('input', e);
			})
		);
		control.watch('value', function (name: string, old: string, newv: string) {
			/* jshint unused: true */
			self.set('value', newv, true);
		});
		return control;
	});
};

let buildSelect = function (self: Editor) {
	var SelectControl = self.SelectControl || NativeSelect;
	var args = {
			editor : self,
			options : self.get('options'),

			onBlur : function (e: any) {
				this.editor.emit('blur', e);
			}
		};
	extend.mixin(args, self.args);
	return when(SelectControl, function (SelectControl) {
		var control = new SelectControl(args);
		return when(control.show(self.domNode), function () {
			self.own(
				on(getEventTarget(control), 'blur', function (e) {
					control.editor.emit('blur', e);
				}),
				on(getEventTarget(control), 'input', function (e) {
					control.editor.emit('input', e);
				})
			);
			control.watch('value', function (name: string, old: any, newv: any) {
				/* jshint unused: true */
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

class Editor extends Widget {
	SelectControlSetter: (c: any) => void;
	TextBoxControlSetter: (c: any) => void;
	CheckBoxControlSetter: (c: any) => void;
	TimeTextBoxControlSetter: (c: any) => void;
	DateTextBoxControlSetter: (c: any) => void;
	NumberTextBoxControlSetter: (c: any) => void;

	NumberTextBoxControl: any;
	DateTextBoxControl: any;
	TimeTextBoxControl: any;
	CheckBoxControl: any;
	TextBoxControl: any;
	SelectControl: any;


	_clearDataTypeClasses () {
		return when(this.show(), () => {
			setClass(this.domNode, '!dataType-integer', '!dataType-decimal', '!dataType-date', '!dataType-datetime', '!dataType-boolean', '!dataType-record', '!dataType-alphanumeric', '!dataType-list');
		});
	}
	onUpdatedSkin () {
		var self = this;
		super.onUpdatedSkin();
		this.own(
			this.on('blur', function () {
				return self.onBlur.apply(self, arguments);
			})
		);
		this.watch('value', () => {
			this.emit('change', {});
		});
	}
	dataType: string;
	control: any;
	placeholder: string;
	maxLength: number;
	title: string;
	pattern: string;
	options: any[];
	value: any;
	controlDefer: PromiseConstructorType;
	args: any;
	name: string;
	controlClassSetter (v: string) {
		var self = this;
		return when(this.control, function () {
			if (self.control) {
				var arg = v.split(' ');
				arg.unshift(self.control.domNode);
				setClass.apply(null, arg);
			}
			else {
				throw new Error('Please set control\'s dataType property prior to assigning \'controlClass\' property');
			}
		});
	}
	placeholderSetter (v: string) {
		this.placeholder = v;
		var self = this;
		return when(this.control, function () {
			if (self.control) {
				self.control.domNode.placeholder = v;
			}
			else {
				throw new Error('Please set control\'s dataType property prior to assigning \'placeholder\' property');
			}
		});
	}
	nameSetter (v: string) {
		this.name = v;
		var self = this;
		return when(this.control, function () {
			if (self.control) {
				self.control.set('name', v);
			}
			else {
				throw new Error('Please set control\'s dataType property prior to assigning \'name\' property');
			}
		});
	}
	autocompleteSetter (v: string) {
		return when(this.control, () => {
			if (this.control) {
				this.control.domNode.autocomplete = v;
			}
			else {
				throw new Error('Please set control\'s dataType property prior to assigning \'autocomplete\' property');
			}
		});
	}
	inputTypeSetter (v: string) {
		var self = this;
		return when(this.control, function () {
			if (self.control) {
				self.control.domNode.type = v;
			}
			else {
				throw new Error('Please set control\'s dataType property prior to assigning \'inputType\' property');
			}
		});
	}
	requiredSetter (v: boolean) {
		return when(this.control, () => {
			if (this.control.domNode) {
				if (!!v) {
					this.control.domNode.required = 'required';
				}
				else {
					this.control.domNode.required = null;
				}
			}
			else {
				on.once(this, 'updatedSkin', function (_: any) {
					if (!!v) {
						this.control.domNode.required = 'required';
					}
					else {
						this.control.domNode.required = null;
					}
				});
			}
		});
	}
	minSetter (v: number) {
		var self = this;
		return when(this.control, function () {
			if (self.control) {
				self.control.domNode.min = v;
			}
			else {
				throw new Error('Please set control\'s dataType property prior to assigning \'min\' property');
			}
		});
	}
	maxSetter (v: number) {
		var self = this;
		return when(this.control, function () {
			if (self.control) {
				self.control.domNode.max = v;
			}
			else {
				throw new Error('Please set control\'s dataType property prior to assigning \'max\' property');
			}
		});
	}
	maxLengthSetter (v: number) {
		this.maxLength = v; /*The uppercase L is not a typo*/
		var self = this;
		return when(this.control, function () {
			if (self.control) {
				self.control.domNode.maxLength = v; /*The uppercase L is not a typo*/
			}
			else {
				throw new Error('Please set control\'s dataType property prior to assigning \'maxlength\' property');
			}
		});
	}
	titleSetter (v: string) {
		this.title = v;
		var self = this;
		return when(this.control, function () {
			if (self.control) {
				self.control.domNode.title = v;
			}
			else {
				throw new Error('Please set control\'s dataType property prior to assigning \'title\' property');
			}
		});
	}
	patternSetter (v: string) {
		this.pattern = v;
		var self = this;
		return when(this.control, function () {
			if (self.control) {
				self.control.domNode.pattern = v;
			}
			else {
				throw new Error('Please set control\'s dataType property prior to assigning \'pattern\' property');
			}
		});
	}
	onBlur () {

	}
	bind (target: Properties, name: string){
		if (target) {
			var self = this;
			this.watch('value', function (pname, oldv, newv){
				/* jshint unused: true */
				target.set(name, newv);
			});
			target.watch(name, function (pname, oldv, newv) {
				/* jshint unused: true */
				self.set('value', newv);
			});
		}
		return this;
	}

	focus () {
		var self = this;
		return when(this.control, function () {
			if (self.control && (typeof(self.control.focus) === 'function')) {
				self.control.focus();
			}
		});
	}
	/*
	 * "integer", "decimal", "date", "datetime", "boolean", "record", "alphanumeric",
	 * "list"
	 *
	 */
	dataTypeSetter (val: string) {
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
			var p = when(this._clearDataTypeClasses(), function (): PromiseType {
				setClass(self.domNode, ('dataType-' + val));

				var controlMap: {
					[ name: string ]: (tgt: Editor) => PromiseType
				} = {
					'integer' : function (self: Editor): PromiseType {
						return buildNumberTextBox(self, 0);
					},
					'decimal' : function (self: Editor) {
						return buildNumberTextBox(self);
					},
					'date' : buildDateTextBox,
					'time' : buildTimeTextBox,
					'datetime' : buildTimeTextBox,
					'boolean' : buildCheckBox,
					'record' : buildTextBox,
					'alphanumeric' : buildTextBox,
					'list' : buildSelect
				};
				return when(controlMap[val](self), function (ctrl: Widget) {
					var controlPromise = self.control;
					if (self.control && (self.control.startup || self.control.show)) {
						self.control.destroy();
						setText.emptyNode(self.domNode);
					}
					self.control = ctrl;
					if (isPromise(controlPromise)) {
						self.controlDefer.resolve(ctrl);
						self.controlDefer = null;
					}

					(self.control.startup || self.control.show).call(self.control);
					append(self.domNode, self.control.domNode);
					return ctrl;
				});
			});

			this.dataType = val;
			return p;
		}
	}

	nullValueSetter (val: any) {
		var self = this;
		return when(this.control, function () {
			if (self.control) {
				self.control.nullValue = val;
			}
		});
	}

	valueSetter (val: any, stopPropagate?: boolean) {
		var self = this;
		if ((val === null) && this.control && (this.control.nullValue !== undefined) && (this.control.nullValue !== null)){
			val = this.control.nullValue;
			this.value = val;
			this.set('value', val, true);
		}
		else {
			if ((this.dataType === 'boolean') && (isString(val))) {
				val = val.toLowerCase() !== 'false';
			}
			this.value = val;
		}
		var setter = function (control: Widget) {
			if (!stopPropagate) {
				var dataType = self.get('dataType'),
					implied: any;
				//special case for number values

				if (!self.control) {
					self.set('dataType', self.get('dataType'));
					//It may happen, don't look at me like that
				}

				if ((dataType === 'integer') || (dataType === 'decimal')) {
					implied = val;
					if (val && isString(val)) {
						implied = val * 1;
					}
					self.control.set('value', implied);
				}
				else {
					self.control.set('value', val);
				}
			}
		};
		if (isPromise(this.control)) {
			return when(this.control, setter);
		}
		else {
			setter(this.control);
		}

	}

	optionsSetter (values: any[]) {
		this.options = values;
		var self = this;
		return when(this.control, function () {
			if (self.get('dataType') === 'list') {
				self.control.set('options', values);
				self.control.set('value', self.value);
			}
		});
	}
	constructor (args: any) {
		this.dataType = null;
		super(args);
		this.controlDefer = defer();
		this.control = this.controlDefer.promise;
	}
}

Editor.prototype.skin = defaultSkin;
Editor.prototype.SelectControlSetter = getControlSetter('SelectControl');
Editor.prototype.TextBoxControlSetter = getControlSetter('TextBoxControl');
Editor.prototype.CheckBoxControlSetter = getControlSetter('CheckBoxControl');
Editor.prototype.TimeTextBoxControlSetter = getControlSetter('TimeTextBoxControl');
Editor.prototype.DateTextBoxControlSetter = getControlSetter('DateTextBoxControl');
Editor.prototype.NumberTextBoxControlSetter = getControlSetter('NumberTextBoxControl');
export { Editor }