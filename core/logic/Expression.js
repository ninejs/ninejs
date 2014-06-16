/**
@author   Eduardo Burgos
@version  0.1
@description Expression used to hold a logic expression and being able to
represent it and evaluate it over a collection of data or a service.
@exports ninejs/core/logic/Expression
*/
(function () {
	/* jshint strict: false */
	//'use strict';
	var isAmd = (typeof(define) !== 'undefined' && define.amd);
	var isNode = (typeof(window) === 'undefined');
	var req = require;
	var arrayMap;
	if (typeof(Array.prototype.map) === 'function') {
		arrayMap = function(arr, itemFn) {
			return Array.prototype.map.call(arr, itemFn);
		};
	}
	else {
		arrayMap = function(arr, itemFn) {
			var r = [],
				cnt,
				len = arr.length;
			for (cnt = 0; cnt < len; cnt += 1) {
				r.push(itemFn(arr[cnt], cnt, arr));
			}
			return r;
		};
	}
	var keys;
	if (typeof(Object.keys) === 'function') {
		keys = Object.keys;
	}
	else {
		keys = function(obj) {
			var r = [],
				p;
			for (p in obj) {
				if (obj.hasOwnProperty(p)) {
					r.push(p);
				}
			}
			return r;
		};
	}
	var arrayReduce;
	if (typeof(Array.prototype.reduce) === 'function') {
		arrayReduce = function(arr/*, callback, initial*/) {
			return Array.prototype.reduce.apply(arr, Array.prototype.slice.call(arguments, 1));
		};
	}
	else {
		arrayReduce = function(arr, callback, initial) {
			var cnt = 0,
				len = arr.length;
			if (initial === undefined) {
				initial = arr[0];
				cnt = 1;
			}
			for (; cnt < len; cnt += 1) {
				initial = callback(initial, arr[cnt], cnt, arr);
			}
			return initial;
		};
	}

	var initialOperatorList = {
		'and':{
			name: 'and',
			reductor: function(a, b) {
				return (!!a) && (!!b);
			}
		},
		'or':{
			name: 'or',
			reductor: function(a, b) {
				return (!!a) || (!!b);
			}
		},
		'equals':{
			name: 'equals',
			'operator': function(a,b) { return a === b; }
		},
		'notEquals':{
			name: 'notEquals',
			'operator': function(a,b) { return a !== b; }
		},
		'greaterThan':{
			name: 'greaterThan',
			'operator': function(a,b) { return a > b; },
			dataTypeList: [
				'Number'
			]
		},
		'greaterThanOrEquals':{
			name: 'greaterThanOrEquals',
			'operator': function(a,b) { return a >= b; },
			dataTypeList: [
				'Number'
			]
		},
		'lessThan':{
			name: 'lessThan',
			'operator': function(a,b) { return a < b; },
			dataTypeList: [
				'Number'
			]
		},
		'lessThanOrEquals':{
			name: 'lessThanOrEquals',
			'operator': function(a,b) { return a <= b; },
			dataTypeList: [
				'Number'
			]
		},
		'contains':{
			name: 'contains',
			'operator': function(a,b) { return String.prototype.indexOf.call(a, b) >= 0; },
			dataTypeList: [
				'String'
			]
		},
		'startsWith':{
			name: 'startsWith',
			'operator': function(a,b) {
				if (a == null) {
					return false;
				}
				return String.prototype.indexOf.call(a, b) === 0;
			},
			dataTypeList: [
				'String'
			]
		},
		'endsWith':{
			name: 'endsWith',
			'operator': function(a,b) {
				if (a == null) {
					return false;
				}
				return (a.length >= (b || '').length) && (String.prototype.indexOf.call(a, b) === (a.length - (b || '').length));
			},
			dataTypeList: [
				'String'
			]
		}
	};

	function moduleExport(extend, Properties, objUtils, locale) {
		var resources = locale.resource,
			isArray = objUtils.isArray,
			isFunction = objUtils.isFunction,
			isString = objUtils.isString,
			initialSummaryList = {
				'valueOf': {
					name: 'valueOf',
					dataTypeList: function(item) {
						return item.dataType !== 'record';
					}
				},
				'countOf': {
					name: 'countOf',
					dataTypeList: function(item) {
						return (item.dataType === 'record') || (item.parent) || item.isMultiValued;
					},
					action: function(data) {
						if (!isArray(data)) {
							data = [data];
						}
						return data.length;
					}
				},
				'some': {
					name: 'some',
					dataTypeList: function(item) {
						return (item.dataType === 'record') || (item.parent) || item.isMultiValued;
					},
					postAction: function(values, side, fn) {
						if (side !== 'left') {
							throw new Error('not implemented');
						}
						var cnt,
							len = values.length;
						for (cnt = 0; cnt < len; cnt += 1) {
							if (fn(values[cnt])) {
								return true;
							}
						}
						return false;
					}
				},
				'every': {
					name: 'every',
					dataTypeList: function(item) {
						return (item.dataType === 'record') || (item.parent) || item.isMultiValued;
					},
					postAction: function(values, side, fn) {
						if (side !== 'left') {
							throw new Error('not implemented');
						}
						var cnt,
							len = values.length;
						if (!len) {
							return false;
						}
						for (cnt = 0; cnt < len; cnt += 1) {
							if (!fn(values[cnt])) {
								return false;
							}
						}
						return true;
					}
				},
				'sumOf': {
					name: 'sumOf',
					dataTypeList: function(item) {
						return ((item.dataType === 'record') || (item.parent) || item.isMultiValued) && ((item.dataType === 'integer') || (item.dataType === 'decimal'));
					},
					action: function(data) {
						if (!isArray(data)) {
							data = [data];
						}
						var cnt,
							len = data.length,
							r = 0;
						for (cnt = 0; cnt < len; cnt += 1) {
							r += data[cnt];
						}
						return r;
					}
				},
				'averageOf': {
					name: 'averageOf',
					dataTypeList: function(item) {
						return ((item.dataType === 'record') || (item.parent) || item.isMultiValued) && ((item.dataType === 'integer') || (item.dataType === 'decimal'));
					},
					action: function(data) {
						if (!isArray(data)) {
							data = [data];
						}
						var cnt,
							len = data.length,
							r = 0;
						if (len === 0) {
							return 0;
						}
						for (cnt = 0; cnt < len; cnt += 1) {
							r += data[cnt];
						}
						return r / len;
					}
				}
			};
		function toDateString(/*Date*/ dateObject, /*__Options?*/ options){
			// summary:
			//		Format a Date object as a string according a subset of the ISO-8601 standard
			//
			// description:
			//		When options.selector is omitted, output follows [RFC3339](http://www.ietf.org/rfc/rfc3339.txt)
			//		The local time zone is included as an offset from GMT, except when selector=='time' (time without a date)
			//		Does not check bounds.  Only years between 100 and 9999 are supported.
			//
			// dateObject:
			//		A Date object

			var _ = function(n){ return (n < 10) ? '0' + n : n; };
			options = options || {};
			var formattedDate = [],
				getter = options.zulu ? 'getUTC' : 'get',
				date = '';
			if(options.selector !== 'time'){
				var year = dateObject[getter+'FullYear']();
				date = ['0000'.substr((year+'').length)+year, _(dateObject[getter+'Month']()+1), _(dateObject[getter+'Date']())].join('-');
			}
			formattedDate.push(date);
			if(options.selector !== 'date'){
				var time = [_(dateObject[getter+'Hours']()), _(dateObject[getter+'Minutes']()), _(dateObject[getter+'Seconds']())].join(':');
				var millis = dateObject[getter+'Milliseconds']();
				if(options.milliseconds){
					time += '.'+ (millis < 100 ? '0' : '') + _(millis);
				}
				if(options.zulu){
					time += 'Z';
				}else if(options.selector !== 'time'){
					var timezoneOffset = dateObject.getTimezoneOffset();
					var absOffset = Math.abs(timezoneOffset);
					time += (timezoneOffset > 0 ? '-' : '+') +
						_(Math.floor(absOffset/60)) + ':' + _(absOffset%60);
				}
				formattedDate.push(time);
			}
			return formattedDate.join('T'); // String
		}

		// var getValueFromSlashes = function(data, src) {
		// 	var context = data;
		// 	while (src.indexOf('/') >= 0) {
		// 		//Assuming left part actually is an array
		// 		var arrayName = src.substring(0, src.indexOf('/'));
		// 		src = src.substring(src.indexOf('/') + 1);
		// 		context = context[arrayName];
		// 	}
		// 	return context[src];
		// };

		/**
		@constructor
		*/
		var Expression = extend(Properties, {

			/*
			 * Possible values:
			 * and, or,
			 * equals, notEquals,
			 * greaterThan, greaterThanOrEquals,
			 * lessThan, lesserThanOrEquals,
			 * contains, startsWith, endsWith
			 */
			operator : null,

			operatorList: initialOperatorList,
			summaryList: initialSummaryList,

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
					if (val.getMonth && isFunction(val.getMonth)) {

						return '{' + toDateString(val, {
							selector : 'date'
						}) + '}';
					} else if (isString(val)) {
						return '\'' + val + '\'';
					} else {
						return val.toString();
					}
				}
			},

			sourceValueGetter : function() {
				return isFunction(this.source) ? this._formatValue(this.source(), true) : this._formatValue(this.source);
			},

			targetValueGetter : function() {
				return isFunction(this.target) ? this._formatValue(this.target(), true) : this._formatValue(this.target);
			},

			// _targetValueGetter : function() {
			// 	return isFunction(this.target) ? this.target() : this.target;
			// },

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
					var lval = this.get('sourceValue');//_getSourceValue();

					var lsummary = null;
					if (this.sourceSummary) {
						lsummary = (resources[this.sourceSummary] || this.sourceSummary);
					}

					if (lsummary) {
						result += lsummary + '(' + lval + ')';
						if (this.get('where')){
							result += ' ( ' + resources.whereCaps + ' ' + this.get('where').toString() + ' )';
						}
					} else {
						result += lval;
					}

					result += ' ' + (resources[this.operator] || this.operator) + ' ';

					//getting right value
					var rval = this.get('targetValue');//_getTargetValue();

					var rsummary = null;

					if (this.targetSummary) {
						rsummary = (resources[this.targetSummary] || this.targetSummary);
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
					result += resources.not + '( ';
				}

				var joiner = null;

				if (this.operatorList[this.operator].reductor) {
					joiner = ' ' + (resources[this.operator] || this.operator) + ' ';
				}

				if (joiner && this.expressionList) {
					result += arrayMap(this.expressionList, function(item) {
						return '(' + item.toString() + ')';
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
				return function(data, recordContextStack, where) {
					if (data == null) {
						return src;
					} else {
						var fields = src.split('/'),
							cnt,
							len = fields.length,
							inRecordContext = true,
							r = [],
							t,
							current,
							possibleValues = [data],
							filter,
							linearize = function(arr, fldName) {
								var r = [],
									cnt,
									len = arr.length,
									current;
								for (cnt = 0; cnt < len; cnt += 1) {
									if (arr[cnt]) {
										current = arr[cnt][fldName];
										if (isArray(current)) {
											r.push.apply(r, current);
										}
										else {
											r.push(current);
										}
									}
								}
								return r;
							};
						if (where) {
							filter = function(arr, recordContextStack) {
								var cnt,
									len = arr.length,
									r = [];
								for (cnt = 0; cnt < len; cnt += 1) {
									if (where.evaluate(data, recordContextStack)) {
										r.push(arr[cnt]);
									}
								}
								return r;
							};
						}
						else {
							filter = function(arr) {
								return arr;
							};
						}
						for (cnt = 0; cnt < len; cnt += 1) {
							if (inRecordContext && (recordContextStack.length > cnt) && (recordContextStack[cnt].key === fields[cnt])) {
								possibleValues = [recordContextStack[cnt].value];
							}
							else {
								inRecordContext = false;
								t = [];
								possibleValues = linearize(possibleValues, fields[cnt]);
							}
						}
						len = possibleValues.length;
						for (cnt = 0; cnt < len; cnt += 1) {
							current = possibleValues[cnt];
							if (current !== undefined) {
								if (isArray(current)) {
									r.push.apply(r, current);
								}
								else {
									r.push(current);
								}
							}
						}
						return filter(r);
					}
				};
			},

			sourceFieldSetter : function(src) {
				this.set('source', this._buildGetterFunction(src));
			},

			targetFieldSetter : function(src) {
				this.set('target', this._buildGetterFunction(src));
			},
			ambiguousSetter: function(val) {
				this.ambiguous = val;
			},
			filter: function(arr, recordContextStack) {
				var cnt,
					len = (arr || []).length,
					r = [];
				for (cnt = 0; cnt < len; cnt += 1) {
					if (this.evaluate(arr[cnt]), recordContextStack) {
						r.push(arr[cnt]);
					}
				}
				return r;
			},
			evaluate : function(data, recordContextStack) {
				var r,
					lval,
					lsummary,
					rval,
					rsummary,
					operator;
				function singleVal(v) {
					if (isArray(v)) {
						if (v.length) {
							v = lval[0];
						}
						else {
							v = null;
						}
					}
					return v;
				}
				function solve(lval, lsummary, rval, rsummary, operator) {
					var r;
					if ((!lsummary.action) && (!rsummary.action)) {
						lval = singleVal(lval);
						rval = singleVal(rval);
						r = operator.operator(lval, rval);
					}
					else {
						if (lsummary.action) {
							lval = lsummary.action(lval);
						}
						if (rsummary.action) {
							rval = rsummary.action(rval);
						}
						lval = singleVal(lval);
						rval = singleVal(rval);
						r = operator.operator(lval, rval);
					}
					return r;
				}
				function handlePostAction() {
					var r;
					if (lsummary.postAction) {
						r = lsummary.postAction((isArray(lval)?lval:[lval]), 'left', function(lval) {
							return solve(lval, lsummary, rval, rsummary, operator);
						});
					}
					else {
						r = solve(lval, lsummary, rval, rsummary, operator);
					}
					return r;
				}
				if (!recordContextStack) {
					recordContextStack = [];
				}
				operator = this.get('operatorList')[this.get('operator')];
				if (operator.reductor) {
					r = arrayReduce(arrayMap(this.expressionList || [], function(i) { return i.evaluate(data); }), operator.reductor);
				}
				else {
					if (typeof(this.get('source')) === 'function') {
						lval = this.get('source')(data, recordContextStack, this.get('where'));
					}
					else {
						lval = this.get('source');
					}
					if (typeof(this.get('target')) === 'function') {
						rval = this.get('target')(data, recordContextStack, this.get('where'));
					}
					else {
						rval = this.get('target');
					}
					lsummary = this.summaryList[this.get('sourceSummary') || 'valueOf'];
					rsummary = this.summaryList[this.get('targetSummary') || 'valueOf'];
					r = handlePostAction();
				}
				r = (this.get('isNegative'))?!r:r;
				//TODO: implement this
				return r;
			},

			involvedSourcesGetter : function() {
				var r = {},
					cnt,
					len,
					subArray,
					subCnt,
					subLen;
				if ((this.expressionList || []).length) {
					len = this.expressionList.length;
					for (cnt = 0; cnt < len; cnt += 1) {
						subArray = this.expressionList[cnt].get('involvedSources');
						subLen = subArray.length;
						for (subCnt = 0; subCnt < subLen; subCnt += 1) {
							r[subArray[subCnt]] = true;
						}
					}
				}
				else {
					if (typeof(this.get('source')) === 'function') {
						r[this.get('source')()] = true;
					}
					if (typeof(this.get('target')) === 'function'){
						r[this.get('target')()] = true;
					}
				}

				return keys(r);
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
				r.expressionList = arrayMap(this.expressionList || [], function(item) {
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
				if (isFunction(this.source)) {
					r.sourceField = this.source();
				} else {
					r.source = this.source;
				}
				if (isFunction(this.target)) {
					r.targetField = this.target();
				} else {
					r.target = this.target;
				}
				if (this.where) {
					r.where = this.where.toJosn();
				}
				r.expressionList = arrayMap(this.expressionList || [], function(item) {
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
				this.set('expressionList', arrayMap(data.expressionList || [], function(item) {
					var r = new Expression({});
					r.fromJson(item);
					return r;
				}));
			},

			hasSource : function() {
				var r = false;
				if (this.source) {
					if (isFunction(this.source)) {
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
					if (isFunction(this.target)) {
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
						if (isFunction(this.target)) {
							valid = valid && this.target();
						} else {
							valid = valid && !((this.target === null) || (this.target === undef) || ((!isString(this.target)) && isNaN(this.target)));
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
	}
	if (isAmd) { //AMD
		define(['../extend', '../ext/Properties', '../objUtils', '../i18n!./nls/Expression.json'], moduleExport);
	} else if (isNode) { //Server side
		module.exports = moduleExport(req('../extend'), req('../ext/Properties'), req('../objUtils'), req('../i18n').getResource(req('path').resolve(__dirname, './nls/Expression.json')));
	} else {
		throw new Error('environment not supported');
	}
})(this);
