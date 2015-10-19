define(['../core/extend', './Widget', './bootstrap/Button', './Skins/Wizard/Default', '../core/array'], function(extend, Widget, Button, DefaultSkin, array) {
	'use strict';
	extend = extend.default;
	Widget = Widget.default;

	function i18n(key) {
		return key;
	}
	var Wizard = extend(Widget, {
		skin: DefaultSkin,
		stepList: [],
		ButtonConstructor: Button,
		i18n: i18n,
		addStep: function(panel, beforePanel) {
			var cnt, stepList = this.stepList, current;
			if (beforePanel) {
				for (cnt = 0; cnt < stepList.length; cnt += 1){
					current = stepList[cnt];
					if (current === beforePanel){
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
			if (!this.get('currentStep')){
				this.set('currentStep', panel);
			}
		},
		currentStepSetter: function(step) {
			var currentStep = this.get('currentStep'), currentIndex = array.indexOf(this.stepList, currentStep), targetIndex, tempStep = currentStep;
			if (typeof(step) === 'number'){
				targetIndex = step;
				step = this.stepList[step];
			}
			if (currentStep !== step) {
				if (typeof(targetIndex) === 'undefined') {
					targetIndex = array.indexOf(this.stepList, step);
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
		},
		show: extend.after(function() {
			var cnt, stepList = this.stepList, current;
			for(cnt = 0; cnt < stepList.length; cnt += 1){
				current = stepList[cnt];
				current.show(this.containerNode);
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
		}),
		updateSkin: extend.after(function() {
			var self = this;
			this.helpButton.on('click', function() {
				self.showHelp();
			});
			this.previousButton.on('click', function() {
				self.set('currentStep', self.get('currentStep').previousPanel);
			});
			this.nextButton.on('click', function() {
				self.set('currentStep', self.get('currentStep').nextPanel);
			});
			this.finishButton.on('click', function() {
				self.finish();
			});
			this.cancelButton.on('click', function() {
				self.cancel();
			});
		}),
		showHelp: function() {

		},
		finish: function() {

		},
		cancel: function() {

		}
	}, function() {
		var Button = this.ButtonConstructor;
		this.helpButton = new Button({ label: i18n('Help') });
		this.previousButton = new Button({ label: '< ' + i18n('Back') });
		this.nextButton = new Button({ label: i18n('Next') + ' >' });
		this.finishButton = new Button({ label: i18n('Finish') });
		this.cancelButton = new Button({ label: i18n('Cancel') });
	});
	return Wizard;
});