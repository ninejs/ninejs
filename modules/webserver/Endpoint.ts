/// <reference path="../../typings/express/express.d.ts" />

import Properties from '../../core/ext/Properties';
import Evented from '../../core/ext/Evented';
import WebServer from './WebServer';
import express = require('express');
import { Request, Response, Application } from './WebServer'

class Endpoint extends Properties {
	type: string;
	method: string;
	children: Endpoint[];
	app: Application;
	server: WebServer;
	route: string;
	order: number;
	validate: (req: Request, res: Response) => any;
	handleAs: string;
	parserOptions: any;
	on (eventType: string, callback: (ev: any) => void) {
		return Evented.on.apply(this, arguments);
	}
	emit (eventType: string, data: any) {
		return Evented.emit.apply(this, arguments);
	}
	handler (req: Request, res: Response) {
	}
	constructor (args: any) {
		super(args);
		this.children = [];
	}
}

Endpoint.prototype.type = 'endpoint';
Endpoint.prototype.method = 'get';
export { Endpoint };
export default Endpoint;