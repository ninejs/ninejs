/* global window */
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
define(['../core/extend', './Widget', './Skins/Editor/Default', '../core/deferredUtils', '../modernizer', '../core/array', './utils/setClass', '../core/objUtils', '../core/on', './utils/setText', './utils/append', '../config'], function (extend, Widget, defaultSkin, def, modernizer, array, setClass, objUtils, on, setText, append, config) {
	'use strict';

	var editorConfig = (((config.ninejs || {}).ui || {}).Editor || {}),
		NumberTextBox,
		numberTextBoxDefer,
		timeTextBoxDefer,
		DateTextBox,
		dateTextBoxDefer,
		CheckBox,
		TextBox,
		Select,
		TimeTextBox,
		ControlBase,
		numberTextBoxImpl = editorConfig.NumberTextBox || 'dijit/form/NumberTextBox',
		dateTextBoxImpl = editorConfig.DateTextBox || 'dijit/form/DateTextBox',
		timeTextBoxImpl = editorConfig.TimeTextBox || 'dijit/form/TimeTextBox',
		ENTER = 13;
	ControlBase = extend(Widget, {
		on: function (type, act) {
			this.own(
				on(this.domNode, type, act)
			);
		},
		destroyRecursive: function () {
			this.destroy();
		},
		startup: function () {

		},
		focus: function () {
			this.domNode.focus();
		},
		valueSetter: function (v) {
			this.value = v;
			this.domNode.value = v;
		},
		valueGetter: function () {
			return this.value;
		},
		nameSetter: function (v) {
			this.name = v;
			this.domNode.name = v;
		}
	}, function () {
		var self = this,
			valueField = (this.domNode.type === 'checkbox') ? 'checked' : 'value';
		this.own(
			on(this.domNode, 'change', function () {
				self.set('value', self.domNode[valueField]);
			})
		);
		// on(this.domNode, 'blur', function(e){
		// on.emit(self.domNode, 'blur', e);
		// });
	});
	function getNumberTextBoxConstructor() {
		var NumberTextBox;
		if (!modernizer.inputtypes.number) {
			numberTextBoxDefer = def.defer();
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
			var goodNumber = /^(\+|-)?((\d+(\.\d+)?)|(\.\d+))$/,
				goodPrefix = /^(\+|-)?((\d*(\.?\d*)?)|(\.\d*))$/;
			NumberTextBox = extend(function () {
				this.domNode = window.document.createElement('input');
				this.domNode.type = 'number';
				var self = this,
					previousValue;
				on(this.domNode, 'input,propertyChange', function () {
					if (!goodPrefix.test(this.value)) {
						this.value = previousValue;
					}
					if (!goodNumber.test(this.value)) {
						setClass(self.domNode, 'invalid');
					}
					else {
						setClass(self.domNode, '!invalid');
						previousValue = this.value;
					}
				});
			}, ControlBase, {
				stepSetter: function (p) {
					this.domNode.step = p;
				}
			});
		}
		return NumberTextBox;
	}
	function getDateTextBoxConstructor () {
		var DateTextBox;
		if (!modernizer.inputtypes.date) {
			dateTextBoxDefer = def.defer();
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
			DateTextBox = extend(function () {
				this.domNode = window.document.createElement('input');
				this.domNode.type = 'date';
			}, ControlBase);
		}
		return DateTextBox;
	}
	function getTimeTextBoxConstructor() {
		if (!modernizer.inputtypes.time) {
			timeTextBoxDefer = def.defer();
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
			TimeTextBox = extend(function () {
				this.domNode = window.document.createElement('input');
				this.domNode.type = 'time';
			}, ControlBase);
		}
		return TimeTextBox;
	}
	NumberTextBox = getNumberTextBoxConstructor();
	DateTextBox = getDateTextBoxConstructor();
	CheckBox = extend(function () {
		this.domNode = window.document.createElement('input');
		this.domNode.type = 'checkbox';
		this.domNode.checked = '';
	}, ControlBase, {
		valueSetter: extend.after(function (v) {
			var self = this;
			def.when(this.domNode, function () {
				self.domNode.checked = (!!v)? 'checked' : '';
			});
		})
	});
	TextBox = extend(function () {
		this.domNode = window.document.createElement('input');
		this.domNode.type = 'text';
	}, ControlBase);
	Select = extend(function () {
		this.domNode = window.document.createElement('select');
	}, ControlBase, {
		optionsSetter: function (v) {
			function isValue (val) {
				return (val !== undefined) && (val !== null);
			}
			function getKey (item) {
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
			function getValue (item) {
				var value;
				if (isValue(item.value)) {
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
				array.forEach(v, function (item) {
					var key = getKey(item),
						value = getValue(item),
						opt;
					opt = append.create('option');
					if (key !== '') {
						opt.setAttribute('value', key);
					}
					if (item.selected === true || key === self.get('value')) {
						opt.setAttribute('selected', 'selected');
					}
					setText(append(node, opt), value);
				});
			}
		}
	});
	TimeTextBox = getTimeTextBoxConstructor();

	function getControlSetter (propName) {
		return function (c) {
			var defer,
				self = this;
			if (typeof(c) === 'string') {
				defer = def.defer();
				self[propName] = defer.promise;
				require([c], function (Control) {
					self[propName] = Control;
					defer.resolve(Control);
				});
			}
			else {
				self[propName] = c;
			}
		};
	}

	function toHTML5Date(date) {
		var year = date.getFullYear(), 
			month = date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1, 
			day = date.getDate() < 10 ? '0' + date.getDate() : date.getDate(),
			formated = year + '-' + month + '-' + day;
		return formated;
	}

	return Widget.extend({
		skin: defaultSkin,
		_clearDataTypeClasses : function () {
			var self = this;
			return def.when(this.show(), function () {
				setClass(self.domNode, '!dataType-integer', '!dataType-decimal', '!dataType-date', '!dataType-datetime', '!dataType-boolean', '!dataType-record', '!dataType-alphanumeric', '!dataType-list');
			});
		},
		onUpdatedSkin : extend.after(function () {
			var self = this;
			this.own(
				this.on('blur', function () {
					return self.onBlur.apply(self, arguments);
				})
			);
			this.watch('value', function () {
				self.emit('change', {});
			});
		}),
		dataType : null,
		controlClassSetter: function (v) {
			var self = this;
			return def.when(this.control, function () {
				if (self.control) {
					var arg = v.split(' ');
					arg.unshift(self.control.domNode);
					setClass.apply(null, arg);
				}
				else {
					throw new Error('Please set control\'s dataType property prior to assigning \'controlClass\' property');
				}
			});
		},
		placeholderSetter: function (v) {
			this.placeholder = v;
			var self = this;
			return def.when(this.control, function () {
				if (self.control) {
					self.control.domNode.placeholder = v;
				}
				else {
					throw new Error('Please set control\'s dataType property prior to assigning \'placeholder\' property');
				}
			});
		},
		nameSetter: function (v) {
			this.name = v;
			var self = this;
			return def.when(this.control, function () {
				if (self.control) {
					self.control.set('name', v);
				}
				else {
					throw new Error('Please set control\'s dataType property prior to assigning \'name\' property');
				}
			});
		},
		autocompleteSetter: function (v) {
			var self = this;
			return def.when(this.control, function () {
				if (self.control) {
					self.control.domNode.autocomplete = v;
				}
				else {
					throw new Error('Please set control\'s dataType property prior to assigning \'autocomplete\' property');
				}
			});
		},
		inputTypeSetter: function (v) {
			var self = this;
			return def.when(this.control, function () {
				if (self.control) {
					self.control.domNode.type = v;
				}
				else {
					throw new Error('Please set control\'s dataType property prior to assigning \'inputType\' property');
				}
			});
		},
		requiredSetter: function (v) {
			var self = this;
			return def.when(this.control, function () {
				if (self.control.domNode) {
					if (!!v) {
						self.control.domNode.required = 'required';
					}
					else {
						self.control.domNode.required = null;
					}
				}
				else {
					on.once('updatedSkin', function () {
						if (!!v) {
							self.control.domNode.required = 'required';
						}
						else {
							self.control.domNode.required = null;
						}
					});
				}
			});
		},
		minSetter: function(v) {
			var self = this;
			return def.when(this.control, function () {
				if (self.control) {
					self.control.domNode.min = v;
				}
				else {
					throw new Error('Please set control\'s dataType property prior to assigning \'min\' property');
				}
			});
		},
		maxSetter: function(v) {
			var self = this;
			return def.when(this.control, function () {
				if (self.control) {
					self.control.domNode.max = v;
				}
				else {
					throw new Error('Please set control\'s dataType property prior to assigning \'max\' property');
				}
			});
		},
		maxLengthSetter: function (v) {
			this.maxLength = v; /*The uppercase L is not a typo*/
			var self = this;
			return def.when(this.control, function () {
				if (self.control) {
					self.control.domNode.maxLength = v; /*The uppercase L is not a typo*/
				}
				else {
					throw new Error('Please set control\'s dataType property prior to assigning \'maxlength\' property');
				}
			});
		},
		titleSetter: function (v) {
			this.title = v;
			var self = this;
			return def.when(this.control, function () {
				if (self.control) {
					self.control.domNode.title = v;
				}
				else {
					throw new Error('Please set control\'s dataType property prior to assigning \'title\' property');
				}
			});
		},
		patternSetter: function (v) {
			this.pattern = v;
			var self = this;
			return def.when(this.control, function () {
				if (self.control) {
					self.control.domNode.pattern = v;
				}
				else {
					throw new Error('Please set control\'s dataType property prior to assigning \'pattern\' property');
				}
			});
		},
		SelectControlSetter: getControlSetter('SelectControl'),
		TextBoxControlSetter: getControlSetter('TextBoxControl'),
		CheckBoxControlSetter: getControlSetter('CheckBoxControl'),
		TimeTextBoxControlSetter: getControlSetter('TimeTextBoxControl'),
		DateTextBoxControlSetter: getControlSetter('DateTextBoxControl'),
		NumberTextBoxControlSetter: getControlSetter('NumberTextBoxControl'),
		onBlur: function () {

		},
		bind: function (target, name){
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
		},

		focus: function () {
			var self = this;
			return def.when(this.control, function () {
				if (self.control && (typeof(self.control.focus) === 'function')) {
					self.control.focus();
				}
			});
		},
		/*
		 * "integer", "decimal", "date", "datetime", "boolean", "record", "alphanumeric",
		 * "list"
		 *
		 */
		dataTypeSetter : function (val) {
			var self = this,
				normalKeyDownEventHandler,
				buildNumberTextBox,
				buildDateTextBox,
				buildTextBox,
				buildSelect,
				buildCheckBox,
				buildTimeTextBox;

			normalKeyDownEventHandler = function (e) {
				if (e.keyCode === ENTER) {
					on.emit(this, 'blur', {
						bubbles : true,
						cancellable : true
					});
				}
			};
			function getEventTarget (control) {
				if (control.domNode && control.domNode.localName) {
					return control.domNode;
				}
				return control;
			}

			buildNumberTextBox = function (places) {
				var NumberTextBoxControl = this.NumberTextBoxControl || NumberTextBox;
				var args = {
						places : places,
						step: (typeof(places) === 'number') ? window.Math.pow(0.1, places).toString() : 'any',
						editor : this,
						onKeyDown: normalKeyDownEventHandler,
						intermediateChanges: true
					},
					self = this;
				extend.mixin(args, this.args);
				return def.when(NumberTextBoxControl, function (NumberTextBoxControl) {
					var control = new NumberTextBoxControl(args);
					self.own(
						on(getEventTarget(control), 'blur', function (e) {
							control.editor.emit('blur', e);
						}),
						on(getEventTarget(control), 'input', function (e) {
							control.editor.emit('input', e);
						})
					);
					control.watch('value', function (name, old, newv) {
						/* jshint unused: true */
						self.set('value', newv, true);
					});
					return control;
				});
			};

			buildDateTextBox = function () {
				var DateTextBoxControl = this.DateTextBoxControl || DateTextBox;
				var args = {
						editor : this,

						onBlur : function(e) {
							this.editor.emit('blur', e);
						}
					},
					self = this;
				extend.mixin(args, this.args);
				return def.when(DateTextBoxControl, function (DateTextBoxControl) {
					var control = new DateTextBoxControl(args);
					self.own(
						on(getEventTarget(control), 'blur', function (e) {
							control.editor.emit('blur', e);
						}),
						on(getEventTarget(control), 'input', function (e) {
							control.editor.emit('input', e);
						})
					);
					control.watch('value', function (name, old, newv) {
						/* jshint unused: true */
						self.set('value', newv, true);
					});
					return control;
				});
			};

			buildTimeTextBox = function () {
				var TimeTextBoxControl = this.TimeTextBoxControl || TimeTextBox;
				var args = {
						editor : this,

						onBlur : function(e) {
							this.editor.emit('blur', e);
						}
					},
					self = this;
				extend.mixin(args, this.args);
				return def.when(TimeTextBoxControl, function (TimeTextBoxControl) {
					var control = new TimeTextBoxControl(args);
					self.own(
						on(getEventTarget(control), 'blur', function (e) {
							control.editor.emit('blur', e);
						}),
						on(getEventTarget(control), 'input', function (e) {
							control.editor.emit('input', e);
						})
					);
					control.watch('value', function (name, old, newv) {
						/* jshint unused: true */
						self.set('value', newv, true);
					});
					return control;
				});
			};

			buildCheckBox = function () {
				var CheckBoxControl = this.CheckBoxControl || CheckBox;
				var args = {
						editor : this,
						nullValue : false,

						onBlur : function (e) {
							this.editor.emit('blur', e);
						}
					},
					self = this;
				extend.mixin(args, this.args);
				return def.when(CheckBoxControl, function (CheckBoxControl) {
					var control = new CheckBoxControl(args);
					return def.when(control.show(self.domNode), function () {
						self.own(
							on(getEventTarget(control), 'blur', function (e) {
								control.editor.emit('blur', e);
							})
						);
						control.watch('value', function (name, old, newv) {
							/* jshint unused: true */
							self.set('value', newv, true);
							control.editor.emit('input', { value: self.get('value')});
						});
						return control;
					});
				});
			};

			buildTextBox = function () {
				var TextBoxControl = this.TextBoxControl || TextBox;
				var args = {
						editor: this,
						nullValue: '',
						intermediateChanges: true,
						onKeyDown : normalKeyDownEventHandler,
						onBlur : function (e) {
							this.editor.emit('blur', e);
						}
					},
					self = this;
				extend.mixin(args, this.args);
				return def.when(TextBoxControl, function (TextBoxControl) {
					var control = new TextBoxControl(args);
					self.own(
						on(getEventTarget(control), 'blur', function (e) {
							control.editor.emit('blur', e);
						}),
						on(getEventTarget(control), 'input', function (e) {
							control.editor.emit('input', e);
						})
					);
					control.watch('value', function (name, old, newv) {
						/* jshint unused: true */
						self.set('value', newv, true);
					});
					return control;
				});
			};

			buildSelect = function () {
				var SelectControl = this.SelectControl || Select;
				var args = {
						editor : this,
						options : this.get('options'),

						onBlur : function (e) {
							this.editor.emit('blur', e);
						}
					},
					self = this;
				extend.mixin(args, this.args);
				return def.when(SelectControl, function (SelectControl) {
					var control = new SelectControl(args);
					return def.when(control.show(self.domNode), function () {
						self.own(
							on(getEventTarget(control), 'blur', function (e) {
								control.editor.emit('blur', e);
							}),
							on(getEventTarget(control), 'input', function (e) {
								control.editor.emit('input', e);
							})
						);
						control.watch('value', function (name, old, newv) {
							/* jshint unused: true */
							self.set('value', newv, true);
						});
						return control;
					});
				});
			};

			if (val && (val !== this.dataType)) {
				if (this.control) {
					if (typeof (this.control.destroy) === 'function') {
						this.control.destroy();
					}
					else if (typeof (this.control.destroyRecursive) === 'function') {
						this.control.destroyRecursive(false);
					}
				}
				this.control = def.defer();
				var p = def.when(this._clearDataTypeClasses(), function () {
					setClass(self.domNode, ('dataType-' + val));

					var controlMap = {
						'integer' : function () {
							return buildNumberTextBox.apply(self, [0]);
						},
						'decimal' : buildNumberTextBox,
						'date' : buildDateTextBox,
						'time' : buildTimeTextBox,
						'datetime' : buildTimeTextBox,
						'boolean' : buildCheckBox,
						'record' : buildTextBox,
						'alphanumeric' : buildTextBox,
						'list' : buildSelect
					};
					return def.when(controlMap[val].apply(self), function (ctrl) {
						var controlPromise = self.control;
						if (self.control && (self.control.startup || self.control.show)) {
							self.control.destroy();
							setText.emptyNode(self.domNode);
						}
						self.control = ctrl;
						if (typeof(controlPromise.resolve) === 'function') {
							controlPromise.resolve(ctrl);
						}

						(self.control.startup || self.control.show).call(self.control);
						append(self.domNode, self.control.domNode);
					});
				});

				this.dataType = val;
				return p;
			}
		},

		nullValueSetter: function (val) {
			var self = this;
			return def.when(this.control, function () {
				if (self.control) {
					self.control.nullValue = val;
				}
			});
		},

		valueSetter : function (val, stopPropagate) {
			var self = this;
			if ((val === null) && this.control && (this.control.nullValue !== undefined) && (this.control.nullValue !== null)){
				val = this.control.nullValue;
				this.value = val;
				this.set('value', val, true);
			}
			else {
				if ((this.dataType === 'boolean') && (objUtils.isString(val))) {
					val = val.toLowerCase() !== 'false';
				}
				this.value = val;
			}
			return def.when(this.control, function () {
				if (!stopPropagate) {
					var dataType = self.get('dataType'), implied;
					//special case for number values

					if (!self.control) {
						self.set('dataType', self.get('dataType'));
						//It may happen, don't look at me like that
					}

					if ((dataType === 'integer') || (dataType === 'decimal')) {
						implied = val;
						if (val && objUtils.isString(val)) {
							implied = val * 1;
						}
						self.control.set('value', implied);
					}
//					else if (dataType === 'boolean') {
//						self.control.set('checked', !!val);
//					}
					else if (dataType === 'date' && Object.prototype.toString.call(val) === '[object Date]') {
						self.control.set('value', toHTML5Date(val));
					}
					else {
						self.control.set('value', val);
					}
				}
			});
		},

		optionsSetter : function (values) {
			this.options = values;
			var self = this;
			return def.when(this.control, function () {
				if (self.get('dataType') === 'list') {
					self.control.set('options', values);
					self.control.set('value', self.value);
				}
			});
		}
	}, function () {
		this.control = def.defer();
	});
});
