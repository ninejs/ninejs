'use strict';
require('blanket')({
	pattern: function(src) {
		var regs = [
				/node_modules/,
				/tests/,
				/template\-generated\.js/,
				/nineplate\/utils\/functions\.js/
			],
			cnt;
		for (cnt = 0; cnt < regs.length; cnt += 1) {
			if (regs[cnt].test(src)) {
				return false;
			}
		}
		return true;
	}
	//pattern: 
});