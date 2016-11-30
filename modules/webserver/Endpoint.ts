'use strict';

import Properties from '../../core/ext/Properties';
import Evented from '../../core/ext/Evented';
import WebServer from './WebServer';
import express = require('express');
import { Request, Response, Application } from './WebServer'

export class Endpoint extends Properties {
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
	handler (req: Request, res: Response, next?: () => void) {
	}
	constructor (args: EndpointArgs) {
		super(args);
		this.children = [];
	}
}

export interface EndpointArgs {
	type?: string;
	method?: string;
	children?: Endpoint[];
	route: string;
	order?: number;
	validate?: (req: Request, res: Response) => any;
	handleAs?: string;
	parserOptions?: any;
	handler?: (req: Request, res: Response, next?: () => void) => void;
}

Endpoint.prototype.type = 'endpoint';
Endpoint.prototype.method = 'get';

export default Endpoint;