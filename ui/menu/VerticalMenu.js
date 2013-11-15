/* jshint strict: false */
define(['dojo/_base/declare', 'dojo/_base/array', 'dijit/layout/ContentPane', 'dijit/_TemplatedMixin', 'put-selector/put', 'dojo/on', 'dojo/text!./VerticalMenu.html', '../utils/domUtils', '../../css!./skin/VerticalMenu/Default.css'], function(declare, array, ContentPane, TemplatedMixin, put, on, defaultTemplate, domUtils, defaultSkin) {
	var cssLoaded = false;
	var VerticalMenu = declare([ContentPane, TemplatedMixin], {
		template: true,
		templateString: defaultTemplate,
		items: [],
		autoSelectFirst: true,
		postCreate: function() {
			this.inherited(arguments);
			if (!cssLoaded){
				VerticalMenu.Skin.enable();
				cssLoaded = true;
			}
		},
		_setSelectedItemAttr: function(v) {
			var found;
			array.forEach(this.items, function(item) {
				put(item.node, '!active');
			});

			if (typeof(v) === 'string'){
				array.some(this.items, function(item) {
					if (item.id === v) {
						found = item;
						return true;
					}
					return false;
				});
				v = found;
			}
			this.selectedItem = v;
			if (v) {
				put(v.node, '.active');
				if (v.action) {
					v.action.call(this);
				}
			}
		},
		addItem: function(label, tooltip, id, action){
			var liNode = put(this.contentNode, 'li'),
				aNode = put(liNode, 'a'),
				span = put(aNode, 'span', label),
				r = { node: liNode, anchor: aNode, textNode: span, id: id },
				self = this;

			if (!action && (typeof(id) === 'function')) {//id was ommitted
				action = id;
			}
			if (tooltip) {
				domUtils.addTooltip(liNode, tooltip);
			}
			r.action = action;
			this.own(on(aNode, 'click', function() {
				self.set('selectedItem', r);
			}));
			this.items.push(r);

			if (!this.selectedItem && this.autoSelectFirst) {
				this.set('selectedItem', this.items[0]);
			}

			return r;
		}
	});
	VerticalMenu.Skin = defaultSkin;
	return VerticalMenu;
});