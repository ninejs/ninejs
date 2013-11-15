define(['./Module'], function(Module) {
	'use strict';
	var result = new Module({
		provides: [
			{
				id: 'ninejs',
				version: '0.0.1'
			}
		]
	});
	return result;
});