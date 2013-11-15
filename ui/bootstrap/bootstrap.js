define(['./BootstrapProto'], function(Bootstrap) {
	'use strict';
	var bootstrap = new Bootstrap();
	bootstrap.enable('css');
	bootstrap.enable('commonCss');
	bootstrap.enable('gridMax');
	return bootstrap;
});