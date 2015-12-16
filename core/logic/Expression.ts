///<amd-dependency path="../i18n!./nls/Expression.json" />

/**
 @author   Eduardo Burgos
 @version  0.1
 @description Expression used to hold a logic expression and being able to
 represent it and evaluate it over a collection of data or a service.
 @exports ninejs/core/logic/Expression
 */
'use strict';

import Properties from '../ext/Properties';
import { isArray, isFunction, isString } from '../objUtils';
import { getResource } from '../i18n';
import { map as arrayMap } from '../array';

declare var define: any;
var locale: any,
	req = require,
	isAmd = (typeof(define) !== 'undefined' && define.amd),
	isNode = (typeof(window) === 'undefined');

if (isAmd) { //AMD
	locale = require('../i18n!./nls/Expression.json');
} else if (isNode) { //Server side
	locale = getResource(req('path').resolve(__dirname, './nls/Expression.json'), req);
} else {
	throw new Error('environment not supported');
}

var keys: (obj: any) => string[];
if (typeof(Object.keys) === 'function') {
	keys = Object.keys;
}
else {
	keys = function(obj: any) {
		var r: string[] = [],
			p: string;
		for (p in obj) {
			if (obj.hasOwnProperty(p)) {
				r.push(p);
			}
		}
		return r;
	};
}

export interface Operator {
	name: string;
	operator?: (a: any, b: any) => boolean;
	reductor?: (a: any, b: any) => boolean;
	dataTypeList?: string[];
}

