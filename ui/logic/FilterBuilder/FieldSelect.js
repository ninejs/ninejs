/* jshint strict: false */
define(['dojo/_base/declare', 'dijit/form/FilteringSelect', 'dojo/store/Memory', 'dojo/on'], function(declare, FilteringSelect, Memory, on) {
	 /*
	 * Control that we use as the Field selector
	 */
	var FieldSelect = (declare([FilteringSelect],
	{
		labelAttr: 'label',
		searchAttr: 'label',
		constructor: function()
		{
			this.store = new Memory(
			{
				idProperty: 'value'
			});
		},
		_setOptionListAttr: function( /*Array*/ arr)
		{
			this.get('store').setData(arr);
		},
		_getOptionListAttr: function()
		{
			return this.get('store').data;
		},
		addOption: function(opt)
		{
			var theStore, data;

			theStore = this.get('store');
			data = theStore.data;
			if (!data)
			{
				this.set('optionList', []);
				data = theStore.data;
			}
			theStore.put(opt);
		},

		postCreate: function()
		{
			this.inherited(arguments);
			var self = this;

			on(this, 'change', function(newValue)
			{
				self.filterBuilder.stateManager.preventUndo();
				self.filterBuilder.set('fieldValue', newValue);
				if (newValue)
				{
					self.filterBuilder.emit('stateChanged',
					{
						state: 'selectedField'
					});
				}
				else
				{
					self.filterBuilder.emit('stateChanged',
					{
						state: 'selectedSummary'
					});
				}
				self.filterBuilder.stateManager.resumeUndo();
				self.filterBuilder.emit('expressionChanged', {});
			});
		}
	}));
	return FieldSelect;
});