define(['../../core/extend'], function(extend) {
	'use strict';
	extend = extend.default;
	var ContentPane = extend({
		_set: function(name, value) {
			this[name] = value;
		},
		startup: function() {
			this.show();
		}
	});
	return ContentPane;
});