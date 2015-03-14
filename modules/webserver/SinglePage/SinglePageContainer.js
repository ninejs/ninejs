'use strict';
var extend = require('../../../core/extend');
var NineplateResource = require('../NineplateResource');
var CachedResourceMixin = require('../CachedResourceMixin');
var path = require('path');

var SinglePageContainer = NineplateResource.extend({
	context: {
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
	},
	handler: extend.before(function(/*req, res*/) {
		this.context.jsBase = this.server.baseUrl + this.server.jsUrl;
		this.context.baseUrl = this.server.baseUrl;
		this.context.html.manifest = this.server.baseUrl + '/manifest.appcache';
		this.path = path.resolve(__dirname, 'SinglePageContainer.9plate');
	})
}, function() {
	this.on('result', function(evt) {
		this.applyETag(evt.response, evt.data);
	});
}).extend(CachedResourceMixin);

module.exports = SinglePageContainer;