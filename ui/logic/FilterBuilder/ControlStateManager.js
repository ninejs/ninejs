/* jshint strict: false, unused: true */
define(['dojo/_base/declare', 'dojo/Stateful', 'dojo/_base/lang', '../../core/array', '../../utils/domUtils', '../../utils/setClass'], function(declare, Stateful, lang, array, domUtils, setClass) {
	setClass = setClass.default;
	var ControlStateManager = (declare([Stateful],
	{
		filterBuilder: null,
		/*
		 * Possible values:
		 * "start": When we just created the control. At this point we should select the
		 * summary
		 * "selectedSummary": When we selected the summary (i.e.: If the filter is going
		 * to be about the value, the average, the count or any other aggregating
		 * function). At this point we should select the Field
		 * "selectedField": When we selected the field we are going to build our
		 * expression about. At this point we should select the operator.
		 * "selectedOperator": When we selected the operator. At this point we should
		 * select the value.
		 * "selectedValue": When we selected the value. At this point our expression
		 * should be complete.
		 */
		state: 'start',
		postCreate: function()
		{
			this.watch('state', lang.hitch(this, this.stateChanged));
			var selfStateManager = this;
			var filterBuilder = selfStateManager.get('filterBuilder');
			filterBuilder.on('stateChanged', function(data)
			{
				selfStateManager.set('state', data.state);
			});

			//At this point I'm propagating all events to the main FilterBuilder for it to
			// handle them. There is no point in processing them on a child
			filterBuilder.on('undo', function(data)
			{
				if (filterBuilder.get('parent'))
				{
					filterBuilder.get('parent').emit('undo', data);
				}
				else
				{
					selfStateManager.handleUndo(data);
				}
			});
			filterBuilder.on('redo', function(data)
			{
				if (filterBuilder.get('parent'))
				{
					filterBuilder.get('parent').emit('redo', data);
				}
				else
				{
					selfStateManager.handleRedo(data);
				}
			});
			filterBuilder.on('expressionChanged', function(data)
			{
				if (filterBuilder.get('parent'))
				{
					filterBuilder.get('parent').emit('expressionChanged', data);
				}
				else
				{
					selfStateManager.handleExpressionChange(data);
				}
			});
		},
		handleExpressionChange: function( /*data*/ )
		{
			if (!this.preventUpdatingUndoQueues)
			{
				var item = this.filterBuilder.get('expression').clone();
				this.undoQueue.push(item);
				while (this.redoQueue.length)
				{
					this.redoQueue.pop();
				}
				this.updateUndoButtonState();
			}
		},
		preventUndo: function()
		{
			this.preventUpdatingUndoQueues += 1;
		},
		resumeUndo: function()
		{
			this.preventUpdatingUndoQueues -= 1;
		},
		resetUndo: function(expression)
		{
			while (this.undoQueue.length)
			{
				this.undoQueue.pop();
			}
			while (this.redoQueue.length)
			{
				this.redoQueue.pop();
			}
			this.undoQueue.push(expression.clone());
			this.updateUndoButtonState();
		},
		preventState: function()
		{
			this.preventStateChanges += 1;
		},
		resumeState: function()
		{
			this.preventStateChanges -= 1;
		},
		preventStateChanges: 0,
		preventUpdatingUndoQueues: 0,
		undoQueue: [],
		redoQueue: [],
		updateUndoButtonState: function()
		{
			this.filterBuilder.get('toolbar').get('undoButton').set('disabled', (this.undoQueue.length <= 1));
			this.filterBuilder.get('toolbar').get('redoButton').set('disabled', (this.redoQueue.length === 0));
		},
		handleUndo: function( /*data*/ )
		{
			var inQueue = this.undoQueue,
				outQueue = this.redoQueue,
				item, previous;
			if (inQueue.length)
			{
				this.preventUndo();
				item = inQueue.pop();
				//the current expression
				outQueue.push(item);
				previous = inQueue.pop();
				inQueue.push(previous);
				//Push it back again
				this.filterBuilder.set('expression', previous, true /* preventReset Undo State */ );
				this.updateUndoButtonState();
				this.resumeUndo();
			}
		},
		handleRedo: function( /*data*/ )
		{
			var inQueue = this.redoQueue,
				outQueue = this.undoQueue,
				item;
			if (inQueue.length)
			{
				this.preventUndo();
				item = inQueue.pop();
				this.filterBuilder.set('expression', item, true /* preventReset Undo State */ );
				outQueue.push(item);
				this.updateUndoButtonState();
				this.resumeUndo();
			}
		},
		stateHandler:
		{
			'start': function(controls)
			{
				controls[0].set('value', null);
				if (domUtils.isHidden(controls[0].domNode.parentElement.parentElement))
				{
					domUtils.show(controls[0].domNode.parentElement.parentElement);
				}
				if (!domUtils.isHidden(controls[1].domNode.parentElement.parentElement))
				{
					domUtils.hide(controls[1].domNode.parentElement.parentElement);
				}
				if (!domUtils.isHidden(controls[2].domNode.parentElement.parentElement))
				{
					domUtils.hide(controls[2].domNode.parentElement.parentElement);
				}
				if (!domUtils.isHidden(controls[3].domNode.parentElement.parentElement))
				{
					domUtils.hide(controls[3].domNode.parentElement.parentElement);
				}
			},
			'selectedSummary': function(controls)
			{
				if (!controls[1].get('value'))
				{
					controls[2].set('value', null);
					controls[3].set('value', null);
				}
				if (domUtils.isHidden(controls[0].domNode.parentElement.parentElement))
				{
					domUtils.show(controls[0].domNode.parentElement.parentElement);
				}
				if (domUtils.isHidden(controls[1].domNode.parentElement.parentElement))
				{
					domUtils.show(controls[1].domNode.parentElement.parentElement);
				}
				if (!domUtils.isHidden(controls[2].domNode.parentElement.parentElement))
				{
					domUtils.hide(controls[2].domNode.parentElement.parentElement);
				}
				if (!domUtils.isHidden(controls[3].domNode.parentElement.parentElement))
				{
					domUtils.hide(controls[3].domNode.parentElement.parentElement);
				}
			},
			'selectedField': function(controls)
			{
				if (!controls[2].get('value'))
				{
					controls[3].set('value', null);
				}
				if (domUtils.isHidden(controls[0].domNode.parentElement.parentElement))
				{
					domUtils.show(controls[0].domNode.parentElement.parentElement);
				}
				if (domUtils.isHidden(controls[1].domNode.parentElement.parentElement))
				{
					domUtils.show(controls[1].domNode.parentElement.parentElement);
				}
				if (domUtils.isHidden(controls[2].domNode.parentElement.parentElement))
				{
					domUtils.show(controls[2].domNode.parentElement.parentElement);
				}
				if (!domUtils.isHidden(controls[3].domNode.parentElement.parentElement))
				{
					domUtils.hide(controls[3].domNode.parentElement.parentElement);
				}
			},
			'selectedOperator': function(controls)
			{
				if (domUtils.isHidden(controls[0].domNode.parentElement.parentElement))
				{
					domUtils.show(controls[0].domNode.parentElement.parentElement);
				}
				if (domUtils.isHidden(controls[1].domNode.parentElement.parentElement))
				{
					domUtils.show(controls[1].domNode.parentElement.parentElement);
				}
				if (domUtils.isHidden(controls[2].domNode.parentElement.parentElement))
				{
					domUtils.show(controls[2].domNode.parentElement.parentElement);
				}
				if (domUtils.isHidden(controls[3].domNode.parentElement.parentElement))
				{
					domUtils.show(controls[3].domNode.parentElement.parentElement);
				}
			},
			'selectedValue': function(controls, refreshValue)
			{
				if (domUtils.isHidden(controls[0].domNode.parentElement.parentElement))
				{
					domUtils.show(controls[0].domNode.parentElement.parentElement);
				}
				if (domUtils.isHidden(controls[1].domNode.parentElement.parentElement))
				{
					domUtils.show(controls[1].domNode.parentElement.parentElement);
				}
				if (domUtils.isHidden(controls[2].domNode.parentElement.parentElement))
				{
					domUtils.show(controls[2].domNode.parentElement.parentElement);
				}
				if (domUtils.isHidden(controls[3].domNode.parentElement.parentElement))
				{
					domUtils.show(controls[3].domNode.parentElement.parentElement);
				}
				if (refreshValue)
				{
					controls[3].set('value', controls[3].get('value'));
				}
			}
		},
		stateChanged: function(name, oldValue, newValue)
		{
			var filter = this.get('filterBuilder'),
				expression = filter.get('expression'),
				controls = [],
				refreshValue = false;

			if ((!this.preventStateChanges) && (expression.get('operator') !== 'and') && (expression.get('operator') !== 'or'))
			{

				if ((newValue === 'start') && (filter.get('selectedSummarySelect').get('value')))
				{
					newValue = 'selectedSummary';
				}

				if ((newValue === 'selectedSummary') && (filter.get('selectedFieldSelect').get('value')))
				{
					newValue = 'selectedField';
				}

				if ((newValue === 'selectedField') && (filter.get('selectedOperatorSelect').get('value')))
				{
					newValue = 'selectedOperator';
				}

				if ((newValue === 'selectedOperator') && (filter.get('selectedValueSelect').get('value') !== null))
				{
					newValue = 'selectedValue';
					if (filter.config && filter.config.keepValuesWhileChangingFields)
					{
						refreshValue = true;
					}
				}

				controls.push(filter.get('selectedSummarySelect'));
				controls.push(filter.get('selectedFieldSelect'));
				controls.push(filter.get('selectedOperatorSelect'));
				controls.push(filter.get('selectedValueSelect'));

				if (array.some(controls, function(item)
				{
					return !item.domNode || !item.domNode.parentElement;
				}))
				{
					return;
				}

				if (this.stateHandler[newValue])
				{
					this.stateHandler[newValue](controls, refreshValue);
				}
				else
				{
					throw new Error('Invalid state: \'' + newValue + '\'');
				}



				setClass(filter.domNode, '!state-' + oldValue);
				setClass(filter.domNode, 'state-' + newValue);
			}
		}
	}));
	return ControlStateManager;
});