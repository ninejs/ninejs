'use strict';

declare var require: any;
let fs: any;

export function load(name: string, req: any, onLoad: Function/*, config*/) {
	if (!fs) {
		fs = require('fs');
	}
	if (req.toUrl) {
		name = req.toUrl(name);
	}
	fs.readFile(name, 'utf8', function(error: any, data: string) {
		if (error) {
			throw new Error(error);
		}
		else {
			onLoad(data);
		}
	});
}