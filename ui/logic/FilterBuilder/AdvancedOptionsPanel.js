/* jshint strict: false */
define(['dojo/_base/declare', 'dijit/layout/ContentPane', 'dijit/form/RadioButton', 'dijit/_TemplatedMixin', 'dojo/text!./AdvancedOptionsPanel.html', 'dojo/on', 'dijit/TooltipDialog', 'dijit/popup', 'dojo/dom-class', '../../utils/domUtils', '../../utils/setText', 'dojo/i18n!../nls/FilterBuilder'], function(declare, ContentPane, RadioButton, TemplatedMixin, template, on, TooltipDialog, popup, domClass, domUtils, setText, resources) {
	return declare([ContentPane, TemplatedMixin], {
		template: true,
		templateString: template,
		baseClass: 'nineFbAdvancedOptionsPanel dijitContentPane',
		postCreate: function() {
			this.inherited(arguments);
			var self = this || on;
			this.tooltipDialog = new TooltipDialog(
			{
				style: 'width: 300px;',
				'class': 'helpTooltip',
				parseOnLoad: false,
				content: '<div></div>'
			});
			//Dealing with attach points
			//helpIcon
			domUtils.enableHovering(this.helpIcon, function(e)
			{
				domClass.add(e.currentTarget, 'njsHover');
				self.tooltipDialog.set('content', '');
				popup.open(
				{
					parent: self,
					popup: self.tooltipDialog,
					around: self.helpIcon
				});
			}, function(e)
			{
				domClass.remove(e.currentTarget, 'njsHover');
				popup.close(self.tooltipDialog);
			});
			domUtils.enableHovering(this.closeIcon, function(e)
			{
				domClass.add(e.currentTarget, 'dijitHover');
				self.tooltipDialog.set('content', resources['close']);
				popup.open(
				{
					parent: self,
					popup: self.tooltipDialog,
					around: self.closeIcon
				});
			}, function(e)
			{
				domClass.remove(e.currentTarget, 'dijitHover');
				popup.close(self.tooltipDialog);
			});
			on(this.closeIcon, 'click', function() {
				self.emit('closebuttonclicked', {});
			});

			//titleNode
			setText(this.titleNode, resources['configurationOptions']);
			//messageNode
			setText(this.messageNode, resources['advancedConfigurationOptionsMessage']);
			//conditionEvaluationMessageNode
			setText(this.conditionEvaluationMessageNode, resources['conditionsEvaluation']);
			//conditionEvaluationDescriptionNode
			setText(this.conditionEvaluationDescriptionNode, resources['conditionsEvaluationDescription']);
			//conditionModeMessageNode
			setText(this.conditionModeMessageNode, resources['configurationModes']);
			//trueRbNode
			this.conditionTrueRadioButton = new RadioButton({ name: 'evaluationMode' }, this.trueRbNode);
			//trueNode
			setText(this.trueNode, resources['trueF']);
			this.trueNode.setAttribute('for', this.conditionTrueRadioButton.get('id'));
			//falseRbNode
			this.conditionFalseRadioButton = new RadioButton({ name: 'evaluationMode' }, this.falseRbNode);
			//falseNode
			setText(this.falseNode, resources['falseF']);
			this.falseNode.setAttribute('for', this.conditionFalseRadioButton.get('id'));
			//customRbNode
			this.conditionCustomRadioButton = new RadioButton({ name: 'evaluationMode' }, this.customRbNode);
			//customNode
			setText(this.customNode, resources['iWillControl']);
			this.customNode.setAttribute('for', this.conditionCustomRadioButton.get('id'));
			//stepByStepRbNode
			this.strictModeRadioButton = new RadioButton({ name: 'configMode' }, this.stepByStepRbNode);
			//strictNode
			setText(this.strictNode, resources['userGuidedStepByStep']);
			this.strictNode.setAttribute('for', this.strictModeRadioButton.get('id'));
			//stepByStepDescriptionNode
			setText(this.stepByStepDescriptionNode, resources['avoidsSyntaxErrors']);
			this.stepByStepDescriptionNode.setAttribute('for', this.strictModeRadioButton.get('id'));
			//advancedModeRbNode
			this.unrestrictedModeRadioButton = new RadioButton({ name: 'configMode' }, this.advancedModeRbNode);
			//unrestrictedNode
			setText(this.unrestrictedNode, resources['expertUser']);
			this.unrestrictedNode.setAttribute('for', this.unrestrictedModeRadioButton.get('id'));
			//advancedModeDescriptionNode
			setText(this.advancedModeDescriptionNode, resources['advancedModeMessage']);
			this.advancedModeDescriptionNode.setAttribute('for', this.unrestrictedModeRadioButton.get('id'));
			if (this.filterBuilder.get('editMode') === 'unRestricted'){
				this.unrestrictedModeRadioButton.set('value', 'on');
			}
			else if (this.filterBuilder.get('editMode') === 'strict'){
				this.strictModeRadioButton.set('value', 'on');
			}
			var booleanConfig = this.filterBuilder._calculateBooleanConfig();
			if (booleanConfig === 'allPositive'){
				this.conditionTrueRadioButton.set('value', 'on');
			}
			else if (booleanConfig === 'allNegative'){
				this.conditionFalseRadioButton.set('value', 'on');
			}
			else if (booleanConfig === 'allCustom'){
				this.conditionCustomRadioButton.set('value', 'on');
			}

			this.unrestrictedModeRadioButton.on('change', function() {
				if (this.get('value')) {
					self.filterBuilder.set('editMode', 'unRestricted');
				}
			});
			this.strictModeRadioButton.on('change', function() {
				if (this.get('value')) {
					self.filterBuilder.set('editMode', 'strict');
				}
			});
			this.conditionTrueRadioButton.on('change', function() {
				if (this.get('value')) {
					self.filterBuilder.emit('changeBooleanConfig',
					{
						mode: 'allPositive'
					});
				}
			});
			this.conditionFalseRadioButton.on('change', function() {
				if (this.get('value')) {
					self.filterBuilder.emit('changeBooleanConfig',
					{
						mode: 'allNegative'
					});
				}
			});
			this.conditionCustomRadioButton.on('change', function() {
				if (this.get('value')) {
					self.filterBuilder.emit('changeBooleanConfig',
					{
						mode: 'allCustom'
					});
				}
			});
		}
	});
});