'use strict';

import { default as Widget, WidgetConstructor } from './Widget'
import extend from '../core/extend'
import Properties from '../core/ext/Properties'
import defaultSkin from './Skins/Editor/Default'
import { defer, when, resolve, isPromise, PromiseConstructorType } from '../core/deferredUtils'
import modernizer from '../modernizer'
import { forEach } from '../core/array'
import { isString, isHTMLElement, isDate } from '../core/objUtils'
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

export interface EditorWidgetConstructor {
	new (args: any) : Widget & { editor?: Widget };
}

var editorConfig: any = (((config.ninejs || {}).ui || {}).Editor || {}),
	NumberTextBox: any,
	numberTextBoxDefer: PromiseConstructorType<EditorWidgetConstructor>,
	timeTextBoxDefer: PromiseConstructorType<EditorWidgetConstructor>,
	DateTextBox: any,
	dateTextBoxDefer: PromiseConstructorType<EditorWidgetConstructor>,
	TimeTextBox: any,
	numberTextBoxImpl: string = editorConfig.NumberTextBox || 'dijit/form/NumberTextBox',
	dateTextBoxImpl: string = editorConfig.DateTextBox || 'dijit/form/DateTextBox',
	timeTextBoxImpl: string = editorConfig.TimeTextBox || 'dijit/form/TimeTextBox',
	ENTER = 13;
var pad = '00';

let applyToNode = (node: HTMLElement | Promise<HTMLElement>, callback: (node: HTMLElement) => void, self: any) => {
	if (isHTMLElement(node)) {
		return resolve(callback.call(self, node));
	}
	else {
		return when<HTMLElement, any> (node, (domNode: HTMLElement) => {
			return callback.call(self, domNode);
		});
	}
};

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

let focus = (node: HTMLElement) => {
	node.focus();
};

let setName = (node: HTMLElement) => {
	(node as HTMLInputElement).name = this.value;
};

function controlBaseSetValue (node: HTMLElement) {
	let input = node as HTMLInputElement,
		v = this.value;
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

function selectSetValue (node: HTMLElement) {
	let input = node as HTMLSelectElement,
		v = this.value,
		arr: any = input.options;

	when(v, ((v) => {
		for (let cnt = 0; cnt < arr.length; cnt += 1) {
			let opt = arr[cnt];
			opt.selected = (opt.value == v);
		}
		this.self.value = v;
	}));
	return v;
}

function selectGetValue (node: HTMLElement) {
	let input = node as HTMLSelectElement,
		arr: any = input.options;
	for (let cnt = 0; cnt < arr.length; cnt += 1) {
		let opt = arr[cnt];
		if (opt.selected) {
			return opt.value;
		}
	}
	return undefined;
}

function controlBaseOnChange (node: HTMLElement) {
	this.own(
		on(node, 'change', (e) => {
			let node = e.currentTarget;
			if ((node as HTMLInputElement).type === 'checkbox') {
				this.set('value', node.checked);
			}
			else {
				this.set('value', node.value);
			}
		})
	);
};

let setStep = (domNode: HTMLElement) => {
	(domNode as HTMLInputElement).step = this.value + '';
};

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
		applyToNode(this.domNode, focus, this);
	}
	valueSetter (v: any) {
		applyToNode(this.domNode, controlBaseSetValue, { self: this, value: v });
	}
	valueGetter () {
		return this.value;
	}
	nameSetter (v: string) {
		this.name = v;
		return applyToNode(this.domNode, setName, { value: v });
	}
	constructor (args: any, init?: any) {
		super(args, init);
		applyToNode(this.domNode, controlBaseOnChange, this);
	}
}

var goodNumber = /^(\+|-)?((\d+(\.\d+)?)|(\.\d+))$/,
	goodPrefix = /^(\+|-)?((\d*(\.?\d*)?)|(\.\d*))$/;
