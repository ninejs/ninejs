'use strict';

import * as css from '../css';

export function load(...args: any[]) {
	var id = args[0];
	if (!(/\!/.test(id))) {
		args[0] = id + '!enable';
	}
	return css.load.apply(this, args);
}