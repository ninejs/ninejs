/// <reference path="../../../typings/node/node.d.ts" />
import fs = require('fs');

export function load(name: string, req: any, onLoad: Function/*, config*/) {
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