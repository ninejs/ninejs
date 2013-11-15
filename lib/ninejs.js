(function(global) {
	'use strict';
	var isAmd = (typeof(define) !== 'undefined') && define.amd,
		isNode = (typeof(window) === 'undefined'),
		req = require,
		path;
	function moduleExport(nineplate, deferredUtils, extend, Evented, i18n) {
		var args = {
				Nineplate: nineplate
			};
		if (isNode) {
			extend.mixinRecursive(args, {
				start: function() {
					console.log(i18n.getResource().startingNineJs);
					var promise = req('../modules/serverBoot');
					return deferredUtils.when(promise, function() {
						this.emit('log', { message: i18n.getResource().nineJsStarted });
						return njs;
					}.bind(this));
				},
				build: function(target) {
					var promise = req('./build').build(target);
					return deferredUtils.when(promise, function() {
						this.emit('log', { message: i18n.getResource().nineJsBuilt });
						return njs;
					}.bind(this));
				},
				run: function(argv) {
					if (!argv.length) {
						argv.push('start');
					}
					switch (argv[0]) {
					case 'start':
						this.start(argv);
						break;
					case 'build':
						this.build.apply(this, [argv[1]].concat(argv));
						break;
					}
				}
			});
		}
		var NineJs = extend(Evented, args);
		if (isNode) {
			NineJs = NineJs.extend(function() {
				this.locale = process.env.NINEJSLOCALE;
				i18n.setLocale(this.locale);
			});
		}
		var njs = new NineJs();

		return njs;
	}
	if (isAmd) {
		define(['../nineplate', '../core/deferredUtils', '../core/extend', '../core/ext/Evented', '../core/i18n!./resources/strings.json'], moduleExport);
	}
	else if (isNode) {
		path = req('path');
		module.exports = moduleExport(req('../nineplate'), req('../core/deferredUtils'), req('../core/extend'), req('../core/ext/Evented'), req('../core/i18n').getResource(path.resolve(__dirname, './resources/strings.json')));
	}
	else {
		//must include extend, deferredUtils, Evented, nineplate, i18n in that order
		global.ninejs.ninejs = moduleExport(global.ninejs.nineplate, global.ninejs.core.deferredUtils, global.ninejs.core.extend, global.ninejs.core.ext.Evented, global.ninejs.core.i18n.getResource('./resources/strings.json'));
	}
})(this);