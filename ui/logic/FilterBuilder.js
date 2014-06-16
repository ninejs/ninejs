/* jshint strict: false */
/**
 * @projectDescription Filter Builder control.
 *
 * @author Eduardo Burgos
 * @version 0.2
 *
 * @id FilterBuilder
 * @alias FilterBuilder
 * @alias ninejs/ui/logic/FilterBuilder
 * @classDescription Widget used to display and configure a logical expression.
 * @emits selectionChanged when some selection checkboxes change.
 * @emits stateChanged when the expression's state changes. e.g.: When you select a field or operator or summary
 * @emits expressionChanged when anything in the expression changes
 * @emits undo
 * @emits redo
 * @emits changeBooleanConfig when there is a change between the expression being all positive, all negative or custom
 * @emits check when any expression gets checked or unchecked
 * @emits copy
 * @emits paste
 * @emits newExpression when you want to add a new expression to the selected expression (or to the root if no selection)
 * @emits checked after any expression gets checked
 * @emits showMultiplePane
 * @emits hideMultiplePane
 * @emits editMode when you want to change the edit mode (strict, unRestricted)
 * @emits valid (valid, invalid)
 * @return {ninejs/ui/logic/FilterBuilder} Returns a FilterBuilder class.
 */
define(['dojo/_base/declare', './FilterBuilder/FieldSelect', './FilterBuilder/MultiOperatorSelect', './FilterBuilder/ControlStateManager', './FilterBuilder/OperatorSelect', './FilterBuilder/SummarySelect', './FilterBuilder/ValueSelect', 'dijit/_WidgetBase', 'dijit/_TemplatedMixin', 'dijit/_WidgetsInTemplateMixin', 'dojox/layout/FloatingPane', 'dijit/DropDownMenu', 'dijit/MenuItem', 'dijit/form/DropDownButton', 'dijit/form/CheckBox', 'ninejs/core/logic/Expression', 'dojo/text!./FilterBuilder.html', 'dojo/i18n!./nls/FilterBuilder', 'dojo/dom-construct', 'dojo/_base/lang', 'dojo/_base/xhr', 'dojo/_base/array', 'dojo/json', 'dojo/Evented', 'dojo/dom-style', '../utils/domUtils', 'dijit/Tooltip', 'dijit/Toolbar', 'dijit/ToolbarSeparator', 'dijit/form/Button', 'dojo/dom-geometry', 'dojo/dom-class', 'dojo/query', './FilterBuilder/AdvancedOptionsPanel', 'dijit/popup', 'dijit/Dialog', 'dojo/on', '../../css!../css/FilterBuilder.css', '../utils/setClass', '../utils/append', '../utils/setText', '../../css!dojox/layout/resources/FloatingPane.css!enable', '../../css!dojox/layout/resources/ResizeHandle.css!enable'], function (declare, FieldSelect, MultiOperatorSelect, ControlStateManager, OperatorSelect, SummarySelect, ValueSelect, WidgetBase, TemplatedMixin, WidgetsInTemplateMixin, FloatingPane, DropDownMenu, MenuItem, DropDownButton, CheckBox, Expression, template, resources, domConstruct, lang, xhr, array, json, Evented, domStyle, domUtils, Tooltip, Toolbar, ToolbarSeparator, Button, domGeometry, domClass, query, AdvancedOptionsPanel, popup, Dialog, on, filterBuilderCss, setClass, append, setText) {
	var FilterBuilder,
		cssInitialized = false;

	/*
	 * Tells whether or not the supplied array of FilterBuilder controls are brothers
	 */
	function areAllBrothers (controls) 	{
		if (controls.length) {
			var parent = controls[0].parent;
			return array.every(controls, function (item) {
				return item.parent === parent;
			});
		}
		return false;
	}

	/*
	The big control that integrates everything and brings us a filtering
	experience.
	@constructor
	@exports FilterBuilder
	*/
	FilterBuilder = declare([WidgetBase, TemplatedMixin, WidgetsInTemplateMixin, Evented], {
		/* Default Controls. You can override if you need */
		FieldSelect: FieldSelect,
		MultiOperatorSelect: MultiOperatorSelect,
		ControlStateManager: ControlStateManager,
		OperatorSelect: OperatorSelect,
		SummarySelect: SummarySelect,
		ValueSelect: ValueSelect,
		/**
		 * @type {Object}
		 */
		expression: null,

		/**
		 * 
		 * possible properties:
		 * - keepValuesWhileChangingFields: true if you want the values to be kept when changing from one field to another
		 * @type {Object}
		 */
		config: {},

		/**
		 * @type {String|Store|Array}
		 */
		fieldList: [],

		/**
		 * @type {String|Function}
		 */
		valueField: 'value',

		/**
		 * @type {String|Function}
		 */
		labelField: 'label',

		/*
		 * @type {String}
		 */
		editMode: 'unRestricted',

		/**
		 * @type {String}
		 */
		fieldValue: null,

		/**
		 * @type {String}
		 */
		operatorValue: null,

		allowMultipleExpressions: true,

		filterBuilderList: null,

		maxMultipleCssLevels: 7,


		_stopUpdatingExpression: true, //Initially true to avoid unnecesary calculations

		/**
		 * @type {DOMNode}
		 */
		outputNode: null,

		checkBoxNode: null,

		negativeButtonTooltip: null,

		/*
		 *	If assigned, this strategy tells the control that it (may) support Copy/Paste features.
		 *	This is an object that implements the following:
		 *	{
		 *	// Sets the FilterBuilder that we will be working on
		 *	set('filterBuilder', filterBuilder)
		 *	// True if the clipboard is present. It means if it is capable of doing copy/paste
		 *	hasClipboard() : boolean
		 *	// True if the clipboard has data. It means if it should enable the paste button
		 *	hasClipboardData() : boolean
		 *	// Copies the expression parameter
		 *	copy(expression)
		 *	// Pastes the copied expression in the same level as the one provided and returns the new Expression
		 *	// If null is provided then it just returns the pasted expression.
		 *	paste(Expression) : Expression
		 *	}
		 */
		clipboardStrategy: null,

		/**
		 * the label that would show up
		 * when there is no selected
		 * field
		 *
		 * @type {String}
		 */
		selectFieldText: '[' + resources.selectField + ']',

		/**
		 * the label that would show up
		 * when there is no selected
		 * operator
		 *
		 * @type {String}
		 */
		selectOperatorText: '[' + resources.noOperators + ']',

		/**
		 * the label that would show up
		 * when there is no selected
		 * operator
		 *
		 * @type {String}
		 */
		selectValueText: '[' + resources.noValue + ']',

		/**
		 * @internal
		 * @type {Boolean}
		 */
		template: true,
		/**
		 * html template for this control
		 * @type {String} 
		 */
		templateString: template,

		/**
		 * @internal
		 * @type {HTMLElement}
		 */
		fieldListHolderNode: null,

		/**
		 * @internal
		 * @type {HTMLElement}
		 */
		operatorListHolderNode: null,

		/**
		 * @internal
		 * @type {HTMLElement}
		 */
		selectedFieldSelectNode: null,

		/**
		 * @internal
		 * @type {HTMLElement}
		 */
		selectedOperatorSelectNode: null,

		/**
		 * @type {dijit.form.Select}
		 */
		selectedFieldSelect: null,

		/**
		 * @type {dijit.form.Select}
		 */
		selectedOperatorSelect: null,

		/**
		 * @type {dijit.form.Select}
		 */
		selectedSummarySelect: null,

		expressionListControls: null,

		createNewFilterBuilder: function(mix) {
			var args = {
				outputNode: null,
				//						parent : self,
				editMode: null,
				clipboardStrategy: this.get('clipboardStrategy'),
				toolbar: this.get('toolbar'),
				fieldList: this.get('fieldList'),
				FieldSelect: this.FieldSelect,
				MultiOperatorSelect: this.MultiOperatorSelect,
				ControlStateManager: this.ControlStateManager,
				OperatorSelect: this.OperatorSelect,
				SummarySelect: this.SummarySelect,
				ValueSelect: this.ValueSelect
			};
			if (mix) {
				lang.mixin(args, mix);
			}
			var r =  new FilterBuilder(args);
			return r;
		},
		doGroup: function()
		{
			var checkedControls = this._getCheckedExpressionControls();
			if (checkedControls && (checkedControls.length > 1))
			{
				var expressionsToGroup = [];
				var firstIndex = null;
				this.unCheckAll();
				var expression = this.get('expression');
				var listControlsCopy = this.expressionListControls.slice(0);
				array.forEach(checkedControls, function(item)
				{
					expressionsToGroup.push(item.get('expression'));
					var index = array.indexOf(listControlsCopy, item);
					if (firstIndex === null)
					{
						firstIndex = index;
					}
					expression.expressionList.splice(index, 1);
					listControlsCopy.splice(index, 1);
				}, this);
				var groupedExpression = new Expression(
				{
					operator: expression.operator,
					expressionList: expressionsToGroup
				});
				expression.expressionList.splice(firstIndex, 0, groupedExpression);
				this.set('expression', expression, true /* preventChange Undo Status */ );
			}
		},
		doUnGroup: function()
		{
			var checkedControls = this._getCheckedExpressionControls();
			if (checkedControls && (checkedControls.length === 1) && (checkedControls[0].expressionListControls && checkedControls[0].expressionListControls.length && checkedControls[0].parent))
			{
				var toUnGroupControl = checkedControls[0];
				var parent = toUnGroupControl.parent;
				parent.unCheckAll();
				var index = array.indexOf(parent.expressionListControls, toUnGroupControl);

				var expression = toUnGroupControl.get('expression');
				var expressionList = expression.expressionList;
				var parentExpression = parent.get('expression');
				parentExpression.expressionList.splice(index, 1);
				array.forEach(expressionList, function(item)
				{
					parentExpression.expressionList.splice(index, 0, item);
				});
				parent.set('expression', parentExpression, true /* preventChange Undo Status */ );
			}
		},
		/**
		 * @internal
		 */
		_getAllFields: function(parent)
		{
			var r = [],
				data;

			if (parent)
			{
				data = parent.children;
			}
			else
			{
				data = this.get('dataFieldList');
			}

			array.forEach(data, lang.hitch(this, function(item)
			{
				r.push(item);
				if (item.dataType === 'record')
				{
					array.forEach(this._getAllFields(item), function(child)
					{
						r.push(child);
					});
				}
			}));

			return r;
		},

		_renderMultipleExpressions: function()
		{
			var self = this;
			if (!this.expressionListControls)
			{
				this.expressionListControls = [];
			}
			domUtils.empty(this.multiExpressionHolderNode);
			if (!this._multipleExpressionLinks)
			{
				this._multipleExpressionLinks = [];
			}

			var intermediateToolbarHolder = null;
			array.forEach(this.expression.expressionList, function(item, idx)
			{
				if (idx >= this.expressionListControls.length)
				{
					var newControl = self.createNewFilterBuilder();
					this.expressionListControls.push(newControl);
					newControl.startup();
					newControl.set('parent', this);
				}
				if (idx > 0)
				{
					var linkExpressionCombo;
					if (idx > this._multipleExpressionLinks.length)
					{
						linkExpressionCombo = new this.MultiOperatorSelect(
						{
							filterBuilder: this,
							'class': 'weFilterBuilder multiExpressionLink'
						});
						linkExpressionCombo.set('options', [
							{
								value: 'and',
								label: resources.and
							},
							{
								value: 'or',
								label: resources.or
							}
						]);

						//var newAnchor = put(self.expressionListControls[idx-1].domNode,
						// linkExpressionCombo.domNode, 'after');

						this._multipleExpressionLinks.push(linkExpressionCombo);
					}
					else {
						linkExpressionCombo = this._multipleExpressionLinks[idx - 1];
					}
					linkExpressionCombo.set('value', this.operatorValue);
					var intermediateHolder = domConstruct.create('div');
					domConstruct.place(intermediateHolder, this.multiExpressionHolderNode);
					var linkHolder = append(intermediateHolder, 'div');
					domConstruct.place(linkExpressionCombo.domNode, linkHolder);
					if (!intermediateToolbarHolder)
					{
						intermediateToolbarHolder = append(intermediateHolder, 'div');
						this.multipleToolbarHolder = intermediateToolbarHolder;
					}
				}
				var control = this.expressionListControls[idx];
				control.set('parent', this);

				domConstruct.place(control.domNode, this.multiExpressionHolderNode);
				control.set('expression', item, true /* preventChange Undo State*/ );
			}, this);

			this.deleteControls();

		},
		deleteControls: function()
		{
			var deleteControl;
			if (this.expressionListControls && this.expression && this.expression.expressionList)
			{
				while ((this.expressionListControls.length > this.expression.expressionList.length) && (deleteControl = this.expressionListControls.pop()))
				{
					deleteControl.destroyRecursive(false);
					var toDeleteLink = this._multipleExpressionLinks.pop();
					if (toDeleteLink) {
						toDeleteLink.destroyRecursive(false);
					}
				}
			}
		},

		/**
		 * @internal
		 */
		_setExpressionAttr: function(
		/**
		 * @param
		 * {Object}
		 */val, preventReset)
		{
			this._stopUpdatingExpression = true;
			this.get('stateManager').preventUndo();
			//			this.get('stateManager').preventState();
			this.expression = val;
			if (val)
			{
				this.set('isNegative', this.expression.get('isNegative'));

				//calculating level
				var parentCount = 0;
				var testParent = this;
				while (testParent.parent)
				{
					testParent = testParent.parent;
					parentCount += 1;
				}
				var cnt = 0;
				for (cnt = 0; cnt <= testParent.maxMultipleCssLevels; cnt += 1)
				{
					setClass(this.domNode, ('!weLevel' + (cnt)));
				}
				if (parentCount >= 0)
				{
					parentCount -= 1;
					parentCount = (parentCount % testParent.maxMultipleCssLevels) + 1;
					setClass(this.domNode, ('weLevel' + (parentCount)));
				}

				var handleAndOr = function(self) {
					domUtils.hide(self.singleExpressionHolderNode, false);
					domUtils.show(self.multiExpressionHolderNode, false, 'table');
					setClass(self.domNode, 'multiple');


					self.set('fieldValue', null);
					self.set('valueValue', null);
					self.set('summaryValue', null);

					//TODO : implement how will we get this operatorValue
					self.operatorValue = operator;
					/* no triggers, sorry :( */
					self.set('operatorValue', operator);

					/* TODO: HACER LA MAGIA AQUI */
					self._renderMultipleExpressions();
					domConstruct.place(self.negativeButtonNode, self.multipleToolbarHolder);
					domConstruct.place(self.deleteButtonNode, self.multipleToolbarHolder);
					domUtils.empty(self.addExpressionButtonSingleNode);
					domConstruct.place(self.addNewExpressionButton.domNode, self.multiExpressionHolderNode);
				};

				var handleOthers = function(self) {
					domUtils.show(self.singleExpressionHolderNode, false, 'table');
					domUtils.hide(self.multiExpressionHolderNode, false);
					setClass(self.domNode, '!multiple');
					self.multipleToolbarHolder = null;

					domConstruct.place(self.negativeButtonNode, self.deleteButtonHolderNode);
					domConstruct.place(self.deleteButtonNode, self.deleteButtonHolderNode);

					self.deleteControls();

					var src = self.expression.get('source');
					if (src)
					{
						src = src();
					}
					var summary = self.expression.sourceSummary;
					if (summary === '')
					{
						summary = 'valueOf';
					}

					self.set('summaryValue', summary);
					self.set('fieldValue', src);
					self.operatorValue = operator;
					self.set('operatorValue', operator);
					self.set('valueValue', self.expression.get('targetValue'));
				};

				var operator = this.expression.operator;
				if ((operator === 'and') || (operator === 'or'))
				{
					handleAndOr(this);
				}
				else
				{
					handleOthers(this);
				}


			}
			else
			{
				domUtils.show(this.singleExpressionHolderNode, false, 'table');
				domUtils.hide(this.multiExpressionHolderNode, false);
				this.set('summaryValue', null);
				this.set('fieldValue', null);
				this.set('operatorValue', null);
				this.set('valueValue', null);
				this.set('isNegative', false);
			}

			this._stopUpdatingExpression = false;
			this._updateExpression();

			//get the most parent
			var mostParent = this;
			while (mostParent.parent)
			{
				mostParent = mostParent.parent;
			}

			var configMode = this._calculateBooleanConfig();
			if (mostParent.booleanConfigMode !== configMode)
			{
				mostParent.emit('changeBooleanConfig',
				{
					mode: configMode
				});
			}

			setTimeout((function(self)
			{
				return function()
				{
					self.get('stateManager').resumeUndo();
					if ((!preventReset) && (!self.get('parent')))
					{
						self.get('stateManager').resetUndo(self.get('expression'));
					}
				};
			})(this), 2);

		},
		_setAmbiguousAttr: function(val) {
			this.ambiguous = val;
			var expression = this.get('expression');
			if (expression) {
				expression.set('ambiguous', !!val);
			}
			if (val) {
				setClass(this.domNode, 'njsAmbiguous');
			}
			else {
				setClass(this.domNode, '!njsAmbiguous');
			}
		},

		_setAllowMultipleExpressionsAttr: function( /** @param {Boolean} */ val)
		{
			this.allowMultipleExpressions = !! val;

			var toolbar = this.get('toolbar');
			if (toolbar)
			{ //if it's null I'll handle it later
				if (this.allowMultipleExpressions)
				{
					domUtils.show(toolbar.get('addNewExpressionButton'), false, 'inline-block');
				}
				else
				{
					domUtils.hide(toolbar.get('addNewExpressionButton'));
				}
			}

		},

		_updateExpression: function()
		{
			function detectBringToFront()
			{
				var r = false;
				var expression = this.get('expression');
				if ((expression.expressionList) && (expression.expressionList.length))
				{
					if (expression.expressionList.length === 1)
					{
						r = true;
						//In the event of the multiexpression only having one expression, then we should
						// move that child to its parent's level and delete the parent
					}
				}
				return r;
			}

			function handleAndOr()
			{
				this.expression.set('source', null);
				this.expression.set('target', null);

				if ((this.expressionListControls) && (this.expressionListControls.length))
				{
					this.expression.expressionList = [];
					var self = this;
					array.forEach(this.expressionListControls, function(item)
					{
						self.expression.expressionList.push(item.expression);
					});
				}
				else
				{
					deleteExpression = true;
					//In the event of someone deleting all the children of a multiexpression, then we
					// have to delete the multiexpression itself
				}
			}

			function handleSingleExpression()
			{
				var summaryValue = this.get('summaryValue'),
				fieldValue = this.get('fieldValue');
				setClass(this.fieldListHolderNode, '!funnelCapable');
				setClass(this.fieldListHolderNode, '!funnelSet');
				if (summaryValue === 'valueOf')
				{
					summaryValue = '';
				}
				else {
					var fieldObj;
					array.some(this.get('fieldList'), function(item) {
						if (item.fullPath === fieldValue){
							fieldObj = item;
							return true;
						}
						return false;
					});
					if (fieldObj && fieldObj.dataType === 'record'){
						setClass(this.fieldListHolderNode, '.funnelCapable');
						var whereExpression = this.get('whereExpression');
						if (whereExpression) {
							setClass(this.fieldListHolderNode, 'funnelSet');
							this.get('whereTooltip').set('label', resources.whereCaps + ':\n' + whereExpression.toString());
						}
						else {
							this.set('whereExpression', null);
							this.get('whereTooltip').set('label', resources.clickToAddSubExpression);
						}
					}
				}
				if (summaryValue !== null)
				{
					this.expression.set('sourceSummary', summaryValue);
				}
				this.expression.set('where', this.get('whereExpression'));
				this.expression.set('sourceField', fieldValue);
				this.expression.set('target', this.get('valueValue'));
				this.set('ambiguous', false);
			}

			function updateNegativeClass()
			{
				var isNegative = this.get('isNegative');
				this.expression.set('isNegative', isNegative);

				var negativeTooltip = this.get('negativeButtonTooltip');
				if (isNegative)
				{
					setClass(this.domNode, 'negative');
					if (negativeTooltip)
					{
						negativeTooltip.set('label', resources.negativeTooltipMessage);
					}
				}
				else
				{
					setClass(this.domNode, '!negative');
					if (negativeTooltip)
					{
						negativeTooltip.set('label', resources.positiveTooltipMessage);
					}
				}
			}

			function getSupremeParent()
			{
				var parent = this;

				while (parent.parent)
				{
					parent = parent.parent;
				}
				return parent;
			}

			function handleCheckedExpression(parent)
			{
				//Checking and updating based on the selection


				var checkedControls = parent._getCheckedExpressionControls();
				parent._hideAllNewExpressionButtons();
				var controlToEnableNewExpression = parent;
				var hidePane = true;
				if ((checkedControls.length === 1) && (checkedControls[0] !== parent))
				{
					var possibleCheckedParent = checkedControls[0];
					if ((possibleCheckedParent.expressionListControls) && (possibleCheckedParent.expressionListControls.length))
					{
						parent.emit('showMultiplePane',
						{
							target: possibleCheckedParent,
							can: ['ungroup', 'add']
						});
						hidePane = false;
					}
					controlToEnableNewExpression = checkedControls[0];
				}
				else if ((checkedControls.length > 1) && (areAllBrothers(checkedControls)))
				{
					//Checking if they are contiguous
					var firstParent = checkedControls[0].parent;
					if (firstParent)
					{
						var idx = array.indexOf(firstParent.expressionListControls, checkedControls[0]),
							contiguous = true;
						array.forEach(checkedControls, function(item, i)
						{
							if (i)
							{ //Skipping the first one as I already have it
								contiguous = contiguous && (array.indexOf(firstParent.expressionListControls, item) === (idx + 1));
								idx += 1;
							}
						});
						if (contiguous)
						{
							parent.emit('showMultiplePane',
							{
								target: firstParent,
								can: ['group']
							});
							hidePane = false;
						}
					}
				}

				if (hidePane)
				{
					parent.emit('hideMultiplePane', {});
				}

				if ((parent.editMode === 'strict') && (!parent.valid))
				{
					domUtils.hide(this.addNewExpressionButton.domNode);
				}
				else
				{
					domUtils.show(controlToEnableNewExpression.get('addNewExpressionButton').domNode);
				}
			}

			function handleAddNewExpressionButton()
			{
				if (this.addNewExpressionButton)
				{
					//If I'm alone display me as if I'm root
					if (!this.parent && ((!this.expression.expressionList) || !(this.expression.expressionList.length)))
					{
						setClass(this.domNode, 'weAlone');
						domConstruct.place(this.addNewExpressionButton.domNode, this.singleExpressionHolderNode.parentElement);
					}
					else
					{
						//else I'm not alone
						setClass(this.domNode, '!weAlone');
						//If I'm root and I have children
						if ((!this.parent) && ((this.expression.expressionList) && (this.expression.expressionList.length)))
						{
							domConstruct.place(this.addNewExpressionButton.domNode, this.singleExpressionHolderNode.parentElement);
						}
						else
						{ //else I'm just a single expression child
							domConstruct.place(this.addNewExpressionButton.domNode, this.addExpressionButtonSingleNode);
						}
					}
				}
			}

			if (!this._stopUpdatingExpression)
			{

				if (!this.expression)
				{
					this.set('expression', new Expression());
				}

				var deleteExpression = false;
				var bringExpressionToFront = detectBringToFront.call(this);

				this.expression.operator = this.operatorValue;

				if ((this.operatorValue === 'and') || (this.operatorValue === 'or'))
				{
					handleAndOr.call(this);
				}
				else
				{
					handleSingleExpression.call(this);

				}

				updateNegativeClass.call(this);

				var valid = this.isValid();
				//Triggering parent if available
				if (this.parent)
				{
					this.parent._updateExpression();
				}

				this.onValid(valid);

				if (bringExpressionToFront)
				{
					var newExpression = this.expressionListControls[0].get('expression');
					this.set('expression', newExpression, true /* preventChange Undo State */ );
				}
				else if (deleteExpression)
				{
					this.deleteExpression();
				}


				var parent = getSupremeParent.call(this);
				handleCheckedExpression.call(this, parent);


				var expressionString = this.expression.toString();

				if (this.outputNode)
				{
					this.outputNode.innerHTML = '';
					setText(setClass(append(this.outputNode, 'div'), 'FilterBuilderOutput'), expressionString);
				}



				handleAddNewExpressionButton.call(this);

				if (this === parent)
				{
					this.emit('valid',
					{
						value: parent.valid
					});
				}

			}
		},

		/**
		 * @internal
		 */
		_setFieldListAttr: function( /** @param {String|Store|Array}*/ val)
		{

			if (lang.isString(val))
			{
				var self = this;
				var promise = xhr.get(
				{
					url: val,
					handleAs: 'json',
					preventCache: true
				});
				promise = promise.then(function(data)
				{
					var d = json.parse(data);
					self.set('dataFieldList', d);
					self.set('fieldValue', null);
					self.set('valueValue', null);
					self.set('summaryValue', null);
					self._updateSummaryValues();
					self._updateExpression();
				});
				return promise;
			}
			else if (lang.isArray(val))
			{
				this.set('dataFieldList', val);
			}
			else if (lang.isArrayLike(val))
			{
				var arr = [],
					i;
				for (i in val)
				{
					if (val.hasOwnProperty(i))
					{
						if (val.hasOwnProperty(i))
						{
							arr.push(i);
						}
					}
				}
				this.set('dataFieldList', arr);
			}
			else
			{
				throw new Error('Unsupported data type for field list');
			}

			this._updateExpression();
		},

		_setFieldValueAttr: function( /** @param {String} */ val)
		{
			this.fieldValue = val;
			if (val)
			{
				if (this.selectedFieldSelect.value !== val)
				{
					this.selectedFieldSelect.set('value', val);
				}
			}
			else
			{
				if (this.selectedFieldSelect.value)
				{
					this.selectedFieldSelect.set('value', null);
				}

			}

			var operatorValue = this.get('operatorValue');
			//var summaryValue = this.get('summaryValue');

			this._updateOperatorValues(val);

			if (array.some(this.selectedOperatorSelect.options, function(item)
			{
				return item.value === operatorValue;
			}))
			{
				this.set('operatorValue', operatorValue);
			}
			else if ((operatorValue === 'and') || (operatorValue === 'or'))
			{
				this.set('operatorValue', operatorValue);
			}
			else
			{
				this.set('operatorValue', null);
			}

			this._updateExpression();
		},

		_getIsNegativeAttr: function()
		{
			return !!this.isNegative;
		},
		_setIsNegativeAttr: function( /** @param {Boolean} */ val)
		{
			this.isNegative = !! val;

			this._updateExpression();
		},

		_setValueValueAttr: function( /** @param {String} */ val)
		{
			this.valueValue = val;
			var label = val;
			if (val)
			{
				if (this.selectedValueSelect.value !== val)
				{
					this.selectedValueSelect.set('value', val);
				}
			}
			else
			{
				if (this.selectedValueSelect.value)
				{
					this.selectedValueSelect.set('value', null);
				}

			}
			label = this.selectedValueSelect.get('displayValue') || label || this.selectValueText;

			this._updateExpression();
		},

		/**
		 * @internal
		 */
		_setSummaryListAttr: function( /** @param {String|Store|Array}*/ val) {
			this.summaryList = val;
			this._doSetSummaryList(val);

		},

		_setSummaryValueAttr: function( /** @param {String} */ val) {
			this.summaryValue = val;
			if (val)
			{
				if (this.selectedSummarySelect.value !== val)
				{
					this.selectedSummarySelect.set('value', val);
				}
			}
			else
			{
				if (this.selectedSummarySelect.value)
				{
					if (this.selectedSummarySelect.get('options').length)
					{
						this.selectedSummarySelect.set('value', this.selectedSummarySelect.options[0].value);
						val = this.selectedSummarySelect.get('options')[0].value;
					}
				}
				else
				{
					if (this.selectedSummarySelect.get('options').length > 0)
					{
						val = this.selectedSummarySelect.get('options')[0].value;
						this.selectedSummarySelect.set('value', val);
					}
				}

			}

			if (!this.stateManager.preventStateChanges)
			{
				this._updateFieldValues(val);
			}
		},
		_getFilterFunction: function(summaryName){
			function filterCountOf(item)
			{
				return (item.dataType === 'record') || (item.parent) || item.isMultiValued;
			}

			function filterValueOf(item)
			{
				return item.dataType !== 'record';
			}

			function filterSomeOrEvery(item)
			{
				return filterCountOf(item);
			}

			function filterSumOfOrAverageOf(item)
			{
				return filterCountOf(item) && ((item.dataType === 'integer') || (item.dataType === 'decimal'));
			}
			var filterFunction = function() {
				return false;
			};
			switch (summaryName)
			{

				//do for integer regardless of dataType
			case 'countOf':
				filterFunction = filterCountOf;
				break;
			case 'valueOf':
				filterFunction = filterValueOf;
				break;
			case 'some':
			case 'every':
				filterFunction = filterSomeOrEvery;
				break;
			case 'sumOf':
			case 'averageOf':
				filterFunction = filterSumOfOrAverageOf;
				break;
			}
			return filterFunction;
		},

		_updateFieldValues: function( /* {String} */ summary)
		{

			var filterFunction = this._getFilterFunction(summary),
				fields = [];

			if (filterFunction)
			{
				fields = array.filter(this._getAllFields(), filterFunction);
			}

			this._setDisplayableFields(fields);

			this._updateExpression();
		},

		_setDisplayableFields: function(fields)
		{
			if (this.selectedFieldSelect)
			{
				this.selectedFieldSelect.set('optionList', []);
				this.selectedFieldSelect.addOption(
				{
					label: '[' + resources.selectField + ']',
					value: null
				});

				var sortedValues = fields.slice(0), //copy array
					self = this;

				sortedValues.sort(lang.hitch(this, function(a, b)
				{
					var labelA = this._getItemLabel(a, this, null);
					var labelB = this._getItemLabel(b, this, null);
					if (labelA < labelB)
					{ //sort string ascending
						return -1;
					}
					else if (labelA > labelB)
					{
						return 1;
					}
					else
					{
						return 0;
						//default return value (no sorting)
					}
				}));

				array.forEach(sortedValues, function(item)
				{
					self._addField(item);
				});

				this.selectedFieldSelect.set('value', null);
			}
		},

		_updateOperatorsToDataType: function( /* {String} */ dataType)
		{

			var newOptions = [
				{
					value: null,
					label: this.selectOperatorText
				}
			],
				comparableTypes = ['integer', 'decimal', 'date', 'datetime', 'record'];

			if (array.indexOf(comparableTypes, dataType) >= 0)
			{
				newOptions.push(
				{
					value: 'equals',
					label: resources.equals
				});
				newOptions.push(
				{
					value: 'notEquals',
					label: resources.notEquals
				});
				newOptions.push(
				{
					value: 'lessThan',
					label: resources.lessThan
				});
				newOptions.push(
				{
					value: 'lessThanOrEquals',
					label: resources.lessThanOrEquals
				});
				newOptions.push(
				{
					value: 'greaterThan',
					label: resources.greaterThan
				});
				newOptions.push(
				{
					value: 'greaterThanOrEquals',
					label: resources.greaterThanOrEquals
				});
			}
			else if (dataType === 'boolean')
			{
				newOptions.push(
				{
					value: 'equals',
					label: resources.equals
				});
				newOptions.push(
				{
					value: 'notEquals',
					label: resources.notEquals
				});
			}
			else
			{ //alphanumeric, list or whatever
				newOptions.push(
				{
					value: 'equals',
					label: resources.equals
				});
				newOptions.push(
				{
					value: 'notEquals',
					label: resources.notEquals
				});
				newOptions.push(
				{
					value: 'contains',
					label: resources.contains
				});
				newOptions.push(
				{
					value: 'startsWith',
					label: resources.startsWith
				});
				newOptions.push(
				{
					value: 'endsWith',
					label: resources.endsWith
				});
			}

			this.selectedOperatorSelect.set('options', newOptions);

		},

		_updateOperatorValues: function( /** @param {String} */ val)
		{
			function mapOptions(field)
			{
				var result = [],
					values = field.values,
					p, valueField, displayField, value, label;
				valueField = field.listValueField || 'value';
				displayField = field.listLabelField || 'label';
				if (values)
				{
					if (lang.isArray(values))
					{
						array.forEach(values, function(item)
						{
							if (lang.isObject(item))
							{
								value = item[valueField];
								label = item[displayField];
								item.value = value;
								item.label = label;
								result.push(item);
							}
							else
							{
								result.push(
								{
									value: item,
									label: item
								});
							}
						});
					}
					else if (lang.isObject(values))
					{
						for (p in values)
						{
							if (values.hasOwnProperty(p))
							{
								result.push(
								{
									value: p,
									label: values[p]
								});
							}
						}
					}
				}
				return result;
			}

			var fields, field, options;
			//lookup the field with the key
			fields = array.filter(this._getAllFields(), function(item)
			{
				return item.fullPath === val;
			});
			if (fields.length > 0)
			{

				field = fields[0];

				if (this.selectedSummarySelect.get('value') === 'countOf')
				{
					this._updateOperatorsToDataType('integer');
					this.selectedValueSelect.set('options', []);
					this.selectedValueSelect.set('dataType', 'integer');
				}
				else
				{
					this._updateOperatorsToDataType(field.dataType);
					options = mapOptions(field);
					this.selectedValueSelect.set('options', options);
					this.selectedValueSelect.set('dataType', field.dataType);
					if ((field.dataType === 'list') && (options.length > 0))
					{
						this.selectedValueSelect.set('nullValue', options[0].value);
					}
				}
			}
			else
			{

				this._updateOperatorsToDataType(null);

			}

		},

		_updateSummaryValues: function( /** @param {String} */ /*val*/ )
		{

			var newOptions, allFields = this._getAllFields(), self = this, summaryList = ['valueOf', 'sumOf', 'averageOf', 'countOf', 'some', 'every'];

			newOptions = [];
			newOptions.push(
			{
				value: null,
				label: '[' + resources.select + ']'
			});
			array.forEach(summaryList, function(summaryName) {
				var filterFunction = self._getFilterFunction(summaryName);
				if (array.some(allFields, function(item) {
					return filterFunction(item);
				})){
					newOptions.push(
					{
						value: summaryName,
						label: resources[summaryName]
					});
				}
			});

			this.selectedSummarySelect.set('options', newOptions);

		},

		_calculateBooleanConfig: function()
		{
			if (this.parent)
			{
				return this.parent._calculateBooleanConfig();
			}
			else
			{
				var expression = this.get('expression'),
					resultMode = 'allCustom',
					hasAnyNegatives;

				hasAnyNegatives = function(exp)
				{
					var r = false;
					if (exp.get('isNegative'))
					{
						r = true;
					}
					if (!r)
					{
						r = array.some(exp.get('expressionList'), function(child)
						{
							return hasAnyNegatives(child);
						});
					}
					return r;
				};

				//If all children are positive then decide between allPositive or allNegative,
				// depending on parent's state
				if (!array.some(expression.get('expressionList'), function(child)
				{
					return hasAnyNegatives(child);
				}))
				{
					if (this.get('isNegative'))
					{
						resultMode = 'allNegative';
					}
					else
					{
						resultMode = 'allPositive';
					}
				}

				return resultMode;
			}
		},

		/**
		 * @internal
		 */
		_setDataFieldListAttr: function( /** @param {String|Store|Array}*/ val)
		{

			if (lang.isArray(val))
			{

				var recurseFix = function(item, parent)
				{
					var r = item;
					if (lang.isString(item))
					{
						r =
						{
							value: item,
							label: item,
							dataType: 'alphanumeric'
						};
					}
					if (parent)
					{
						r.fullPath = parent.fullPath + '/' + r.value;
						r.parent = parent;
					}
					else
					{
						r.fullPath = r.value;
					}
					if (r.children)
					{
						r.children = array.map(r.children, function(child)
						{
							return recurseFix(child, r);
						});
					}
					return r;
				};

				val = array.map(val, function(item)
				{
					return recurseFix(item);
				});

				this.dataFieldList = val;
				this._doSetFieldList(val);
			}
			else
			{
				this.dataFieldList = null;
			}
		},

		_getItemLabel: function(item)
		{
			var label = '';

			if (item.parent)
			{
				label += this._getItemLabel(item.parent, null, null) + ' ';
			}

			var value = lang.isFunction(this.valueField) ? this.valueField(item) : (item[this.valueField] || item);
			label += (lang.isFunction(this.labelField) ? this.labelField(item) : (item[this.labelField] || value));
			if (item.dataType === 'record')
			{
				label += ' :';
			}
			return label;
		},

		_addField: function(item)
		{
			var value = lang.isFunction(this.valueField) ? this.valueField(item) : (item[this.valueField] || item);

			value = item.fullPath;

			var label = this._getItemLabel(item);

			this.selectedFieldSelect.addOption(
			{
				label: label,
				value: value
			});

		},

		/**
		 * @internal
		 */
		_doSetFieldList: function(val)
		{
			function doNestedAssignParent(arr, parent)
			{
				array.forEach(arr, function(item)
				{
					item.parent = parent;
					if (item.dataType === 'record')
					{
						if (item.children && lang.isArray(item.children))
						{
							doNestedAssignParent(item.children, item);
						}
					}
				});
			}

			doNestedAssignParent(val, null);

			this.emit('stateChanged',
			{
				state: 'start'
			});
		},

		/**
		 * @internal
		 */
		_doSetSummaryList: function(val)
		{
			if (this.selectedSummarySelect)
			{
				this.selectedSummarySelect.options = [];

				var self = this;
				array.forEach(val, function(item)
				{
					self._addField(item);
				});

				if (val.length > 0)
				{
					this.selectedSummarySelect.set('value', val[0]);
				}
			}
		},

		_getFieldListAttr: function()
		{
			return this.get('dataFieldList');
		},

		_getOperatorListAttr: function()
		{
			return this.operatorList;
		},

		_setOperatorValueAttr: function( /** @param {String} */ val)
		{
			this.operatorValue = val;
			var self = this;
			if (val)
			{
				if ((val !== 'and') && (val !== 'or'))
				{ //TODO : implement how will we deal with this

					if (this.selectedOperatorSelect.value !== val)
					{
						this.selectedOperatorSelect.set('value', val);
					}
				}
				else if (val !== this.selectedOperatorSelect.get('value'))
				{

					this.selectedOperatorSelect.set('value', val);
				}

			}
			else
			{

				//TODO: implement how will we deal with this

				if (this.selectedOperatorSelect.value || !array.some(this.selectedOperatorSelect.options, function(item)
				{
					return item.value === self.selectedOperatorSelect.value;
				}))
				{
					if (this.selectedOperatorSelect.options.length)
					{
						this.selectedOperatorSelect.set('value', this.selectedOperatorSelect.options[0].value);
					}
				}

			}

			this._updateExpression();
		},

		_setSelectedAttr: function(value)
		{
			this.selected = value;
			this.signalSelectionChanged();
		},

		signalSelectionChanged: function()
		{
			if (this.parent)
			{
				this.parent.signalSelectionChanged();
			}
			else
			{
				this.emit('selectionChanged',
				{
					bubbles: true,
					cancelable: true
				});
			}
		},

		deleteExpression: function(isReset)
		{

			if (!isReset && this.deleteButtonTooltip)
			{
				this.deleteButtonTooltip.close();
			}

			setTimeout(lang.hitch(this, function()
			{
				if (this.parent && (!isReset))
				{
					var idx = array.indexOf(this.parent.expressionListControls, this);
					var len = this.parent.expressionListControls.length;
					var newExpressionList = [];
					var cnt;
					var parentExpression = this.parent.get('expression');
					for (cnt = 0; cnt < len; cnt += 1)
					{
						if (cnt !== idx)
						{
							newExpressionList.push(parentExpression.expressionList[cnt]);
						}
					}
					parentExpression.set('expressionList', newExpressionList);
					this.parent.set('expression', parentExpression, true
					/* preventChange Undo State
					 * */);
				}
				else
				{
					this.set('expression', new Expression(
					{
						operator: null
					}), true /* preventChange Undo State */ );
				}
			}));

		},

		_setCheckedAttr: function(val)
		{
			this.emit('check',
			{
				target: this,
				value: !! val
			});
		},

		_getCheckedAttr: function()
		{
			var undef;
			var checkBox = this.get('checkBox');
			if (checkBox)
			{
				return !!checkBox.get('value');
			}

			return undef;
		},

		/**
		 * @internal
		 */
		_onDeleteButtonClick: function()
		{
			this.deleteExpression();
			this.emit('expressionChanged', {});
		},

		/**
		 * @internal
		 */
		_onResetButtonClick: function()
		{
			this.deleteExpression(true);
			this.emit('expressionChanged', {});
		},

		/**
		 * @internal
		 */
		_onNegativeButtonClick: function()
		{
			var negative = this.get('isNegative');
			this.set('isNegative', !negative);
			Tooltip.hide(this.negativeButtonNode);
			this.emit('expressionChanged', {});
		},

		addNewExpression: function(data)
		{
			var selected = this._getCheckedExpressionControls();
			var selectedExpressionControl = null;
			if (selected.length === 1)
			{
				selectedExpressionControl = selected[0];
			}
			else
			{
				var parent = this.get('parent');
				if (parent)
				{
					return parent.addNewExpression(data);
				}
				else
				{
					selectedExpressionControl = this;
				}
			}

			var expression = selectedExpressionControl.get('expression');
			var operator = expression.get('operator');
			var childExpressionOperator = data.operator || 'and';
			if ((operator === childExpressionOperator))
			{
				var childExpression = new Expression();
				expression.expressionList.push(childExpression);
				selectedExpressionControl.set('expression', expression, true
				/* preventChange
				 * Undo State */);
			}
			else
			{
				var newExpression = new Expression(
				{
					operator: childExpressionOperator,
					expressionList: [expression, new Expression({})]
				});
				selectedExpressionControl.set('expression', newExpression, true
				/* preventChange
				 * Undo State */);
			}
			selectedExpressionControl.emit('expressionChanged', {});
		},

		_getRealCheckedExpressionControls: function()
		{
			var r = [];
			if (this.get('checked'))
			{
				r.push(this);
			}
			array.forEach(this.expressionListControls, function(item)
			{
				array.forEach(item._getCheckedExpressionControls(), function(child)
				{
					r.push(child);
				});
			});

			return r;
		},
		_getCheckedExpressionControls: function()
		{
			var r = [],
				tempResult,
				allBrothers = false;
			if (!this.expressionListControls || (this.expressionListControls && (!this.expressionListControls.length)))
			{ //If this expression has no children
				if ( !! (this.get('checked')))
				{
					r.push(this);
				}
			}
			else
			{
				tempResult = [];
				allBrothers = true;
				array.forEach(this.expressionListControls, function(item)
				{
					var childsChecked = item._getCheckedExpressionControls();
					allBrothers = allBrothers && ((childsChecked.length === 1) && (childsChecked[0] === item));

					array.forEach(childsChecked, function(child)
					{
						tempResult.push(child);
					});
				});

				if (allBrothers)
				{ //If all my children are checked then I'm checked instead of them.
					r.push(this);
				}
				else
				{
					r = tempResult;
				}
			}

			return r;
		},

		_setClipboardStrategyAttr: function(strategy)
		{
			this.clipboardStrategy = strategy;
			this.clipboardStrategy.set('filterBuilder', this);
		},

		_hideAllNewExpressionButtons: function()
		{
			var control = this.get('addNewExpressionButton');
			if (control)
			{
				domUtils.hide(control);
			}
			if (this.expressionListControls)
			{
				array.forEach(this.expressionListControls, function(item)
				{
					item._hideAllNewExpressionButtons();
				});
			}
		},
		unCheckAll: function()
		{
			this.get('checkBox').set('checked', false);
			if (this.expressionListControls)
			{
				array.forEach(this.expressionListControls, function(item)
				{
					item.unCheckAll();
				});
			}
		},

		isValid: function()
		{
			var expression = this.get('expression');
			var value = true;
			if (expression.expressionList && expression.expressionList.length)
			{
				this.valid = value && array.every(expression.expressionList, function(item)
				{
					return !!item.isValid();
				});
			}
			else
			{
				this.valid = expression.isValid();
			}
			this.valid = this.valid && !this.get('ambiguous');
			return this.valid;
		},

		onValid: function(valid)
		{
			var value = !! valid;

			if (value)
			{
				setClass(this.domNode, '!invalid');
				setClass(this.domNode, 'valid');
			}
			else
			{
				setClass(this.domNode, '!valid');
				setClass(this.domNode, 'invalid');
			}
		},

		/**
		 * @internal
		 */
		postCreate: function()
		{
			this.inherited(arguments);
			var self = this;

			if (!this.config)
			{
				this.config = {};
			}
			//Initializing the state manager
			this.stateManager = new this.ControlStateManager(
			{
				filterBuilder: this
			});
			this.stateManager.postCreate();

			//attaching hovering to the delete button
			domUtils.enableHovering(this.deleteButtonNode);
			this.deleteButtonTooltip = domUtils.addTooltip(this.deleteButtonNode, resources.deleteThis, null, 100);

			//attaching hovering to the reset button
			domUtils.enableHovering(this.resetButtonNode);
			domUtils.addTooltip(this.resetButtonNode, resources.resetThis, null, 100);

			//attaching hovering to the negative button
			domUtils.enableHovering(this.negativeButtonNode);
			this.set('negativeButtonTooltip', domUtils.addTooltip(this.negativeButtonNode, resources.deleteThis, null, 100));

			this.checkBox = new CheckBox(
			{
				filterBuilder: this,
				onChange: function(val)
				{
					this.filterBuilder.emit('check',
					{
						target: this.filterBuilder,
						value: !! val
					});
				}
			}, this.checkBoxNode);

			this.own(domUtils.enableHovering(this.funnelNode));
			if (!this.get('whereTooltip')){
				this.set('whereTooltip', domUtils.addTooltip(this.funnelNode, ''));
			}

			this.selectedFieldSelect = new this.FieldSelect({
				filterBuilder: this
			});

			this.selectedOperatorSelect = new this.OperatorSelect({
				filterBuilder: this
			});

			this.selectedSummarySelect = new this.SummarySelect({
				filterBuilder: this
			});

			this.selectedValueSelect = new this.ValueSelect({
				filterBuilder: this
			});

			this.selectorCheckBox = new CheckBox({
				filterBuilder: this,
				onChange: function () {
					this.filterBuilder.set('selected', !! this.get('value'));
				}
			});


			var addNewExpressionButton;
			var addExpressionMenu = new DropDownMenu({ style: 'display: none;', 'class': 'njsAddExpressionButton' });
			var andExpressionItem = new MenuItem({
				label: resources.and,
				onClick: function () {
					self.emit('newExpression', {
						target: self,
						operator: 'and'
					});
				}
			});
			addExpressionMenu.addChild(andExpressionItem);

			var orExpressionItem = new MenuItem({
				label: resources.or,
				onClick: function () {
					self.emit('newExpression', 	{
						target: self,
						operator: 'or'
					});
				}
			});
			addExpressionMenu.addChild(orExpressionItem);

			this.addNewExpressionButton = addNewExpressionButton = new DropDownButton({
				dropDown: addExpressionMenu,
				filterBuilder: this,
				showLabel: false,
				autoWidth: false,
				'class': 'weAddExpressionButton',
				label: resources.addNewCondition,
				iconClass: 'weFilterBuilder weIconAdd',
				style: 'display: none',
				onClick: function () {

				}
			});
			this.addNewExpressionButton.startup();


			if (!this.get('toolbar')) {
				var toolbarNode = this.toolbarNode || this.defaultToolbarNode;
				var toolbar = new Toolbar({
					'class': 'weFilterBuilder weFilterBuilderToolbar'
				}, toolbarNode);
				var undoButton = new Button({
					filterBuilder: this,
					disabled: true,
					showLabel: false,
					label: resources.undo,
					iconClass: 'dijitEditorIcon weFilterBuilder weIconUndo',
					onClick: function () {
						this.filterBuilder.emit('undo', {});
					}
				});
				var redoButton = new Button({
					filterBuilder: this,
					disabled: true,
					showLabel: false,
					label: resources.redo,
					iconClass: 'dijitEditorIcon weFilterBuilder weIconRedo',
					onClick: function () {
						this.filterBuilder.emit('redo', {});
					}
				});

				var copyButton = new Button({
					filterBuilder: this,
					//disabled : true,
					showLabel: false,
					label: resources.copy,
					iconClass: 'dijitEditorIcon dijitEditorIconCopy',
					onClick: function () {
						this.filterBuilder.emit('copy', {});
					}
				});
				var pasteButton = new Button({
					filterBuilder: this,
					disabled: !(this.get('clipboardStrategy') && this.get('clipboardStrategy').hasClipboardData()),
					showLabel: false,
					label: resources.paste,
					iconClass: 'dijitEditorIcon dijitEditorIconPaste',
					onClick: function () {
						this.filterBuilder.emit('paste', {});
					}
				});


				toolbar.addChild(undoButton);
				toolbar.addChild(redoButton);
				toolbar.addChild(new ToolbarSeparator());

				if (this.get('clipboardStrategy') && this.get('clipboardStrategy').hasClipboard()) {
					toolbar.addChild(copyButton);
					toolbar.addChild(pasteButton);
					toolbar.addChild(new ToolbarSeparator());
				}

				var button = new Button({
					label: resources.advanced,
					iconClass: 'weAdvancedToolbar',
					filterBuilder: this,
					showLabel: false,
					onClick: function () {
						var advPanel = new AdvancedOptionsPanel({ filterBuilder: this.filterBuilder });
						advPanel.on('closebuttonclicked', function () {
							popup.close(advPanel);
						});
						advPanel.startup();
						popup.open({
							parent: this,
							popup: advPanel,
							around: this.domNode,
							orient: ['below-centered', 'above-centered'],
							onExecute: function() {

							},
							onCancel: function() {

							},
							onClose: function() {

							}
						});
					}
				});

				toolbar.addChild(button);

				on(this.funnelNode, 'click', function () {
					function setWhereExpression(src) {
						self.set('whereExpression', src);
						self._updateExpression();
					}
					var childFilterBuilder = self.createNewFilterBuilder({ toolbar: null });
					var dialog = new Dialog({ parentFilterBuilder: self, closable: false, 'class': 'nineFbDialog', onHide: function(){
						setTimeout(function(){
							childFilterBuilder.destroyRecursive(false);
							dialog.destroyRecursive();
						}, 50);
					} });
					dialog.startup();
					childFilterBuilder.startup();
					childFilterBuilder.set('expression', self.get('whereExpression'));
					var childFilterNode = setClass(append(dialog.containerNode, 'div'), 'dijitDialogPaneContentArea', 'nineFbSubExpressionDialog');
					var actionBar = setClass(append(dialog.containerNode, 'div'), 'dijitDialogPaneActionBar');
					childFilterBuilder.placeAt(childFilterNode);
					var clearButton = new Button({ type: 'submit', label: resources.clear, 'class': 'njsFloatLeft', onClick: function() {
						setWhereExpression(null);
					}});
					clearButton.placeAt(actionBar);
					var okButton = new Button({ type: 'submit', label: resources.save, onClick: function() {
						setWhereExpression(childFilterBuilder.get('expression').clone());
					}});
					okButton.placeAt(actionBar);
					setClass(append(actionBar, 'span'), 'njsPad10');
					var cancelButton = new Button({ type: 'button', label: resources.cancel, onClick: function() {
						dialog.onCancel();
					}});
					cancelButton.placeAt(actionBar);
					dialog.own(cancelButton);
					dialog.own(clearButton);
					dialog.own(okButton);
					dialog.show();
				});


				this.set('toolbar', toolbar);
				toolbar.set('pasteButton', pasteButton);
				toolbar.set('addNewExpressionButton', addNewExpressionButton);
				toolbar.set('undoButton', undoButton);
				toolbar.set('redoButton', redoButton);

				this._setAllowMultipleExpressionsAttr(this.get('allowMultipleExpressions'));

				var helpDiv = domConstruct.create('div');
				domConstruct.place(helpDiv, toolbar.domNode, 'after');
				setText(setClass(helpDiv, 'helpNode'), resources.helpText);

				this.set('editMode', this.get('editMode'));
			}



			var self = this;

			this.on('newExpression', function(data)
			{
				var parent = self.get('parent');
				if (parent)
				{
					parent.emit('newExpression', data);
				}
				else
				{
					self.addNewExpression(data);
				}
			});

			this.on('check', function(data)
			{
				var value = data.value;

				self.get('checkBox').set('checked', !! value);

				if ( !! value)
				{
					this.emit('checked', data);
				}

				this._updateExpression();
			});

			this.on('checked', function(data)
			{
				//TODO implement
				var parent = self;
				while (parent.parent)
				{
					parent = parent.parent;
				}

				var checkedControls = parent._getRealCheckedExpressionControls();

				var canMultiCheck = true;
				if (checkedControls.length > 1)
				{ //Checking if we can multi-check at this point
					if (!areAllBrothers(checkedControls))
					{
						canMultiCheck = false;
					}
				}

				if (!canMultiCheck)
				{
					array.forEach(array.filter(checkedControls, function(item)
					{
						return item !== data.target;
					}), function(item)
					{
						item.get('checkBox').set('checked', false);
					});
				}

			});

			this.on('copy', lang.hitch(this, function(data)
			{
				if (this.parent)
				{
					this.parent.emit('copy', data);
				}
				else
				{
					var clipboardStrategy = this.get('clipboardStrategy');
					if (clipboardStrategy && clipboardStrategy.hasClipboard())
					{
						var checkedControls = this._getCheckedExpressionControls();

						var expression;
						if (checkedControls && checkedControls.length === 1)
						{
							expression = checkedControls[0].get('expression');
						}
						else
						{
							expression = this.get('expression');
						}
						clipboardStrategy.copy(expression);
						this.get('toolbar').get('pasteButton').set('disabled', !clipboardStrategy.hasClipboardData());
					}
				}
			}));

			this.on('paste', lang.hitch(this, function(data)
			{
				if (this.parent)
				{
					this.parent.emit('paste', data);
				}
				else
				{
					var clipboardStrategy = this.get('clipboardStrategy');
					if (clipboardStrategy && clipboardStrategy.hasClipboard() && clipboardStrategy.hasClipboardData())
					{

						var checkedControls = this._getCheckedExpressionControls();

						var expression = null;
						if (checkedControls && checkedControls.length === 1)
						{
							expression = checkedControls[0].get('expression');
						}
						clipboardStrategy.paste(expression);
					}
				}
			}));

			this.on('changeBooleanConfig', function(data)
			{
				var mode = data.mode,
					parent, setAllPositive;

				//get the most parent
				parent = self;
				while (parent.parent)
				{
					parent = parent.parent;
				}

				if (!parent.preventBooleanConfigPropagation)
				{
					parent.preventBooleanConfigPropagation = true;

					setAllPositive = function(expression)
					{
						expression.set('isNegative', false);
						//aka Positive
						if (expression.get('expressionList') && expression.get('expressionList').length)
						{
							array.forEach(expression.get('expressionList'), setAllPositive);
						}
					};

					var expression = parent.get('expression');

					switch (mode)
					{
					case 'allPositive':
						{
							setAllPositive(expression);
							setClass(parent.domNode, '!weCustomNegatives');
						}
						break;
					case 'allNegative':
						{
							setAllPositive(expression);
							expression.set('isNegative', true);
							setClass(parent.domNode, '!weCustomNegatives');
						}
						break;
					case 'allCustom':
						{
							setClass(parent.domNode, 'weCustomNegatives');
						}
						break;
					}

					parent.booleanConfigMode = mode;

					parent.set('expression', expression, true /* preventChange Undo State */ );

					parent.preventBooleanConfigPropagation = false;
				}
			});

			this.on('showMultiplePane', function(data) {
				var self = this;
				function getFloatPane() {
					if (!self.get('floatPane'))
					{
						var floatNode = domConstruct.create('div');
						domConstruct.place(floatNode, self.domNode);
						floatPane = new FloatingPane(
						{
							title: resources.withYourSelection,
							resizable: false,
							dockable: false,
							closable: false
						}, floatNode);
						floatPane.startup();
						self.set('floatPane', floatPane);

						//Building the floatPane toolbar
						var floatToolbarMain = domConstruct.create('div');

						floatPane.set('content', floatToolbarMain);

						floatToolbar = new Toolbar({}, floatToolbarMain);

						floatPane.set('toolbar', floatToolbar);
						floatToolbar.set('pane', floatPane);
						var groupButton = new Button(
						{
							toolbar: floatToolbar,
							showLabel: false,
							label: resources.group2,
							iconClass: 'weFilterBuilder weIconGroupExpression',
							onClick: function()
							{
								var filterBuilder = self.toolbar.get('pane').get('filterBuilder');
								filterBuilder.doGroup();
							}
						});
						floatToolbar.set('groupButton', groupButton);
						floatToolbar.addChild(groupButton);

						var unGroupButton = new Button(
						{
							toolbar: floatToolbar,
							showLabel: false,
							label: resources.degroup,
							iconClass: 'weFilterBuilder weIconUnGroupExpression',
							onClick: function()
							{
								var filterBuilder = self.toolbar.get('pane').get('filterBuilder');
								filterBuilder.doUnGroup();
							}
						});
						floatToolbar.set('unGroupButton', unGroupButton);
						floatToolbar.addChild(unGroupButton);
						var addNewButton = new Button(
						{
							toolbar: floatToolbar,
							showLabel: false,
							label: resources.addNewCondition,
							iconClass: 'weFilterBuilder weIconAdd',
							onClick: function()
							{
								var filterBuilder = self.toolbar.get('pane').get('filterBuilder');
								filterBuilder.emit('newExpression',
								{
									target: filterBuilder
								});
							}
						});
						floatToolbar.set('addNewButton', addNewButton);
						floatToolbar.addChild(addNewButton);

					}
					return self.get('floatPane');
				}
				if (this.parent)
				{
					this.emit('showMultiplePane', data);
				}
				else
				{
					var target = data.target,
						position,
						floatPane,
						paneCan = data.can,
						floatToolbar,
						canGroup = false,
						canUnGroup = false,
						parent;

					floatPane = getFloatPane(this);
					floatPane.set('filterBuilder', target);
					floatToolbar = floatPane.get('toolbar');
					domUtils.hide(floatToolbar.get('groupButton').domNode);
					domUtils.hide(floatToolbar.get('unGroupButton').domNode);
					domUtils.hide(floatToolbar.get('addNewButton').domNode);
					array.forEach(paneCan, function(item)
					{
						switch (item)
						{
						case 'group':
							domUtils.show(floatToolbar.get('groupButton').domNode);
							canGroup = true;
							break;
						case 'ungroup':
							domUtils.show(floatToolbar.get('unGroupButton').domNode);
							canUnGroup = true;
							break;
						case 'add':
							domUtils.show(floatToolbar.get('addNewButton').domNode);
							break;
						}
					});

					//Calculating length of the selection
					if (target.expressionListControls && target.expressionListControls.length)
					{
						var firstSelected = null;
						var selectionStart;
						var selectionLength = 0;
						array.forEach(target.expressionListControls, function(item, i)
						{
							if (item.get('checked'))
							{
								if (!firstSelected)
								{
									firstSelected = item;
									selectionStart = i;
								}
								selectionLength = i - selectionStart + 1;
							}
						});
						position = domGeometry.position(firstSelected.domNode);
						var sum = (this === target) ? 18 : 0;
						query('> *', target.domNode).some(function(item)
						{
							if (domClass.contains(item, 'mainContent'))
							{
								return true;
							}
							else
							{
								var thisPosition = domGeometry.position(item);
								sum += thisPosition.h;
								return false;
							}
						});

						position.y = sum + (selectionStart * 64);

						var nodeScroll = domGeometry.docScroll(firstSelected.domNode);
						position.x += nodeScroll.x;
						position.y += nodeScroll.y;
						var floatStyle =
						{
							left: (position.x + (position.w / 2)) + 'px',
							top: position.y + 'px',
							height: ((position.h * ((2 * selectionLength) - 1)) - 41) + 'px',
							width: '35px'
						};
						//Checking my displayed level
						parent = target;
						var parentCount = 0;
						while (parent.parent)
						{
							parent = parent.parent;
							parentCount += 1;
						}
						var cnt;
						for (cnt = 0; cnt < parent.maxMultipleCssLevels; cnt += 1)
						{
							setClass(floatPane.domNode, ('!weLevel' + (cnt + 1)));
						}

						if (parentCount > 0)
						{
							if (canGroup)
							{
								setClass(floatPane.domNode, ('weLevel') + ((parentCount + 1) % parent.maxMultipleCssLevels));
							}
							else if (canUnGroup)
							{
								if (parentCount > 1)
								{
									setClass(floatPane.domNode, ('weLevel') + ((parentCount - 1) % parent.maxMultipleCssLevels));
								}
							}
						}

						domConstruct.place(floatPane.domNode, target.domNode);

						floatPane.show();
						domStyle.set(floatPane.domNode, floatStyle);
					}
				}
			});

			this.on('hideMultiplePane', function(data)
			{
				if (this.parent)
				{
					this.parent.emit('hideMultiplePane', data);
				}
				else
				{
					var floatPane = this.get('floatPane');
					if (floatPane)
					{
						floatPane.hide();
					}
				}
			});

			this._stopUpdatingExpression = false;

		},

		startup: function () {
			var self = this;
			this.inherited(arguments);

			if (!cssInitialized) {
				FilterBuilder.Css.enable();
				cssInitialized = true;
			}

			domConstruct.place(this.selectedSummarySelect.domNode, this.selectedSummarySelectNode);

			domConstruct.place(this.selectedFieldSelect.domNode, this.selectedFieldSelectNode);

			domConstruct.place(this.selectedOperatorSelect.domNode, this.selectedOperatorSelectNode);

			this.selectedValueSelect.show().then(function () {
				domConstruct.place(self.selectedValueSelect.domNode, self.selectedValueSelectNode);

				self._updateSummaryValues();
				self.selectedSummarySelect.set('value', null);

				self.set('fieldList', self.get('fieldList'));
				self.set('expression', null, true /* preventChange Undo State */ );
				self.selectedValueSelect.set('dataType', 'alphanumeric');
				self.selectedValueSelect.set('value', null);

				self.emit('stateChanged', {
					state: 'start'
				});
			});
		},

		destroyDescendants: function()
		{
			array.forEach(this._multipleExpressionLinks, function(item)
			{
				item.destroy();
			});
			array.forEach(this.expressionListControls, function(item)
			{
				item.destroy();
			});
			this.inherited(arguments);
		},
		_getEditModeAttr: function()
		{
			return this.parent ? this.parent.get('editMode') : this.editMode;
		},
		_setEditModeAttr: function(mode)
		{
			function recurseClearEditMode(controls)
			{
				array.forEach(controls, function(item)
				{
					setClass(item.domNode, '!unRestricted');
					setClass(item.domNode, '!strict');
					if (item.expressionListControls && item.expressionListControls.length)
					{
						recurseClearEditMode(item.expressionListControls);
					}
				});
			}

			if (this.parent)
			{
				this.parent.set('editMode', mode);
			}
			else if ((mode === 'strict') || (mode === 'unRestricted'))
			{
				if (this.get('toolbar'))
				{
					this.editMode = mode;

					var parent;

					if (mode)
					{
						//get the most parent
						parent = this;
						while (parent.parent)
						{
							parent = parent.parent;
						}

						if (!parent.preventEditConfigPropagation)
						{
							parent.preventEditConfigPropagation = true;

							parent.editMode = mode;
							setClass(parent.domNode, '!strict');
							setClass(parent.domNode, '!unRestricted');
							setClass(parent.domNode, mode);

							parent._updateExpression();

							if (parent.expressionListControls && parent.expressionListControls.length)
							{
								recurseClearEditMode(parent.expressionListControls);
							}

							parent.preventEditConfigPropagation = false;
						}
					}
				}
			}
		}
	});
	FilterBuilder.Css = filterBuilderCss;

	return FilterBuilder;
});