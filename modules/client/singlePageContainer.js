define(['../Module', '../../core/extend', './FullScreenFrame', '../../ui/bootstrap/bootstrap'], function(Module, extend, FullScreenFrame, bootstrap) {
	'use strict';
	bootstrap.enable('vresponsiveViewPort');
	var container;
	var FrameModule = Module.extend({
		getProvides: function(name) {
			if (name === 'singlePageContainer') {
				return container;
			}
			return null;
		},
		init: extend.after(function(/*name, config*/) {
			/* jshint browser: true */
			var containerModule = this.getUnit('container');
			container =  new FullScreenFrame();
			container.show(window.document.body);
			containerModule.setContainer('singlePageContainer', container);
		}),
		consumes: [
			{
				id: 'ninejs'
			},
			{
				id: 'container'
			}
		],
		provides: [
			{
				id: 'singlePageContainer'
			}
		]
	});
	var result = new FrameModule();
	return result;
});