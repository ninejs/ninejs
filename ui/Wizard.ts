/// <amd-dependency path="./Skins/Wizard/Default" name="DefaultSkin" />

'use strict';

import Widget from './Widget'
import Button from './bootstrap/Button'
import TransitionPanel from './TransitionPanel'
import {WidgetArgs} from "./Widget";
import Skin from "./Skin";
import {when} from "../core/deferredUtils";
import {ButtonArgs} from "./bootstrap/Button";

declare var DefaultSkin: Skin;


function i18n(key: string) {
	return key;
}
class Wizard extends Widget {
	skin: Skin;
	stepList: TransitionPanel [];
	ButtonConstructor: { new (args: ButtonArgs): Button };
	i18n: (v: string) => string;
	containerNode: HTMLElement;
	currentStep: TransitionPanel;
	helpButton: Button;
	previousButton: Button;
	nextButton: Button;
	finishButton: Button;
	cancelButton: Button;
	addStep (panel: TransitionPanel, beforePanel: TransitionPanel) {
		var cnt: number, stepList = this.stepList, current: TransitionPanel;
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
	}
	currentStepSetter (step: TransitionPanel | number) {
		var currentStep = this.get('currentStep'), currentIndex = this.stepList.indexOf(currentStep), targetIndex: number, tempStep = currentStep;
		if (typeof(step) === 'number'){
			targetIndex = step as number;
			step = this.stepList[step as number];
		}
		if (currentStep !== step) {
			if (typeof(targetIndex) === 'undefined') {
				targetIndex = this.stepList.indexOf(step as TransitionPanel);
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
			this.currentStep = step as TransitionPanel;
			if (this.domNode) {
				this.emit('stepChanged', { index: targetIndex, step: step });
			}
		}
	}
	show () {
		return when(super.show(), (domNode) => {
			var cnt: number, stepList = this.stepList, current: TransitionPanel;
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
			return domNode;
		});
	}
	onUpdatedSkin () {
		super.onUpdatedSkin();
		this.helpButton.on('click', () => {
			this.showHelp();
		});
		this.previousButton.on('click', () => {
			this.set('currentStep', this.get('currentStep').previousPanel);
		});
		this.nextButton.on('click', () => {
			this.set('currentStep', this.get('currentStep').nextPanel);
		});
		this.finishButton.on('click', () => {
			this.finish();
		});
		this.cancelButton.on('click', () => {
			this.cancel();
		});
	}
	showHelp () {

	}
	finish () {

	}
	cancel () {

	}
	constructor (args: WidgetArgs) {
		super(args);
		var Button = this.ButtonConstructor;
		this.helpButton = new Button({ label: i18n('Help') });
		this.previousButton = new Button({ label: '< ' + i18n('Back') });
		this.nextButton = new Button({ label: i18n('Next') + ' >' });
		this.finishButton = new Button({ label: i18n('Finish') });
		this.cancelButton = new Button({ label: i18n('Cancel') });
	}
}

Wizard.prototype.skin = DefaultSkin;
Wizard.prototype.stepList = [];
Wizard.prototype.ButtonConstructor = Button;
Wizard.prototype.i18n = i18n;

export default Wizard;