/* jshint strict: false, unused: true */
define(['dojo/_base/declare', '../../Editor'], function(declare, Editor) {
	 /*
	 * Control that we use as the Value selector. This should be able to change based
	 * on the field's data type and other settings
	 */
	var ValueSelect = (declare([Editor],
	{

		postCreate: function()
		{
			this.inherited(arguments);

			this.watch('value', function(name, old, newv)
			{
				this.filterBuilder.stateManager.preventUndo();
				this.filterBuilder.set('valueValue', newv);
				if (newv !== null)
				{
					this.filterBuilder.emit('stateChanged',
					{
						state: 'selectedValue'
					});
				}
				this.filterBuilder.stateManager.resumeUndo();
				if (old !== newv)
				{
					this.filterBuilder.emit('expressionChanged', {});
				}
			});
		}
	}));
	return ValueSelect;
});