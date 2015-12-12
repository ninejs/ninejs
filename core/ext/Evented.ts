/** 
@module ninejs/core/ext/Evented 
@author Eduardo Burgos <eburgos@gmail.com>
*/
'use strict';

import { default as coreOn, RemovableType } from '../on';

declare var define:{
	(deps:string[], callback:(...rest:any[]) => any): void;
	amd: any;
};
declare var require: any;
declare var global: any;
var isAmd = (typeof(define) !== 'undefined') && define.amd,
	isDojo = isAmd && define.amd.vendor === 'dojotoolkit.org',
	isNode = (typeof(window) === 'undefined'),
	req = (isDojo && isNode)? global.require : require;

var result: {
	on (type: string, listener: (e?: any) => any): RemovableType;
	emit (...arglist: any[]): any;
};
if (isNode) {
	result = require('events').EventEmitter.prototype;
}
else {
	var on = require('../on'),
		aspect = require('../aspect');
	var after = aspect.after;
	result = {
		on: function(type: string, listener: (e?: any) => any){
			return coreOn.parse(this, type, listener, function(target: any, type: string){
				return after(target, 'on' + type, listener, true);
			});
		},
		emit: function(...arglist: any[]/*type, event*/){
			var args = [this];
			args.push.apply(args, arglist);
			return coreOn.emit.apply(on, args);
		}
	};
}
export default result;