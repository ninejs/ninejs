'use strict';
var extend = require('../../core/extend');
var Endpoint = require('./Endpoint');
var CachedResourceMixin = require('./CachedResourceMixin');

var StaticResource = extend(Endpoint, {
	type: 'static',
	contentType: 'text/plain; charset=utf-8',
	content: '',
	handler: extend.after(function(req, res) {
		/* jshint unused: true */
		var props = this.props || {},
			p;
		res.set('Content-Type', this.contentType);
		for (p in props) {
			if (props.hasOwnProperty(p)) {
				res.set(p, props[p]);
			}
		}
		if (this.path) {
			res.sendfile(this.path, this.options || {});
		}
		else if (this.content) {
			this.emit('result', { data: this.content, response: res });
			res.end(this.content);
		}
		else if (this.action) {
			this.action.apply(this, arguments);
		}
		else {
			res.status(404);
		}
	})
}).extend(CachedResourceMixin);

module.exports = StaticResource;