define(['../css'], function(css) {
	'use strict';
	return {
		load: function() {
			var id = arguments[0];
			var cnt, args = [];
			for (cnt = 0; cnt < arguments.length; cnt += 1){
				args.push(arguments[cnt]);
			}
			if (!(/\!/.test(id))) {
				args[0] = id + '!enable';
			}
			return css.load.apply(this, args);
		}
	};
});