/* jshint strict: false, unused: true */
define(['dojo/_base/declare', '../../ComboButton', '../../../core/array'], function(declare, ComboButton, array) {
	var MultiOperatorSelect = (declare([ComboButton],
	{
		_setValueAttr: function(value) {
			var found = null;
			var old = this.get('value');
			array.some(this.get('options'), function(item)
			{
				if (item.value === value)
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
				if (this.filterBuilder._multipleExpressionLinks && this.filterBuilder._multipleExpressionLinks.length && array.every(this.filterBuilder._multipleExpressionLinks, function(item) {
					return item === this || (item.get('value') === value);
				}, this)) {
					this.value = value;
					this.set('label', found.label);
					this.filterBuilder.stateManager.preventUndo();
					this.filterBuilder.set('operatorValue', value);

					this.filterBuilder.stateManager.resumeUndo();
					this.filterBuilder.emit('expressionChanged', {});
					this.filterBuilder.set('ambiguous', false);
				}
				else {
					this.value = value;
					this.set('label', found.label);
					this.filterBuilder.set('ambiguous', true);
				}
				this.filterBuilder._updateExpression();
			}
			else
			{
				this.value = old;
			}
		}
	}));
	return MultiOperatorSelect;
});