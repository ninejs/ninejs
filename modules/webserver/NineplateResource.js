'use strict';
var StaticResource = require('./StaticResource');

var NineplateResource = StaticResource.extend({
	type: 'endpoint',
	contentType: 'text/html; charset=utf-8',
	doctype: 'html',
	context: {},
	handler: function(req, res) {
		/* jshint unused: true */
		var props = this.props || {}, p, self = this;
		res.set('Content-Type', this.contentType);
		for (p in props) {
			if (props.hasOwnProperty(p)) {
				res.set(p, props[p]);
			}
		}
		this.app.render(this.path, this.context, function(err, html) {
			var result;
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
});

module.exports = NineplateResource;