export class NativeNumberTextBox extends ControlBase {
	stepSetter (p: number) {
		let node = this.domNode;
		applyToNode(node, setStep, { value: p });
	}
	constructor (args: any) {
		let node = append.create('input') as HTMLInputElement;
		node.type = 'number';
		var previousValue: number;
		on(node, 'input,propertyChange', () => {
			if (!goodPrefix.test(this.value)) {
				this.value = previousValue;
			}
			if (!goodNumber.test(this.value)) {
				setClass(node, 'invalid');
			}
			else {
				setClass(node, '!invalid');
				previousValue = this.value;
			}
		});
		let init = { domNode: node };
		super(args, init);
	}
}
function getNumberTextBoxConstructor() {
	var NumberTextBox: any;
	if (!modernizer['inputtypes'].number) {
		numberTextBoxDefer = defer<EditorWidgetConstructor>();
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

let inputSetValue = (domNode: HTMLElement) => {
	(domNode as HTMLInputElement).value = this.value;
};

export class NativeDateTextBox extends ControlBase {
	constructor (args: any) {
		let node = append.create('input') as HTMLInputElement;
		node.type = 'date';
		let init = { domNode: node };
		super(args, init);
	}
	valueSetter (val: any) {
		let value: string,
			node = this.domNode;
		if (isDate(val)) {
			this.value = val;
			value = toHTML5Date(val);
		}
		else {
			this.value = new Date(val);
			value = val;
		}
		applyToNode(node, inputSetValue, { value: value });
	}
}
function getDateTextBoxConstructor () {
	var DateTextBox: any;
	if (!modernizer['inputtypes'].date) {
		dateTextBoxDefer = defer<EditorWidgetConstructor>();
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
		let node = append.create('input') as HTMLInputElement;
		node.type = 'time';
		let init = { domNode: node };
		super(args, init);
	}
}
function getTimeTextBoxConstructor() {
	if (!modernizer['inputtypes'].time) {
		timeTextBoxDefer = defer<EditorWidgetConstructor>();
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
let setChecked = (domNode: HTMLElement) => {
	(domNode as HTMLInputElement).checked = this.value;
};
export class NativeCheckBox extends ControlBase {
	constructor (args: any) {
		let node = append.create('input') as HTMLInputElement;
		node.type = 'checkbox';
		node.checked = false;
		let init = { domNode: node };
		super(args, init);
	}
	valueSetter (v: boolean) {
		super.valueSetter(v);
		applyToNode(this.domNode, setChecked, { value: v });
	}
}
export class NativeTextBox extends ControlBase {
	constructor (args: any) {
		let node = append.create('input') as HTMLInputElement;
		node.type = 'text';
		let init: any = {};
		init.domNode = node;
		super(args, init);
	}
}

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

let setOptions = function (domNode: HTMLElement) {
	var node = domNode,
		self = this.self,
		v = this.value;
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
};

export class NativeSelect extends ControlBase {
	constructor (args: any) {
		let init: any = {};
		init.domNode = append.create('select');
		super(args, init);
	}
	optionsSetter (v: any[]) {
		applyToNode(this.domNode, setOptions, { self: this, value: v });
	}
	valueSetter (v: any) {
		applyToNode(this.domNode, selectSetValue, { self: this, value: v });
	}
	valueGetter () {
		return selectGetValue.call({ self: this }, this.domNode);
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
	return when<EditorWidgetConstructor, Widget>(TimeTextBoxControl, function (TimeTextBoxControl) {
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
		return when (self.domNode, (domNode: HTMLElement) => {
			return when<HTMLElement, Widget>(control.show(domNode), function () {
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
	return when<EditorWidgetConstructor, Widget>(SelectControl, function (SelectControl: EditorWidgetConstructor) {
		var control = new SelectControl(args);
		return when<HTMLElement, Widget>(self.domNode, (domNode: HTMLElement) => {
			return when<HTMLElement, Widget>(control.show(domNode), (domNode: HTMLElement) => {
				self.own(
					on(getEventTarget(control), 'blur', function (e) {
						control['editor'].emit('blur', e);
					}),
					on(getEventTarget(control), 'input', function (e) {
						control['editor'].emit('input', e);
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
	});
};

let editorFunctions = {
	clearDataTypeClasses: (domNode: HTMLElement) => {
		setClass(domNode, '!dataType-integer', '!dataType-decimal', '!dataType-date', '!dataType-datetime', '!dataType-boolean', '!dataType-record', '!dataType-alphanumeric', '!dataType-list');
	}
};

class Editor extends Widget {
	SelectControlSetter: (c: any) => void;
	TextBoxControlSetter: (c: any) => void;
	CheckBoxControlSetter: (c: any) => void;
	TimeTextBoxControlSetter: (c: any) => void;
	DateTextBoxControlSetter: (c: any) => void;
	NumberTextBoxControlSetter: (c: any) => void;

	NumberTextBoxControl: EditorWidgetConstructor | Promise<EditorWidgetConstructor>;
	DateTextBoxControl: EditorWidgetConstructor | Promise<EditorWidgetConstructor>;
	TimeTextBoxControl: EditorWidgetConstructor | Promise<EditorWidgetConstructor>;
	CheckBoxControl: EditorWidgetConstructor | Promise<EditorWidgetConstructor>;
	TextBoxControl: EditorWidgetConstructor | Promise<EditorWidgetConstructor>;
	SelectControl: EditorWidgetConstructor | Promise<EditorWidgetConstructor>;


	_clearDataTypeClasses () {
		return when(this.show(), editorFunctions.clearDataTypeClasses);
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
	control: Widget | Promise<Widget>;
	placeholder: string;
	maxLength: number;
	title: string;
	pattern: string;
	options: any[];
	value: any;
	controlDefer: PromiseConstructorType<Widget>;
	args: any;
	name: string;

	min: number;
	max: number;
	required: boolean;
	autocomplete: boolean;
	controlClassSetter (v: string) {
		return when(this.control, function (control: Widget) {
			if (control) {
				return when (control.domNode, (domNode: HTMLElement) => {
					var arg: any[] = v.split(' ');
					arg.unshift(domNode);
					setClass.apply(null, arg);
				});
			}
			else {
				throw new Error('Please set control\'s dataType property prior to assigning \'controlClass\' property');
			}
		});
	}
	placeholderSetter (v: string) {
		this.placeholder = v;
		return when(this.control, function (control: Widget) {
			if (control) {
				return when(control.domNode, (domNode) => {
					let node: any = domNode;
					node.placeholder = v;
				});
			}
			else {
				throw new Error('Please set control\'s dataType property prior to assigning \'placeholder\' property');
			}
		});
	}
	nameSetter (v: string) {
		this.name = v;
		return when(this.control, function (control: Widget) {
			if (control) {
				control.set('name', v);
			}
			else {
				throw new Error('Please set control\'s dataType property prior to assigning \'name\' property');
			}
		});
	}
	autocompleteSetter (v: boolean) {
		this.autocomplete = v;
		return when(this.control, (control: Widget) => {
			if (this.control) {
				return when (control.domNode, (domNode) => {
					let node: any = domNode;
					node.autocomplete = v;
				});
			}
			else {
				throw new Error('Please set control\'s dataType property prior to assigning \'autocomplete\' property');
			}
		});
	}
	inputTypeSetter (v: string) {
		return when(this.control, function (control: Widget) {
			if (control) {
				return when(control.domNode, (domNode) => {
					let node: any = domNode;
					node.type = v;
				});
			}
			else {
				throw new Error('Please set control\'s dataType property prior to assigning \'inputType\' property');
			}
		});
	}
	requiredSetter (v: boolean) {
		this.required = v;
		return when(this.control, (control: Widget) => {
			if (control) {
				return when(control.domNode, (domNode) => {
					let node: any = domNode;
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
	}
	minSetter (v: number) {
		this.min = v;
		return when(this.control, function (control: Widget) {
			if (control) {
				return when(control.domNode, (domNode) => {
					let node: any = domNode;
					node.min = v;
				});
			}
			else {
				throw new Error('Please set control\'s dataType property prior to assigning \'min\' property');
			}
		});
	}
	maxSetter (v: number) {
		this.max = v;
		return when(this.control, function (control: Widget) {
			if (control) {
				return when(control.domNode, (domNode) => {
					let node: any = domNode;
					node.max = v;
				});
			}
			else {
				throw new Error('Please set control\'s dataType property prior to assigning \'max\' property');
			}
		});
	}
	maxLengthSetter (v: number) {
		this.maxLength = v; /*The uppercase L is not a typo*/
		return when(this.control, function (control: Widget) {
			if (control) {
				return when(control.domNode, (domNode: HTMLElement) => {
					let node: any = domNode;
					node.maxLength = v; /*The uppercase L is not a typo*/
				});
			}
			else {
				throw new Error('Please set control\'s dataType property prior to assigning \'maxlength\' property');
			}
		});
	}
	titleSetter (v: string) {
		this.title = v;
		return when(this.control, function (control: Widget) {
			if (control) {
				return when(control.domNode, (domNode: HTMLElement) => {
					let node: any = domNode;
					node.title = v;
				});
			}
			else {
				throw new Error('Please set control\'s dataType property prior to assigning \'title\' property');
			}
		});
	}
	patternSetter (v: string) {
		this.pattern = v;
		return when(this.control, function (control: Widget) {
			if (control) {

				return when(control.domNode, function (domNode: HTMLElement) {
					let node: any = domNode;
					node.pattern = v;
				});
			}
			else {
				throw new Error('Please set control\'s dataType property prior to assigning \'pattern\' property');
			}
		});
	}
	onBlur () {

	}
	bind (target: Properties, name: string) : Editor {
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
		return when(this.control, function (control: Widget) {
			let ctrl: any = control;
			if (ctrl && (typeof(ctrl.focus) === 'function')) {
				ctrl.focus();
			}
		});
	}
	/*
	 * "integer", "decimal", "date", "datetime", "boolean", "record", "alphanumeric",
	 * "list"
	 *
	 */
	dataTypeSetter (val: string) {
		var self = this,
			domNode = this.domNode as HTMLElement;

		return when (this.domNode, (domNode: HTMLElement) => {
			if (val && (val !== this.dataType)) {
				let ctrl: any = this.control;
				if (ctrl) {
					if (typeof (ctrl.destroy) === 'function') {
						ctrl.destroy();
					}
					else if (typeof (ctrl.destroyRecursive) === 'function') {
						ctrl.destroyRecursive(false);
					}
				}
				var p = when(this._clearDataTypeClasses(), function (): Promise<Widget> {
					setClass(domNode, ('dataType-' + val));

					var controlMap: {
						[ name: string ]: (tgt: Editor) => Promise<Widget>
					} = {
						'integer' : function (self: Editor): Promise<Widget> {
							return buildNumberTextBox(self, 0);
						},
						'decimal' : function (self: Editor): Promise<Widget> {
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
						let controlPromise = self.control,
							anyControl: any = self.control;
						if (anyControl && (anyControl.startup || anyControl.show)) {
							anyControl.destroy();
							setText.emptyNode(domNode);
						}
						self.control = ctrl;
						anyControl = ctrl;
						if (isPromise(controlPromise)) {
							self.controlDefer.resolve(ctrl);
							self.controlDefer = null;
						}

						(anyControl.startup || ctrl.show).call(ctrl);
						return when(ctrl.domNode, (controlDomNode: HTMLElement) => {
							append(domNode, controlDomNode);
							return ctrl;
						});
					});
				});

				this.dataType = val;
				return p;
			}
		});
	}

	nullValueSetter (val: any) {
		var self = this;
		return when(this.control, function (control: Widget) {
			let ctrl: any = control;
			if (ctrl) {
				ctrl.nullValue = val;
			}
		});
	}

	valueSetter (val: any, stopPropagate?: boolean) {
		var self = this,
			control: any = this.control;
		if ((val === null) && control && (control.nullValue !== undefined) && (control.nullValue !== null)){
			val = control.nullValue;
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
					control.set('value', implied);
				}
				else {
					control.set('value', val);
				}
			}
		};
		if (isPromise(this.control)) {
			return when(this.control, setter);
		}
		else {
			setter(this.control as Widget);
		}

	}

	optionsSetter (values: any[]) {
		this.options = values;
		var self = this;
		return when(this.control, (control: Widget) => {
			if (this.get('dataType') === 'list') {
				control.set('options', values);
				control.set('value', self.value);
			}
		});
	}
	constructor (args: any) {
		super(args);
		this.set('skin', defaultSkin);
		this.controlDefer = defer<Widget>();
		this.control = this.controlDefer.promise;
	}
}
Editor.prototype.dataType = null;
Editor.prototype.skin = defaultSkin;
Editor.prototype.SelectControlSetter = getControlSetter('SelectControl');
Editor.prototype.TextBoxControlSetter = getControlSetter('TextBoxControl');
Editor.prototype.CheckBoxControlSetter = getControlSetter('CheckBoxControl');
Editor.prototype.TimeTextBoxControlSetter = getControlSetter('TimeTextBoxControl');
Editor.prototype.DateTextBoxControlSetter = getControlSetter('DateTextBoxControl');
Editor.prototype.NumberTextBoxControlSetter = getControlSetter('NumberTextBoxControl');
export { Editor }
export default Editor