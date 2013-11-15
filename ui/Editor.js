/* jshint strict: false, unused: true */
 /**
 * @projectDescription   Expression Builder control.
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
define(['dojo/_base/declare', 'dijit/_WidgetBase', 'dijit/form/Select', 'dijit/form/NumberTextBox', 'dijit/form/DateTextBox', 'dijit/form/TimeTextBox', 'dijit/form/CheckBox', 'dijit/form/TextBox', './utils/setClass', 'dojo/dom-construct', 'dojo/_base/lang', 'dojo/on', 'dijit/focus', 'dojo/keys'], function(declare, WidgetBase, Select, NumberTextBox, DateTextBox, TimeTextBox, CheckBox, TextBox, setClass, domConstruct, lang, on, focus, keys) {

	return declare([WidgetBase], {
		_clearDataTypeClasses : function() {
			setClass(this.domNode, '!dataType-integer', '!dataType-decimal', '!dataType-date', '!dataType-datetime', '!dataType-boolean', '!dataType-record', '!dataType-alphanumeric', '!dataType-list');
		},
		postCreate : function() {
			this.inherited(arguments);
			setClass(this.domNode, 'weEditor');
		},
		dataType : null,

		onBlur : function() {

		},
		bind: function(target, name){
			if (target) {
				var self = this;
				this.watch('value', function(pname, oldv, newv){
					target.set(name, newv);
				});
				target.watch(name, function(pname, oldv, newv) {
					self.set('value', newv);
				});
			}
			return this;
		},

		focus : function() {
			if (this.control) {
				this.control.focus();
			}
		},
		/*
		 * "integer", "decimal", "date", "datetime", "boolean", "record", "alphanumeric",
		 * "list"
		 *
		 */
		_setDataTypeAttr : function(val) {

			function normalKeyDownEventHandler(e) {
				if (e.keyCode === keys.ENTER) {
					on.emit(this, 'Blur', {
						bubbles : true,
						cancellable : true
					});
					focus.curNode.blur();
				}
			}

			function buildNumberTextBox(places) {
				var NumberTextBoxControl = this.NumberTextBoxControl || NumberTextBox;
				var args = {
					places : places,
					editor : this,
					onKeyDown: normalKeyDownEventHandler,
					intermediateChanges: true,
					onBlur: function() {
						this.editor.onBlur();
					}
				};
				lang.mixin(args, this.args);
				var control = new NumberTextBoxControl(args);

				control.watch('value', lang.hitch(this, function(name, old, newv) {
					this.set('value', newv, true);
				}));
				return control;
			}

			function buildDateTextBox() {
				var DateTextBoxControl = this.DateTextBoxControl || DateTextBox;
				var args = {
					editor : this,

					onBlur : function() {
						this.editor.onBlur();
					}
				};
				lang.mixin(args, this.args);
				var control = new DateTextBoxControl(args);
				control.watch('value', lang.hitch(this, function(name, old, newv) {
					this.set('value', newv, true);
				}));
				return control;
			}

			function buildTimeTextBox() {
				var TimeTextBoxControl = this.TimeTextBoxControl || TimeTextBox;
				var args = {
					editor : this,

					onBlur : function() {
						this.editor.onBlur();
					}
				};
				lang.mixin(args, this.args);
				var control = new TimeTextBoxControl(args);
				control.watch('value', lang.hitch(this, function(name, old, newv) {
					this.set('value', newv, true);
				}));
				return control;
			}

			function buildCheckBox() {
				var CheckBoxControl = this.CheckBoxControl || CheckBox;
				var args = {
					editor : this,
					nullValue : false,

					onBlur : function() {
						this.editor.onBlur();
					}
				};
				lang.mixin(args, this.args);
				var control = new CheckBoxControl(args);
				control.watch('checked', lang.hitch(this, function(name, old, newv) {
					this.set('value', newv, true);
				}));
				return control;
			}

			function buildTextBox() {
				var TextBoxControl = this.TextBoxControl || TextBox;
				var args = {
					editor: this,
					nullValue: '',
					intermediateChanges: true,
					onKeyDown : normalKeyDownEventHandler,
					onBlur : function() {
						this.editor.onBlur();
					}
				};
				lang.mixin(args, this.args);
				var control = new TextBoxControl(args);
				control.watch('value', lang.hitch(this, function(name, old, newv) {
					this.set('value', newv, true);
				}));
				return control;
			}

			function buildSelect() {
				var SelectControl = this.SelectControl || Select;
				var args = {
					editor : this,
					options : this.get('options'),

					onBlur : function() {
						this.editor.onBlur();
					}
				};
				lang.mixin(args, this.args);
				var control = new SelectControl(args);
				control.watch('value', lang.hitch(this, function(name, old, newv) {
					this.set('value', newv, true);
				}));
				return control;
			}

			if (val && (val !== this.dataType)) {

				if (this.control) {
					this.control.destroyRecursive(false);
				}
				this.control = null;
				this._clearDataTypeClasses();

				setClass(this.domNode, ('dataType-' + val));

				var controlMap = {
					'integer' : function() {
						return buildNumberTextBox.apply(this, [0]);
					},
					'decimal' : buildNumberTextBox,
					'date' : buildDateTextBox,
					'datetime' : buildTimeTextBox,
					'boolean' : buildCheckBox,
					'record' : buildTextBox,
					'alphanumeric' : buildTextBox,
					'list' : buildSelect
				};

				this.control = controlMap[val].apply(this);

				this.control.startup();
				domConstruct.place(this.control.domNode, this.domNode);
				this.dataType = val;
			}
		},

		_setNullValueAttr: function (val) {
			if (this.control) {
				this.control.nullValue = val;
			}
		},

		_setValueAttr : function(val, stopPropagate) {
			var undef = (function(u){ return u; }());
			if ((val === null) && this.control && (this.control.nullValue !== undef)){
				val = this.control.nullValue;
				this._set('value', val, true);
			}
			else {
				if ((this.dataType === 'boolean') && (lang.isString(val))) {
					val = val.toLowerCase() !== 'false';
				}
				this._set('value', val);
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
					if (val && lang.isString(val)) {
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

		_setOptionsAttr : function(values) {
			this._set('options', values);
			if (this.get('dataType') === 'list') {
				this.control.set('options', values);
				this.control.set('value', this.value);
			}
		}
	});
});
