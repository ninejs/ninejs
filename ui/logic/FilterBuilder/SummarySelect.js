/* jshint strict: false, unused: true */
define(['dojo/_base/declare', '../../ComboButton', 'dojo/_base/array'], function(declare, ComboButton, array) {
	 /*
	 * Control that we use as the Summary selector (The value of, the sum of, the
	 * average of, etc)
	 */
	var SummarySelect = (declare([ComboButton],
	{

		postCreate: function()
		{
			this.inherited(arguments);

			var self = this;

			self.watch('value', function(name, old, newValue)
			{

				var found = null;
				array.some(self.get('options'), function(item)
				{
					if (item.value === newValue)
					{
						found = item;
						return true;
					}
					else
					{
						return false;
					}
				});
				if (found)
				{
					self.set('label', found.label);
					self.filterBuilder.stateManager.preventUndo();
					self.filterBuilder.set('summaryValue', newValue);
					if (newValue)
					{
						self.filterBuilder.emit('stateChanged',
						{
							state: 'selectedSummary'
						});
					}
					else
					{
						self.filterBuilder.emit('stateChanged',
						{
							state: 'start'
						});
					}
					self.filterBuilder.stateManager.resumeUndo();
					self.filterBuilder.emit('expressionChanged', {});
				}
				else
				{
					self.set('value', old);
				}

			});
		}
	}));
	return SummarySelect;
});