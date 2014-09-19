define(['../core/deferredUtils',
	'../core/extend', './utils/setClass', './Widget', '../css!./css/common.css'], function(def, extend, setClass, Widget, commonCss) {
	'use strict';
	commonCss.enable();
	function insertAfter(node, ref) {
		var parent = ref.parentNode;
		if(parent){
			if(parent.lastChild === ref){
				parent.appendChild(node);
			}else{
				parent.insertBefore(node, ref.nextSibling);
			}
		}
	}
	function insertBefore(node, ref) {
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
	var TransitionPanel = extend(Widget, {
		transitionDuration: 750,
		transitionClass: transitionClass,
		activeTransitionClass: defaultTransitionClasses.active,
		previousTransitionClass: defaultTransitionClasses.prev,
		nextTransitionClass: defaultTransitionClasses['next'],
		leftTransitionClass: defaultTransitionClasses.left,
		rightTransitionClass: defaultTransitionClasses.right,
		show: extend.after(function() {
			var self = this;
			def.when(this.domNode, function () {
				setClass(self.domNode, self.transitionClass);
			});
		}),
		activeSetter: function(value) {
			var self = this;
			this.active = value;
			if (value) {
				def.when(this.domNode, function () {
					setClass(self.domNode, self.activeTransitionClass);
					self.emit('show', {});
				});
			}
			else {
				def.when(this.domNode, function () {
					setClass(self.domNode, '!' + self.activeTransitionClass);
					self.emit('hide', {});
				});
			}
		},
		previousPanelSetter: function(value) {
			var oldPrev = this.previousPanel;
			this.previousPanel = value;
			if (this.previousPanel) {
				if (oldPrev) {
					oldPrev.nextPanel = this.previousPanel;
					this.previousPanel.previousPanel = oldPrev;
				}
				this.previousPanel.nextPanel = this;
				this.show();
				this.previousPanel.show();
				this.setPreviousBefore();
			}
		},
		nextPanelSetter: function(value) {
			var oldNext = this.nextPanel;
			this.nextPanel = value;
			if (this.nextPanel) {
				if (oldNext) {
					oldNext.previousPanel = this.nextPanel;
					this.nextPanel.nextPanel = oldNext;
				}
				this.nextPanel.previousPanel = this;
				this.show();
				this.nextPanel.show();
				this.setNextAfter();
			}
		},
		setNextAfter: function() {
			if (!this.nextPanel.domNode) {
				this.nextPanel.show(this.domNode.parentNode);
			}
			if (this.nextPanel.domNode.parentNode && (this.domNode.parentNode !== this.nextPanel.domNode.parentNode)) {
				setClass(this.domNode, this.nextTransitionClass);
				insertBefore(this.domNode, this.nextPanel.domNode);
				if (this.get('active')) {
					setClass(this.nextPanel.domNode, this.nextPanel.nextTransitionClass);
				}
			}
		},
		setPreviousBefore: function() {
			if (!this.previousPanel.domNode) {
				this.previousPanel.show(this.domNode.parentNode);
			}
			if (this.previousPanel.domNode.parentNode && (this.domNode.parentNode !== this.previousPanel.domNode.parentNode)) {
				setClass(this.domNode, this.nextTransitionClass);
				insertAfter(this.domNode, this.previousPanel.domNode);
				if (this.get('active')) {
					setClass(this.previousPanel.domNode, this.previousPanel.previousTransitionClass);
				}
			}
		},
		next: function() {
			if (!this.nextPanel){
				throw new Error('TransitionPanel must have an assigned nextPanel');
			}
			if (this.previousPanel) {
				this.previousPanel.set('isLeft', false);
			}
//			setClass(this.domNode, this.transitionClass, '!' + this.nextTransitionClass, '!' + this.activeTransitionClass, this.previousTransitionClass);
//			setClass(this.nextPanel.domNode, '!' + this.nextTransitionClass, '!' + this.previousTransitionClass, this.activeTransitionClass);
			var self = this;
			setClass(this.domNode, this.leftTransitionClass);
			setClass(this.nextPanel.domNode, this.nextTransitionClass, this.leftTransitionClass);
			setTimeout(function() {
				setClass(self.domNode, '!' + self.leftTransitionClass, '!' + self.activeTransitionClass);
				setClass(self.nextPanel.domNode, '!' + self.nextTransitionClass, '!' + self.leftTransitionClass, self.activeTransitionClass);
			}, this.transitionDuration);
			this.active = false;//didn't call setter to avoid transitioning
			this.nextPanel.active = true;
//			if (this.nextPanel.nextPanel) {
//				this.nextPanel.nextPanel.set('isRight', true);
//			}
			this.emit('hide', {});
			this.nextPanel.emit('show', {});
			return this.nextPanel;
		},
		previous: function() {
			if (!this.previousPanel){
				throw new Error('TransitionPanel must have an assigned previousPanel');
			}
			if (this.nextPanel) {
				this.nextPanel.set('isRight', false);
			}
//			setClass(this.previousPanel.domNode, '!' + this.nextTransitionClass, '!' + this.previousTransitionClass, this.activeTransitionClass);
//			setClass(this.domNode, '!' + this.previousTransitionClass, '!' + this.activeTransitionClass, this.nextTransitionClass);
			var self = this;
			setClass(this.domNode, this.rightTransitionClass);
			setClass(this.previousPanel.domNode, this.previousTransitionClass, this.rightTransitionClass);
			setTimeout(function() {
				setClass(self.domNode, '!' + self.rightTransitionClass, '!' + self.activeTransitionClass);
				setClass(self.previousPanel.domNode, '!' + self.previousTransitionClass, '!' + self.rightTransitionClass, self.activeTransitionClass);
			}, this.transitionDuration);
			this.active = false;//didn't call setter to avoid transitioning
			this.previousPanel.active = true;
//			if (this.previousPanel.previousPanel) {
//				this.previousPanel.previousPanel.set('isLeft', true);
//			}
			this.emit('hide', {});
			this.previousPanel.emit('show', {});
			return this.previousPanel;
		}
	});
	return TransitionPanel;
});