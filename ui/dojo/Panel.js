define(['../../core/extend', '../Widget', './ContentPaneExtension'], function(extend, Widget, ContentPaneExtension) {
	'use strict';
	extend = extend.default;
	Widget = Widget.default;
	var Panel = extend(Widget, ContentPaneExtension, {
		startup: function() {
			this.show.call(this, arguments);
		}
	}, function() {
		/* jshint unused: true */
		/* globals window: true */
		this.$njsConstructors.push(function(args, refNode){
			if (refNode) {
				if (typeof(refNode) === 'string'){
					refNode = window.document.getElementById(refNode);
				}
				this.show();
				refNode.appendChild(this.domNode);
			}
		});
	});
	return Panel;
});