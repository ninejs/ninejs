'use strict';
var extend = require('../../core/extend');
var Properties = require('../../core/ext/Properties');
var Evented = require('../../core/ext/Evented');

var Endpoint = extend(Properties, Evented, {
	type: 'endpoint',
	method: 'get',
	children: [],
	handler: function() {}
});

module.exports = Endpoint;