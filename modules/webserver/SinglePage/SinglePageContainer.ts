'use strict';

import NineplateResource from '../NineplateResource';
import path = require('path');
import express = require('express');
import { Request, Response } from '../WebServer';




class SinglePageContainer extends NineplateResource {
	context: any;
	handler (req: Request, res: Response) {
		this.context.jsBase = this.server.baseUrl + this.server.jsUrl;
		this.context.baseUrl = this.server.baseUrl;
		this.context.html.manifest = this.server.baseUrl + '/manifest.appcache';
		this.path = path.resolve(__dirname, 'SinglePageContainer.9plate');
		super.handler(req, res);
	}
	constructor (arg: any) {
		super(arg);
		this.on('result', function(evt) {
			this.applyETag(evt.response, evt.data);
		});
	}
}

SinglePageContainer.prototype.context = {
	html: {
		lang: 'en',
			manifest: 'manifest.appcache',
			head: {
			meta: {
				charset: 'utf-8'
			}
		},
		body: {
			callbackScript: function() {
				if (this.boot) {
					return 'require.s.contexts._.config.callback = function() { require([\'' + this.boot + '\'], function() {  }); };';
				}
				else {
					return '';
				}
			}
		}
	}
};

export default SinglePageContainer;