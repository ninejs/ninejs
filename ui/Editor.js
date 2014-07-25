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

	var NumberTextBox,
		numberTextBoxDefer,
		timeTextBoxDefer,
		DateTextBox,
		dateTextBoxDefer,
		CheckBox,
		TextBox,
		Select,
		TimeTextBox,
		ControlBase,
		numberTextBoxImpl = ((config.ui || {}).Editor || {}).NumberTextBox || 'dijit/form/NumberTextBox',
		dateTextBoxImpl = ((config.ui || {}).Editor || {}).DateTextBox || 'dijit/form/DateTextBox',
		timeTextBoxImpl = ((config.ui || {}).Editor || {}).TimeTextBox || 'dijit/form/TimeTextBox',
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
	function getTimeTextBoxConstructor() {
		if (!modernizer.inputtypes.time) {
			timeTextBoxDefer = def.defer();
			TimeTextBox = timeTextBoxDefer.promise;
			require([timeTextBoxImpl], function (C) {
				TimeTextBox = C;
				timeTextBoxDefer.resolve(C);
				timeTextBoxDefer = null;
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
	if (!modernizer.inputtypes.date) {
		dateTextBoxDefer = def.defer();
		DateTextBox = dateTextBoxDefer.promise;
		require([dateTextBoxImpl], function (C) {
			DateTextBox = C;
			dateTextBoxDefer.resolve(C);
			dateTextBoxDefer = null;
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
	CheckBox = extend(function () {
		this.domNode = window.document.createElement('input');
		this.domNode.type = 'check';
		this.domNode.value = 'true';
	}, ControlBase);
	TextBox = extend(function () {
		this.domNode = window.document.createElement('input');
		this.domNode.type = 'text';
	}, ControlBase);
	Select = extend(function () {
		this.domNode = window.document.createElement('select');
	}, ControlBase, {
		optionsSetter: function (v) {
			var node = this.domNode;
			setText.emptyNode(node);
			if (v) {
				array.forEach(v, function (item) {
					var key,
						value,
						opt;
					if ((item.key !== undefined) && (item.key !== null)) {
						key = item.key;
					}
					else if ((item.value !== undefined) && (item.value !== null)) {
						key = item.value;
					}
					else {
						key = item;
					}
					if ((item.value !== undefined) && (item.value !== null)) {
						value = item.value;
					}
					else {
						value = item;
					}

					opt = setText(append(node, 'option'), value);
					opt.setAttribute('value', key);
				});
			}
		}
	});
	TimeTextBox = getTimeTextBoxConstructor();

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
			if (this.control) {
				var arg = v.split(' ');
				arg.unshift(this.control.domNode);
				setClass.apply(null, arg);
			}
			else {
				throw new Error('Please set control\'s dataType property prior to assigning \'controlClass\' property');
			}
		},
		placeholderSetter: function (v) {
			this.placeholder = v;
			if (this.control) {
				this.control.domNode.placeholder = v;
			}
			else {
				throw new Error('Please set control\'s dataType property prior to assigning \'placeholder\' property');
			}
		},
		placeholderGetter: function () {
			return this.placeholder;
		},
		nameSetter: function (v) {
			this.name = v;
			if (this.control) {
				this.control.set('name', v);
			}
			else {
				throw new Error('Please set control\'s dataType property prior to assigning \'name\' property');
			}
		},
		autocompleteSetter: function (v) {
			if (this.control) {
				this.control.domNode.autocomplete = v;
			}
			else {
				throw new Error('Please set control\'s dataType property prior to assigning \'autocomplete\' property');
			}
		},
		passwordSetter: function (v) {
			if (this.control) {
				if (this.get('dataType') === 'alphanumeric') {
					if (!!v) {
						this.control.domNode.type = 'password';
					}
					else {
						this.control.domNode.type = 'text';
					}
				}
				else {
					throw new Error('Can only assign \'password\' property when \'dataType\' = \'alphanumeric\'');
				}
			}
			else {
				throw new Error('Please set control\'s dataType property prior to assigning \'password\' property');
			}
		},
		requiredSetter: function (v) {
			if (this.domNode) {
				if (!!v) {
					this.domNode.required = 'required';
				}
				else {
					this.domNode.required = null;
				}
			}
			else {
				var self = this;
				on.once('updatedSkin', function () {
					if (!!v) {
						self.domNode.required = 'required';
					}
					else {
						self.domNode.required = null;
					}
				});
			}
		},

		onBlur : function () {

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

		focus : function () {
			if (this.control && (typeof(this.control.focus) === 'function')) {
				this.control.focus();
			}
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
						on((control.domNode || control), 'blur', function (e) {
							control.editor.emit('blur', e);
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
						on((control.domNode || control), 'blur', function (e) {
							control.editor.emit('blur', e);
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
						on((control.domNode || control), 'blur', function (e) {
							control.editor.emit('blur', e);
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
				var control = new CheckBoxControl(args);
				self.own(
					on((control.domNode || control), 'blur', function (e) {
						control.editor.emit('blur', e);
					})
				);
				control.watch('value', function (name, old, newv) {
					/* jshint unused: true */
					self.set('value', newv, true);
				});
				return control;
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
				var control = new TextBoxControl(args);
				self.own(
					on((control.domNode || control), 'blur', function (e) {
						control.editor.emit('blur', e);
					})
				);
				control.watch('value', function (name, old, newv) {
					/* jshint unused: true */
					self.set('value', newv, true);
				});
				return control;
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
				var control = new SelectControl(args);
				self.own(
					on((control.domNode || control), 'blur', function (e) {
						control.editor.emit('blur', e);
					})
				);
				control.watch('value', function (name, old, newv) {
					/* jshint unused: true */
					self.set('value', newv, true);
				});
				return control;
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
				this.control = null;
				def.when(this._clearDataTypeClasses(), function () {
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

					def.when(controlMap[val].apply(self), function (ctrl) {
						self.control = ctrl;

						self.control.startup();
						append(self.domNode, self.control.domNode);
					});
				});

				this.dataType = val;
			}
		},

		nullValueSetter: function (val) {
			if (this.control) {
				this.control.nullValue = val;
			}
		},

		valueSetter : function (val, stopPropagate) {
			var undef = (function (u){ return u; }());
			if ((val === null) && this.control && (this.control.nullValue !== undef) && (this.control.nullValue !== null)){
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

			if (!stopPropagate) {
				var dataType = this.get('dataType'), implied;
				//special case for number values

				if (!this.control) {
					this.set('dataType', this.get('dataType'));
					//It may happen, don't look at me like that
				}

				if ((dataType === 'integer') || (dataType === 'decimal')) {
					implied = val;
					if (val && objUtils.isString(val)) {
						implied = val * 1;
					}
					this.control.set('value', implied);
				} else if (dataType === 'boolean') {
					this.control.set('checked', !!val);
				} else {
					this.control.set('value', val);
				}
			}
		},

		optionsSetter : function (values) {
			this.options = values;
			if (this.get('dataType') === 'list') {
				this.control.set('options', values);
				this.control.set('value', this.value);
			}
		}
	});
});
