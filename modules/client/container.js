define(['../Module', '../../core/extend'], function(Module, extend) {
	'use strict';
	var Container = function() {
		var containerList = {};
		this.setContainer = function(name, obj) {
			containerList[name] = obj;
		};
		this.getContainer = function(name) {
			return containerList[name];
		};
	};
	var container = new Container();
	var ContainerModule = Module.extend({
		getProvides: function(name) {
			if (name === 'container') {
				return container;
			}
			return null;
		},
		init: extend.after(function(/*name, config*/) {
			/* jshint browser: true */
		}),
		consumes: [
			{
				id: 'ninejs'
			}
		],
		provides: [
			{
				id: 'container'
			}
		]
	});
	var result = new ContainerModule();
	return result;
});