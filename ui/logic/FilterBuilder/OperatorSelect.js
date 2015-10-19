/* jshint strict: false, unused: true */
define(['dojo/_base/declare', '../../ComboButton', '../../../core/array'], function(declare, ComboButton, array) {
	 /*
	 * Control that we use as the Operator selector (Equals, not Equals, etc)
	 */
	var OperatorSelect = (declare([ComboButton],
	{

		postCreate: function()
		{
			this.inherited(arguments);
			var self = this;

			this.watch('value', function(name, old, newValue)
			{

				var found = null;
				array.some(self.get('options'), function(item)
				{
					if (item.value === newValue)
					{
						found = item;
					}
					return !!found;
				});
				if (found)
				{
					self.filterBuilder.stateManager.preventUndo();
					self.set('label', found.label);
					self.filterBuilder.set('operatorValue', newValue);
					if (newValue)
					{
						self.filterBuilder.emit('stateChanged',
						{
							state: 'selectedOperator'
						});
					}
					else
					{
						if ((self.filterBuilder.stateManager.state === 'selectedOperator') || (self.filterBuilder.stateManager.state === 'selectedValue'))
						{
							self.filterBuilder.emit('stateChanged',
							{
								state: 'selectedField'
							});
						}
					}
					self.filterBuilder.stateManager.resumeUndo();
					self.filterBuilder.emit('expressionChanged', {});
				}
				else if (newValue !== 'and' && newValue !== 'or')
				{
					self.set('value', old);
				}
			});

		}
	}));
	return OperatorSelect;
});