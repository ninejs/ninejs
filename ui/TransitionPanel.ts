/// <amd-dependency path="./css/common.ncss" name="commonCss" />
'use strict';
import { when, resolve } from '../core/deferredUtils'
import setClass from './utils/setClass'
import Widget from './Widget'

declare var commonCss: any;


commonCss.enable();
function insertAfter(node: HTMLElement, ref: HTMLElement) {
	var parent = ref.parentNode;
	if(parent){
		if(parent.lastChild === ref){
			parent.appendChild(node);
		}else{
			parent.insertBefore(node, ref.nextSibling);
		}
	}
}
function insertBefore(node: HTMLElement, ref: HTMLElement) {
	var parent = ref.parentNode;
	if(parent){
		parent.insertBefore(node, ref);
	}
}
var transitionClass = 'njsTransition750ms',
	defaultTransitionClasses = {
		active: 'njsTransitionActive',
		prev: 'njsTransitionPrev',
		next: 'njsTransitionNext',
		left: 'njsTransitionLeft',
		right: 'njsTransitionRight'
	};

export class TransitionPanel extends Widget {
	transitionDuration: number;
	transitionClass: string;
	activeTransitionClass: string;
	previousTransitionClass: string;
	nextTransitionClass: string;
	leftTransitionClass: string;
	rightTransitionClass: string;

	active: boolean;
	previousPanel: TransitionPanel;
	nextPanel: TransitionPanel;
	show (parent?: HTMLElement) {
		return when(super.show(parent), () => {
			let domNode = this.domNode as HTMLElement;
			setClass(domNode, this.transitionClass);
			return domNode;
		});
	}
	activeSetter (value: boolean) {
		this.active = value;
		return when(this.domNode, (domNode) => {
			setClass(domNode, ((value)?'':'!') + this.activeTransitionClass);
			if (value) {
				this.emit('show', {});
			}
			else {
				this.emit('hide', {});
			}
		});
	}
	previousPanelSetter (value: TransitionPanel) {
		var oldPrev = this.previousPanel;
		this.previousPanel = value;
		if (this.previousPanel) {
			if (oldPrev) {
				oldPrev.nextPanel = this.previousPanel;
				this.previousPanel.previousPanel = oldPrev;
			}
			this.previousPanel.nextPanel = this;
			return when(this.show(), () => {
				return when(this.previousPanel.show(), (previousDomNode) => {
					this.setPreviousBefore();
					return previousDomNode;
				});
			});
		}
		else {
			return resolve(this.domNode);
		}
	}
	nextPanelSetter (value: TransitionPanel) {
		var oldNext = this.nextPanel;
		this.nextPanel = value;
		if (this.nextPanel) {
			if (oldNext) {
				oldNext.previousPanel = this.nextPanel;
				this.nextPanel.nextPanel = oldNext;
			}
			this.nextPanel.previousPanel = this;
			return when (this.show(), () => {
				return when (this.nextPanel.show(), (nextDomNode) => {
					this.setNextAfter();
					return nextDomNode;
				});
			});
		}
		else {
			return resolve(this.domNode);
		}
	}
	setNextAfter () {
		return when (this.domNode, (domNode) => {
			return when (this.nextPanel.show(domNode.parentElement), () => {
				let nextDomNode = this.nextPanel.domNode as HTMLElement;
				if (nextDomNode.parentNode && (domNode.parentNode !== nextDomNode.parentNode)) {
					setClass(domNode, this.nextTransitionClass);
					insertBefore(domNode, nextDomNode);
					if (this.active) {
						setClass(nextDomNode, this.nextPanel.nextTransitionClass);
					}
				}
			});
		});
	}
	setPreviousBefore () {
		return when (this.domNode, (domNode) => {
			return when(this.nextPanel.show(domNode.parentElement), () => {
				let previousDomNode = this.previousPanel.domNode as HTMLElement;
				if (previousDomNode.parentNode && (domNode.parentNode !== previousDomNode.parentNode)) {
					setClass(domNode, this.previousTransitionClass);
					insertAfter(domNode, previousDomNode);
					if (this.active) {
						setClass(previousDomNode, this.previousPanel.previousTransitionClass);
					}
				}
			});
		});
	}
	next () {
		if (!this.nextPanel){
			throw new Error('TransitionPanel must have an assigned nextPanel');
		}
		if (this.previousPanel) {
			this.previousPanel.set('isLeft', false);
		}
		return when (this.domNode, (domNode) => {
//			setClass(this.domNode, this.transitionClass, '!' + this.nextTransitionClass, '!' + this.activeTransitionClass, this.previousTransitionClass);
//			setClass(this.nextPanel.domNode, '!' + this.nextTransitionClass, '!' + this.previousTransitionClass, this.activeTransitionClass);
			setClass(domNode, this.leftTransitionClass);
			let nextDomNode = this.nextPanel.domNode as HTMLElement;
			setClass(nextDomNode, this.nextTransitionClass, this.leftTransitionClass);
			setTimeout(() => {
				setClass(domNode, '!' + this.leftTransitionClass, '!' + this.activeTransitionClass);
				setClass(nextDomNode, '!' + this.nextTransitionClass, '!' + this.leftTransitionClass, this.activeTransitionClass);
			}, this.transitionDuration);
			this.active = false;//didn't call setter to avoid transitioning
			this.nextPanel.active = true;
//			if (this.nextPanel.nextPanel) {
//				this.nextPanel.nextPanel.set('isRight', true);
//			}
			this.emit('hide', {});
			this.nextPanel.emit('show', {});
			return this.nextPanel;
		});
	}
	previous () {
		if (!this.previousPanel){
			throw new Error('TransitionPanel must have an assigned previousPanel');
		}
		if (this.nextPanel) {
			this.nextPanel.set('isRight', false);
		}
		return when (this.domNode, (domNode) => {
//			setClass(this.previousPanel.domNode, '!' + this.nextTransitionClass, '!' + this.previousTransitionClass, this.activeTransitionClass);
//			setClass(this.domNode, '!' + this.previousTransitionClass, '!' + this.activeTransitionClass, this.nextTransitionClass);
			setClass(domNode, this.rightTransitionClass);
			let previousDomNode = this.previousPanel.domNode as HTMLElement;
			setClass(previousDomNode, this.previousTransitionClass, this.rightTransitionClass);
			setTimeout(() => {
				setClass(domNode, '!' + this.rightTransitionClass, '!' + this.activeTransitionClass);
				setClass(previousDomNode, '!' + this.previousTransitionClass, '!' + this.rightTransitionClass, this.activeTransitionClass);
			}, this.transitionDuration);
			this.active = false;//didn't call setter to avoid transitioning
			this.previousPanel.active = true;
//			if (this.previousPanel.previousPanel) {
//				this.previousPanel.previousPanel.set('isLeft', true);
//			}
			this.emit('hide', {});
			this.previousPanel.emit('show', {});
			return this.previousPanel;
		});
	}
}

TransitionPanel.prototype.transitionDuration = 750;
TransitionPanel.prototype.transitionClass = transitionClass;
TransitionPanel.prototype.activeTransitionClass = defaultTransitionClasses.active;
TransitionPanel.prototype.previousTransitionClass = defaultTransitionClasses.prev;
TransitionPanel.prototype.nextTransitionClass = defaultTransitionClasses['next'];
TransitionPanel.prototype.leftTransitionClass = defaultTransitionClasses.left;
TransitionPanel.prototype.rightTransitionClass = defaultTransitionClasses.right;

export default TransitionPanel