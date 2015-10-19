/* jshint strict: false */
define(['dojo/_base/declare', 'dijit/Menu', 'dijit/MenuItem', 'dijit/form/ComboButton', '../core/array'], function(declare, Menu, MenuItem, DijitComboButton, array) {
	var ComboButton = (declare([DijitComboButton], {
		onClick: function()
		{
			this.toggleDropDown();
		},
		_getOptionsAttr: function()
		{
			return this.options;
		},
		_setOptionsAttr: function(options)
		{
			this.options = options;
			var menu, self;
			menu = new Menu(
			{
				style: 'display: none;'
			});
			self = this;

			array.forEach(options, function(item)
			{
				var menuItem = new MenuItem(
				{
					label: item.label,
					value: item.value,
					onClick: function()
					{
						self.set('value', this.value);
					}
				});
				menu.addChild(menuItem);
			});

			this.set('dropDown', menu);
		}
	}));
	return ComboButton;
});