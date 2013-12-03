/* jshint strict: false */
/**
@author   Eduardo Burgos
@version  0.1
@description Expression used to hold a logic expression and being able to
represent it and evaluate it over a collection of data or a service.
@exports ninejs/core/logic/Expression
*/
define(['dojo/_base/declare', 'dojo/Stateful', 'dojo/i18n!./nls/Expression', 'dojo/_base/array', 'dojo/_base/lang', 'dojo/date/stamp'], function(declare, Stateful, resources, array, lang, stamp) {

	var startsWith = function(src, target) {
		if (src === null) {
			return false;
		}
		return src.indexOf(target) === 0;
	};

	var getValueFromSlashes = function(data, src) {
		var context = data;
		while (src.indexOf('/') >= 0) {
			//Assuming left part actually is an array
			var arrayName = src.substring(0, src.indexOf('/'));
			src = src.substring(src.indexOf('/') + 1);
			context = context[arrayName];
		}
		return context[src];
	};

	/**
	@constructor
	*/
	var Expression = declare([Stateful], {

		/*
		 * Possible values:
		 * and, or,
		 * equals, notEquals,
		 * greaterThan, greaterThanOrEquals,
		 * lessThan, lesserThanOrEquals,
		 * contains, startsWith, endsWith
		 */
		operator : null,

		/*
		 * Specifies whether or not this expression is a negative expression.
		 */
		isNegative : false,

		/*
		 * Possible values:
		 * String: Means a literal value. The expression is comparing from a literal
		 * value
		 * Function: Means a calculated value. Most likely coming from the context
		 */
		source : null,

		sourceSummary : null,

		/*
		 * Possible values:
		 * String: Means a literal value. The expression is comparing to a literal value
		 * Function: Means a calculated value. Most likely coming from the context
		 */
		target : null,

		targetSummary : null,

		/*
		 * Used in with a conjunction or disjunction expression. Only works when the
		 * operator is and|or
		 */
		expressionList : null,

		_formatValue : function(val, isVariable) {
			if ((val === null) || ((( typeof val) === 'number') && isNaN(val))) {
				return null;
			}
			if (isVariable) {
				return '[' + val + ']';
			} else {
				//checking if its date
				if (val.getMonth && lang.isFunction(val.getMonth)) {

					return '{' + stamp.toISOString(val, {
						selector : 'date'
					}) + '}';
				} else if (lang.isString(val)) {
					return '\'' + val + '\'';
				} else {
					return val.toString();
				}
			}
		},

		_getSourceValue : function() {
			return lang.isFunction(this.source) ? this._formatValue(this.source(), true) : this._formatValue(this.source);
		},

		_getTargetValue : function() {
			return lang.isFunction(this.target) ? this._formatValue(this.target(), true) : this._formatValue(this.target);
		},

		_targetValueGetter : function() {
			return lang.isFunction(this.target) ? this.target() : this.target;
		},

		toString : function() {
			var result = '';

			function valueWhenNoOperators() {
				if ((this.sourceSummary === null) && (!this.hasSource()) && (!this.hasTarget())) {
					if (this.isNegative) {
						return resources.alwaysFalse;
					} else {
						return resources.alwaysTrue;
					}
				} else {
					return resources.invalidExpression;
				}
			}

			function appendWhenSingleExpression() {
				var result = '';
				//getting left value
				var lval = this._getSourceValue();

				var lsummary = null;
				if (this.sourceSummary) {
					lsummary = resources[this.sourceSummary];
				}

				if (lsummary) {
					result += lsummary + '(' + lval + ')';
					if (this.get('where')){
						result += ' ( ' + resources.whereCaps + ' ' + this.get('where').toString() + ' )';
					}
				} else {
					result += lval;
				}

				result += ' ' + resources[this.operator] + ' ';

				//getting right value
				var rval = this._getTargetValue();

				var rsummary = null;

				if (this.targetSummary) {
					rsummary = resources[this.targetSummary];
				}

				if (rsummary) {
					result += rsummary + '(' + rval + ')';
				} else {
					result += rval;
				}

				return result;
			}

			if (this.get('ambiguous')){
				return resources.ambiguousExpression;
			}

			if (!this.operator) {
				return valueWhenNoOperators.apply(this);
			}

			if (this.isNegative) {
				result += resources.not + ' ( ';
			}

			var joiner = null;

			if (this.operator === 'and') {
				joiner = ' ' + resources.and + ' ';
			} else if (this.operator === 'or') {
				joiner = ' ' + resources.or + ' ';
			}

			if (joiner && this.expressionList) {
				result += array.map(this.expressionList, function(item) {
					return ' ( ' + item.toString() + ' ) ';
				}).join(joiner);
			} else {
				var valid = this.isValid();
				if (!valid) {
					return resources.invalidExpression;
				}

				result += appendWhenSingleExpression.apply(this);

			}

			if (this.isNegative) {
				result += ' )';
			}

			return result;
		},

		_buildGetterFunction : function(src) {
			return function(data, groupContextStack) {
				if (data == null) {
					return src;
				} else {
					var srcContext = src;
					var cnt;
					var dataContext = data;
					for ( cnt = (groupContextStack.length - 1); cnt >= 0; cnt -= 1) {
						var obj = groupContextStack[cnt];
						if (startsWith(srcContext, (obj.key + '/'))) {
							dataContext = obj.value;
							srcContext = srcContext.substring(srcContext.length + 1);
							break;
						}
					}

					return getValueFromSlashes(dataContext, srcContext);
				}
			};
		},

		_sourceFieldSetter : function(src) {
			this.set('source', this._buildGetterFunction(src));
		},

		_targetFieldSetter : function(src) {
			this.set('target', this._buildGetterFunction(src));
		},
		_ambiguousSetter: function(val) {
			this.ambiguous = val;
		},

		evaluate : function(data, recordContextStack) {
			//TODO: implement this
			return data + recordContextStack;

		},

		getInvolvedSources : function() {
			//TODO: implement this
		},

		reset : function() {
			this.operator = 'equals';

			this.isNegative = false;

			this.source = null;

			this.target = null;

			this.where = null;

			this.expressionList = null;
		},

		clone : function() {
			var r = new Expression();
			r.operator = this.operator;
			r.isNegative = this.isNegative;
			r.source = this.source;
			r.target = this.target;
			r.sourceSummary = this.sourceSummary;
			r.targetSummary = this.targetSummary;
			if (this.get('where')) {
				r.where = this.get('where').clone();
			}
			r.expressionList = array.map(this.expressionList, function(item) {
				return item.clone();
			});

			return r;
		},

		toJson : function() {
			var r = {
				operator : this.operator,
				isNegative : this.isNegative,
				sourceSummary : this.sourceSummary,
				targetSummary : this.targetSummary
			};
			if (lang.isFunction(this.source)) {
				r.sourceField = this.source();
			} else {
				r.source = this.source;
			}
			if (lang.isFunction(this.target)) {
				r.targetField = this.target();
			} else {
				r.target = this.target;
			}
			if (this.where) {
				r.where = this.where.toJosn();
			}
			r.expressionList = array.map(this.expressionList, function(item) {
				return item.toJson();
			});

			return r;
		},

		fromJson : function(data) {
			this.set('operator', data.operator);
			this.set('isNegative', data.isNegative);
			if (data.sourceField) {
				this.set('sourceField', data.sourceField);
			} else {
				this.set('source', data.source);
			}
			if (data.targetField) {
				this.set('targetField', data.targetField);
			} else {
				this.set('target', data.target);
			}
			if (data.where) {
				var whereExpression = new Expression({});
				whereExpression.fromJson(data.where);
				this.set('where', whereExpression);
			}
			this.set('sourceSummary', data.sourceSummary);
			this.set('targetSummary', data.targetSummary);
			this.set('expressionList', array.map(data.expressionList, function(item) {
				var r = new Expression({});
				r.fromJson(item);
				return r;
			}));
		},

		hasSource : function() {
			var r = false;
			if (this.source) {
				if (lang.isFunction(this.source)) {
					r = !!(this.source());
				} else {
					r = !!(this.source);
				}
			}
			return r;
		},
		hasTarget : function() {
			var r = false;
			if (this.target) {
				if (lang.isFunction(this.target)) {
					r = !!(this.target());
				} else {
					r = !!(this.target);
				}
			}
			return r;
		},

		isValid : function() {
			var valid = !this.get('ambiguous'), undef;
			valid = valid && this.hasSource();
			if (valid) {
				valid = valid && !!this.operator;
				if (valid) {
					if (lang.isFunction(this.target)) {
						valid = valid && this.target();
					} else {
						valid = valid && !((this.target === null) || (this.target === undef) || ((!lang.isString(this.target)) && isNaN(this.target)));
					}
				}
				if (this.get('where')) {
					valid = valid && this.get('where').isValid();
				}
			}
			return valid;
		}
	});

	return Expression;
});
