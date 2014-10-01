define(['../core/extend', '../core/ext/Properties', '../nineplate', '../core/deferredUtils'], function(extend, Properties, nineplate, def){
	'use strict';
	var Skin = extend('9js.Skin', {
		cssList: [],
		template: null,
		enabled: false,
		applies: function() { //override to define a 'rule' that tells whether this skin applies or not to your widget
			return true;
		},
		templateSetter: function(value) {
			if (typeof(value) === 'function') {
				this.template = value;
			}
			else if (value && value.compileDom) {
				this.template = value.compileDom(true);
			}
			else {
				this.template = value;
			}
		},
		enable: function(widget) {
			var cnt,
				nTemplate,
				templateResult,
				self = this,
				defer = def.defer();
			if (this.cssList){
				for(cnt = 0; cnt < this.cssList.length; cnt += 1) {
					this.cssList[cnt] = this.cssList[cnt].enable();
				}
			}
			if (this.template) {
				if (typeof(this.template) === 'string') {
					nTemplate = nineplate.buildTemplate(this.template);
					this.template = nTemplate.compileDom(true);
				}
				var parentNode;
				var oldNode;
				if (widget.domNode && widget.domNode.parentNode) {
					parentNode = widget.domNode.parentNode;
					oldNode = widget.domNode;
				}
				var afterLoadDeps = function () {
					templateResult = self.template(widget);
					if (widget.mixinProperties){
						widget.mixinProperties(templateResult);
					}
					else {
						extend.mixin(widget, templateResult);
					}
					if (parentNode) {
						parentNode.replaceChild(widget.domNode, oldNode);
					}
					defer.resolve(true);
				};
				if (this.template.amdDependencies && this.template.amdDependencies.length) {
					require(this.template.amdDependencies || [], afterLoadDeps);
				}
				else {
					afterLoadDeps();
				}
			}
			return defer.promise;
		},
		disable: function() {
			var cnt=0;
			if (this.cssList){
				for(cnt = 0; cnt < this.cssList.length; cnt += 1) {
					this.cssList[cnt] = this.cssList[cnt].disable();
				}
			}
		},
		updated: function() {
		}
	}, Properties);
	return Skin;
});