/// <reference path="../../typings/express/express.d.ts" />
import StaticResource from './StaticResource';
import express = require('express');
import { Request, Response } from './WebServer';

class NineplateResource extends StaticResource {
	type: string;
	contentType: string;
	doctype: string;
	context: any;
	handler (req: Request, res: Response) {
		/* jshint unused: true */
		var props = this.props || {},
			p: string,
			self = this;
		res.set('Content-Type', this.contentType);
		for (p in props) {
			if (props.hasOwnProperty(p)) {
				res.set(p, props[p]);
			}
		}
		this.app.render(this.path, this.context, function(err: any, html: string) {
			var result: string;
			if (err) {
				res.send(err);
			}
			else {
				result = (self.doctype?'<!DOCTYPE ' + self.doctype + '>\n':'') + html;
				self.emit('result', { data: result, response: res });
				res.end(result);
			}
		});
	}
	constructor (arg: any) {
		super(arg);
	}
}

NineplateResource.prototype.type = 'endpoint';
NineplateResource.prototype.contentType = 'text/html; charset=utf-8';
NineplateResource.prototype.doctype = 'html';
NineplateResource.prototype.context = {};

export default NineplateResource;