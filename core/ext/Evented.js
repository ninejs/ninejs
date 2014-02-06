/** 
@module ninejs/core/ext/Evented 
@author Eduardo Burgos <eburgos@gmail.com>
*/
(function() {
	'use strict';
	var isAmd = (typeof(define) !== 'undefined') && define.amd,
		isDojo = isAmd && define.amd.vendor === 'dojotoolkit.org',
		isNode = (typeof(window) === 'undefined'),
		req = (isDojo && isNode)? global.require : require;

	function evented(on, aspect) {
		var after = aspect.after;
		return {
			on: function(type, listener){
				return on.parse(this, type, listener, function(target, type){
					return after(target, 'on' + type, listener, true);
				});
			},
			emit: function(/*type, event*/){
				var args = [this];
				args.push.apply(args, arguments);
				return on.emit.apply(on, args);
			}
		};
	}

	if (isAmd) { //AMD
		if (isNode) {
			define(['events'], function(events) {
				return events.EventEmitter;
			});
		}
		else {
			define(['../on', '../aspect'], evented);
		}
	} else if (isNode) { //Server side
		//If it's node then Evented is the same as EventEmitter
		var Evented = req('events').EventEmitter;
		module.exports = Evented;
	} else {
		// plain script in a browser
		throw new Error('Non AMD environments are not supported');
	}
})();