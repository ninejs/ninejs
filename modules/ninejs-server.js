'use strict';
var extend = require('../core/extend');
var Module = require('./Module');
var packageJson = require('../package.json');
var bunyan = require('bunyan');
var njs = require('../lib/ninejs');
var NineJs = extend(Module, {
	configGetter: function() {
		var r = null;
		if (this.config) {
			r = this.config['ninejs'];
		}
		return r;
	},
	loggerGetter: function(name) {
		name = name || 'default';
		if (!this.logger[name]) {
			var loggingConfig = (this.config['ninejs'] || {}).logging || [];
			var cnt;
			if (Object.prototype.toString.call(loggingConfig) !== '[object Array]') {
				loggingConfig = [loggingConfig];
			}
			var cfg;
			for (cnt = 0; cnt < loggingConfig.length; cnt += 1){
				if (loggingConfig[cnt].name === name){
					cfg = loggingConfig[cnt];
				}
			}
			cfg = cfg || ( loggingConfig[0] || {
				name: 'ninejs',
				streams: [{
					level: 'info',
					type: 'raw',
					stream: {
						write: function(data) {
							console.log('[' + data.time.toDateString() + ' ' + data.time.toLocaleTimeString() + '] ' + data.msg);
						}
					}
				}]
			});
			this.logger[name] = bunyan.createLogger(cfg);
		}
		return this.logger[name];
	}
}, extend.postConstruct(function() {
	var provide = {
			id: 'ninejs',
			version: packageJson.version,
			features: {}
		},
		log;
	extend.mixin(this, {
		provides: [
			provide
		],
		logger: {}
	});
	provide.features['node.js'] = process.version.substr(1);//stripping out the 'v'
	//Testing for harmony (ES6). The only thing I could figure out that changes in an ES6 environment is the global.Proxy variable.
	if ((typeof(global) !== 'undefined') && (global.Proxy)) {
		provide.features['harmony'] = true;
	}
	log = this.get('logger');
	njs.on('log', function(data) {
		log.info(data.message);
	});
}));
var result = new NineJs();
module.exports = result;