/* jshint strict: false */
 /**
 * @projectDescription   Filter Builder control - DefaultClipboardStrategy.
 *
 * @author   Eduardo Burgos
 * @version  0.1
 *
 * @id DefaultClipboardStrategy
 * @classDescription Implements Copy/Paste functionality to a FilterBuilder based
 * on localStorage
 * @return {ninejs/ui/FilterBuilder/DefaultClipboardStrategy}   Returns a
 * new DefaultClipboardStrategy.
 * @constructor
 */
define(['dojo/_base/declare', 'dojo/Stateful', 'dojo/json', '../../../core/logic/Expression'], function(declare, Stateful, json, Expression) {

	return declare([Stateful], {

		_getKey : function() {
			return this.get('clipboardKey') || 'ninejs_ui_FilterBuilder_DefaultClipboardStrategy';
		},
		_clipboardKeySetter : function(key) {
			this.clipboardKey = key;
		},
		// Sets the FilterBuilder that we will be working on
		_filterBuilderSetter : function(filterBuilder) {
			this.filterBuilder = filterBuilder;
		},
		// Gets the FilterBuilder
		_filterBuilderGetter : function() {
			return this.filterBuilder;
		},
		// True if the clipboard is present. It means if it is capable of doing
		// copy/paste
		hasClipboard : function() {
			return !!localStorage;
		},
		// True if the clipboard has data. It means if it should enable the paste button
		hasClipboardData : function() {
			var key = this._getKey();

			return !!(this.hasClipboard() && localStorage[key]);
		},
		// Copies the expression parameter
		copy : function(expression) {
			if (this.hasClipboard()) {
				var key = this._getKey();
				localStorage[key] = json.stringify(expression.toJson());
			}
		},
		// Pastes the copied expression in the same level as the one provided and returns
		// the new Expression
		// If null is provided then it just returns the pasted expression.
		paste : function(expression) {
			var pastedExpression = new Expression();
			var key = this._getKey();

			pastedExpression.fromJson(json.parse(localStorage[key]));
			var newExpression;
			if (expression) {
				var expressionClone = new Expression({
					operator : 'and',
					expressionList : [expression, pastedExpression]
				}).toJson();
				//converting the same instance
				expression.fromJson(expressionClone);
				newExpression = expression;
			} else {
				newExpression = pastedExpression;
			}

			var parentBuilder = this.get('filterBuilder');

			parentBuilder.set('expression', newExpression, true /* preventChange Undo State
			 * */);
		}
	});
});
