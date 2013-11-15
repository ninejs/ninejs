define(['put-selector/put', './setText', 'dojo/has', 'dojo/on', 'dojo/mouse', 'dojo/dom-style', 'dijit/Tooltip', '../../core/extend', 'dojo/dom', 'dojo/_base/fx', 'dojo/Deferred', 'dojo/_base/window', '../../css!../css/common.css'], function (put, setText, has, on, mouse, domStyle, Tooltip, extend, dom, fx, Deferred, window, commonCss) {
	'use strict';
	commonCss.enable();
	has.add('scopedCss', function(){
		var r = false, document = window.doc;
		if (document) {
			var style = document.createElement('style');
			if (style.scoped) {
				r = true;
			}
		}
		return r;
	}, true);

	function elementMouseOver(e) {
		put(e.currentTarget, '.dijitHover');
	}

	function elementMouseOut(e) {
		put(e.currentTarget, '!dijitHover');
	}

	var DomUtils = extend({
		isHidden: function (control) {
			if (control.domNode) {
				return domStyle.get(control.domNode, 'display') === 'none';
			} else {
				return domStyle.get(control, 'display') === 'none';
			}
		},
		isShown: function (control) {
			if (control.domNode) {
				return domStyle.get(control.domNode, 'display') === 'block';
			} else {
				return domStyle.get(control, 'display') === 'block';
			}
		},
		hide: function (control, withEffect) {
			var node = control;
			if (control.domNode) {
				node = control.domNode;
			}

			var effect = null,
				promise = new Deferred();

			if (withEffect) {
				effect = fx.fadeOut;
			}

			if (effect) {
				var fxObj = effect({
					node: node
				});
				fxObj.on('End', function () {
					promise.resolve();
				});
				fxObj.play();
			} else {
				promise.resolve();
			}
			promise.then(function () {
				domStyle.set(node, 'display', 'none');
			});
		},

		show: function (control, withEffect, showAttr) {
			if (!showAttr) {
				showAttr = 'block';
			}
			var node = control;
			if (control.domNode) {
				node = control.domNode;
			}

			if (withEffect) {
				var effect = fx.fadeIn;

				var fxObj = effect({
					node: node
				});
				fxObj.on('Begin', function () {
					domStyle.set(node, 'display', showAttr);
				});
				fxObj.play();
			} else {
				domStyle.set(node, 'display', showAttr);
				domStyle.set(node, 'opacity', '1');
			}
		},

		empty: function (node) {
			setText.emptyNode(node);
		},

		setText: setText,

		enableHovering: function (control, enter, leave, options) {
			enter = enter || elementMouseOver;
			leave = leave || (elementMouseOut || enter);
			var onFn = on,
				r = {};
			if (options && options.pausable) {
				onFn = on.pausable;
			}
			r.enter = onFn(control, mouse.enter, enter);
			r.leave = onFn(control, mouse.leave, leave);

			return r;
		},

		/*
		parameters:
		control: String containing Id of node
					or DOM Node
					or Dijit widget
		label: String
		position: Array of Strings containing one of (before | after | above | below)
		delay: int milliseconds, defaults to 400
		*/
		addTooltip: function (control, label, position, delay) {
			var node = control,
				config;
			if (typeof(control) === 'string') {
				node = dom.byId(control);
			}
			else if (control.domNode) {
				node = control.domNode;
			}

			config = {
				connectId: [node],
				label: label
			};
			if (position) {
				config.position = position;
			}
			if (delay) {
				config.delay = delay;
			}

			return new Tooltip(config);
		}
	});

	return new DomUtils();
});