var initialOperatorList: { [ name: string ]: Operator } = {
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
		'operator': function(a,b) { return a == b; }
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
		'operator': function(a,b) {
			if ((typeof(a) === 'undefined') || (a == null)) {
				return false;
			}
			else {
				return String.prototype.indexOf.call(a, b) >= 0;
			}
		},
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

export interface Summary {
	name: string;
	dataTypeList: (item: any) => boolean;
	action?: (data: any) => any;
	postAction?: (values: any[], side: string, fn: (val: any) => boolean) => boolean;
}

var resources = locale.resource,
	initialSummaryList: { [ name: string ]: Summary } = {
		'valueOf': {
			name: 'valueOf',
			dataTypeList: function(item: any) {
				return item.dataType !== 'record';
			}
		},
		'countOf': {
			name: 'countOf',
			dataTypeList: function(item: any) {
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
			dataTypeList: function(item: any) {
				return (item.dataType === 'record') || (item.parent) || item.isMultiValued;
			},
			postAction: function(values, side, fn) {
				if (side !== 'left') {
					throw new Error('not implemented');
				}
				var cnt: number,
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
			dataTypeList: function(item: any) {
				return (item.dataType === 'record') || (item.parent) || item.isMultiValued;
			},
			postAction: function(values, side, fn) {
				if (side !== 'left') {
					throw new Error('not implemented');
				}
				var cnt: number,
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
			dataTypeList: function(item: any) {
				return ((item.dataType === 'record') || (item.parent) || item.isMultiValued) && ((item.dataType === 'integer') || (item.dataType === 'decimal'));
			},
			action: function(data: any) {
				if (!isArray(data)) {
					data = [data];
				}
				var cnt: number,
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
			dataTypeList: function (item: any) {
				return ((item.dataType === 'record') || (item.parent) || item.isMultiValued) && ((item.dataType === 'integer') || (item.dataType === 'decimal'));
			},
			action: function(data: any) {
				if (!isArray(data)) {
					data = [data];
				}
				var cnt: number,
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
enum SelectorOptions {
	date = <any> 'date',
	time = <any> 'time'
}
interface DateStringOptions {
	selector?: SelectorOptions;
	zulu?: boolean;
	milliseconds?: boolean;
}

function toDateString(dateObj: Date, options?: DateStringOptions){
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

	var dateObject: any = dateObj;
	var _ = function(n: number){ return (n < 10) ? '0' + n : n; };
	options = options || {};
	var formattedDate: string[] = [],
		getter = options.zulu ? 'getUTC' : 'get',
		date = '';
	if(options.selector !== SelectorOptions.time){
		var year = dateObject[getter+'FullYear']();
		date = ['0000'.substr((year+'').length)+year, _(dateObject[getter+'Month']()+1), _(dateObject[getter+'Date']())].join('-');
	}
	formattedDate.push(date);
	if(options.selector !== SelectorOptions.date){
		var time: string = [_(dateObject[getter+'Hours']()), _(dateObject[getter+'Minutes']()), _(dateObject[getter+'Seconds']())].join(':');
		var millis = dateObject[getter+'Milliseconds']();
		if(options.milliseconds){
			time += '.'+ (millis < 100 ? '0' : '') + _(millis);
		}
		if(options.zulu){
			time += 'Z';
		}else if(options.selector !== SelectorOptions.time){
			var timezoneOffset = dateObject.getTimezoneOffset();
			var absOffset = Math.abs(timezoneOffset);
			time += (timezoneOffset > 0 ? '-' : '+') +
				_(Math.floor(absOffset/60)) + ':' + _(absOffset%60);
		}
		formattedDate.push(time);
	}
	return formattedDate.join('T'); // String
}

export interface RecordContext {
	name: string;
	value: any;
}
/**
@constructor
*/
class Expression extends Properties {

	constructor (args: any) {
		this.operator = null;
		this.operatorList = initialOperatorList;
		this.summaryList = initialSummaryList;
		this.isNegative = false;
		this.source = null;
		this.sourceSummary = null;
		this.target = null;
		this.targetSummary = null;
		this.expressionList = null;
		this.where = null;
		this.ambiguous = false;
		super(args);
	}
	/*
	 * Possible values:
	 * and, or,
	 * equals, notEquals,
	 * greaterThan, greaterThanOrEquals,
	 * lessThan, lesserThanOrEquals,
	 * contains, startsWith, endsWith
	 */
	operator: string;
	operatorList: { [ name: string ]: Operator };
	summaryList: { [ name: string ]: Summary };

	/*
	 * Specifies whether or not this expression is a negative expression.
	 */
	isNegative : boolean;

	/*
	 * Possible values:
	 * String: Means a literal value. The expression is comparing from a literal
	 * value
	 * Function: Means a calculated value. Most likely coming from the context
	 */
	source: any;

	sourceSummary: string;

	/*
	 * Possible values:
	 * String: Means a literal value. The expression is comparing to a literal value
	 * Function: Means a calculated value. Most likely coming from the context
	 */
	target: any;

	targetSummary: string;

	/*
	 * Used in with a conjunction or disjunction expression. Only works when the
	 * operator is and|or
	 */
	expressionList: Expression[];

	where: Expression;

	ambiguous: boolean;

	_formatValue (val: any, isVariable?: boolean, forDisplay?: boolean) {
		if ((val === null) || ((( typeof val) === 'number') && isNaN(val))) {
			return null;
		}
		if (isVariable) {
			return '[' + val + ']';
		} else {
			//checking if its date
			if (val.getMonth && isFunction(val.getMonth)) {

				return '{' + toDateString(val, {
					selector : SelectorOptions.date
				}) + '}';
			} else if (isString(val) && forDisplay) {
				return '\'' + val + '\'';
			} else {
				return val.toString();
			}
		}
	}

	sourceValueGetter () {
		return isFunction(this.source) ? this._formatValue(this.source(), true) : this._formatValue(this.source);
	}

	sourceValueForDisplay () {
		return isFunction(this.source) ? this._formatValue(this.source(), true, true) : this._formatValue(this.source, undefined, true);
	}

	targetValueGetter () {
		return isFunction(this.target) ? this._formatValue(this.target(), true) : this._formatValue(this.target);
	}

	targetValueForDisplay () {
		return isFunction(this.target) ? this._formatValue(this.target(), true, true) : this._formatValue(this.target, undefined, true);
	}

	toString () {
		var result = '';

		function valueWhenNoOperators(self: Expression) {
			if ((self.sourceSummary === null) && (!self.hasSource()) && (!self.hasTarget())) {
				if (self.isNegative) {
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
			var lval = this.sourceValueForDisplay();

			var lsummary: string = null;
			if (this.sourceSummary) {
				lsummary = (resources[this.sourceSummary] || this.sourceSummary);
			}

			if (lsummary) {
				result += lsummary + '(' + lval + ')';
				if (this.get('where')) {
					result += ' ( ' + resources.whereCaps + ' ' + this.get('where').toString() + ' )';
				}
			} else {
				result += lval;
			}

			result += ' ' + (resources[this.operator] || this.operator) + ' ';

			//getting right value
			var rval = this.targetValueForDisplay();

			var rsummary: string = null;

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
			return valueWhenNoOperators(this);
		}

		if (this.isNegative) {
			result += resources.not + '( ';
		}

		var joiner: string = null;

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
	}

	_buildGetterFunction (src: string) {
		return function(data: any, recordContextStack: RecordContext[], where: Expression): any {
			if (data == null) {
				return src;
			} else {
				var fields = src.split('/'),
					cnt: number,
					len = fields.length,
					r: any[] = [],
					current: any,
					possibleValues = [data],
					linearize = function(arr: any[], fields: string[], fieldIndex: number, recordContextStack: RecordContext[]) {
						var r: any[] = [],
							cnt: number,
							len: number,
							fieldName: string,
							val: any;
						while ((fieldIndex < recordContextStack.length) && (fields[fieldIndex] === recordContextStack[fieldIndex].name)) {
							arr = [recordContextStack[fieldIndex].value];
							fieldIndex += 1;
						}
						len = arr.length;
						fieldName = fields[fieldIndex];
						if (fieldIndex < (fields.length - 1)) {
							arr.map(function (item) {
								return item[fieldName];
							}).forEach(function (item) {
								if (isArray(item)) {
									item.forEach(function (i: any) {
										recordContextStack.push({ name: fieldName, value: i });
										linearize([i], fields, fieldIndex + 1, recordContextStack).forEach(function (i) {
											r.push(i);
										});
										recordContextStack.pop();
									});

								}
								else {
									//NTODO: Not implemented yet, fields that are a composition rather than an array.
								}
							});
						}
						else {
							for (cnt = 0; cnt < len; cnt += 1) {
								if (where) {
									val = arr[cnt][fieldName];
									if (isArray(val)) {
										val.forEach(function (v: any) {
											recordContextStack.push({name: fieldName, value: v});
											if (where.evaluate(data, recordContextStack)) {
												r.push(v);
											}
											recordContextStack.pop();
										})
									}
									else {
										if (where.evaluate(data, recordContextStack)) {
											r.push(val);
										}
									}
								}
								else {
									r.push(arr[cnt][fieldName]);
								}
							}
						}
						return r;
					};

				possibleValues = linearize(possibleValues, fields, 0, recordContextStack);

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
				return r;
			}
		};
	}

	sourceFieldSetter (src: string) {
		this.set('source', this._buildGetterFunction(src));
	}

	targetFieldSetter (src: string) {
		this.set('target', this._buildGetterFunction(src));
	}
	ambiguousSetter (val: boolean) {
		this.ambiguous = val;
	}
	filter (arr: any[], recordContextStack?: RecordContext[]) {
		var cnt: number,
			len = (arr || []).length,
			r: any[] = [];
		for (cnt = 0; cnt < len; cnt += 1) {
			if (this.evaluate(arr[cnt], recordContextStack)) {
				r.push(arr[cnt]);
			}
		}
		return r;
	}
	evaluate (data: any, recordContextStack?: RecordContext[]) {
		var r: boolean,
			lval: any,
			lsummary: Summary,
			rval: any,
			rsummary: Summary,
			operator: Operator;
		function singleVal(v: any) {
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
		function solve(lval: any, lsummary: Summary, rval: any, rsummary: Summary, operator: Operator) {
			var r: any;
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
			var r: any;
			if (lsummary.postAction) {
				r = lsummary.postAction((isArray(lval)?lval:[lval]), 'left', function(lval: any) {
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
			r = arrayMap(this.expressionList || [], function(i) { return i.evaluate(data); }).reduce(operator.reductor);
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
	}

	involvedSourcesGetter () {
		var r: any = {},
			cnt: number,
			len: number,
			subArray: string[],
			subCnt: number,
			subLen: number;
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
	}

	reset () {
		this.operator = 'equals';

		this.isNegative = false;

		this.source = null;

		this.target = null;

		this.where = null;

		this.expressionList = null;
	}

	clone () {
		var r = new Expression ({});
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
	}

	toJson () {
		var r: any = {
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
			r.where = this.where.toJson();
		}
		r.expressionList = arrayMap(this.expressionList || [], function(item) {
			return item.toJson();
		});

		return r;
	}

	fromJson (data: any) {
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
	}

	hasSource () {
		var r = false;
		if (this.source) {
			if (isFunction(this.source)) {
				r = !!(this.source());
			} else {
				r = !!(this.source);
			}
		}
		return r;
	}

	hasTarget () {
		var r = false;
		if (this.target) {
			if (isFunction(this.target)) {
				r = !!(this.target());
			} else {
				r = !!(this.target);
			}
		}
		return r;
	}

	isValid () {
		var valid = !this.get('ambiguous');
		valid = valid && this.hasSource();
		if (valid) {
			valid = valid && !!this.operator;
			if (valid) {
				if (isFunction(this.target)) {
					valid = valid && this.target();
				} else {
					valid = valid && !((this.target === null) || (typeof(this.target) === 'undefined') || ((!isString(this.target)) && isNaN(this.target)));
				}
			}
			if (this.get('where')) {
				valid = valid && this.get('where').isValid();
			}
		}
		return valid;
	}
}

export default Expression;

