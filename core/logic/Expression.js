var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
(function (factory) {
    if (typeof module === 'object' && typeof module.exports === 'object') {
        var v = factory(require, exports); if (v !== undefined) module.exports = v;
    }
    else if (typeof define === 'function' && define.amd) {
        define(["require", "exports", "../i18n!./nls/Expression.json", '../ext/Properties', '../objUtils', '../i18n', '../array'], factory);
    }
})(function (require, exports) {
    var Properties_1 = require('../ext/Properties');
    var objUtils_1 = require('../objUtils');
    var i18n_1 = require('../i18n');
    var array_1 = require('../array');
    var locale, req = require, isAmd = (typeof (define) !== 'undefined' && define.amd), isNode = (typeof (window) === 'undefined');
    if (isAmd) {
        locale = require('../i18n!./nls/Expression.json');
    }
    else if (isNode) {
        locale = i18n_1.getResource(req('path').resolve(__dirname, './nls/Expression.json'), req);
    }
    else {
        throw new Error('environment not supported');
    }
    var keys;
    if (typeof (Object.keys) === 'function') {
        keys = Object.keys;
    }
    else {
        keys = function (obj) {
            var r = [], p;
            for (p in obj) {
                if (obj.hasOwnProperty(p)) {
                    r.push(p);
                }
            }
            return r;
        };
    }
    var initialOperatorList = {
        'and': {
            name: 'and',
            reductor: function (a, b) {
                return (!!a) && (!!b);
            }
        },
        'or': {
            name: 'or',
            reductor: function (a, b) {
                return (!!a) || (!!b);
            }
        },
        'equals': {
            name: 'equals',
            'operator': function (a, b) { return a == b; }
        },
        'notEquals': {
            name: 'notEquals',
            'operator': function (a, b) { return a !== b; }
        },
        'greaterThan': {
            name: 'greaterThan',
            'operator': function (a, b) { return a > b; },
            dataTypeList: [
                'Number'
            ]
        },
        'greaterThanOrEquals': {
            name: 'greaterThanOrEquals',
            'operator': function (a, b) { return a >= b; },
            dataTypeList: [
                'Number'
            ]
        },
        'lessThan': {
            name: 'lessThan',
            'operator': function (a, b) { return a < b; },
            dataTypeList: [
                'Number'
            ]
        },
        'lessThanOrEquals': {
            name: 'lessThanOrEquals',
            'operator': function (a, b) { return a <= b; },
            dataTypeList: [
                'Number'
            ]
        },
        'contains': {
            name: 'contains',
            'operator': function (a, b) { return String.prototype.indexOf.call(a, b) >= 0; },
            dataTypeList: [
                'String'
            ]
        },
        'startsWith': {
            name: 'startsWith',
            'operator': function (a, b) {
                if (a == null) {
                    return false;
                }
                return String.prototype.indexOf.call(a, b) === 0;
            },
            dataTypeList: [
                'String'
            ]
        },
        'endsWith': {
            name: 'endsWith',
            'operator': function (a, b) {
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
    var resources = locale.resource, initialSummaryList = {
        'valueOf': {
            name: 'valueOf',
            dataTypeList: function (item) {
                return item.dataType !== 'record';
            }
        },
        'countOf': {
            name: 'countOf',
            dataTypeList: function (item) {
                return (item.dataType === 'record') || (item.parent) || item.isMultiValued;
            },
            action: function (data) {
                if (!objUtils_1.isArray(data)) {
                    data = [data];
                }
                return data.length;
            }
        },
        'some': {
            name: 'some',
            dataTypeList: function (item) {
                return (item.dataType === 'record') || (item.parent) || item.isMultiValued;
            },
            postAction: function (values, side, fn) {
                if (side !== 'left') {
                    throw new Error('not implemented');
                }
                var cnt, len = values.length;
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
            dataTypeList: function (item) {
                return (item.dataType === 'record') || (item.parent) || item.isMultiValued;
            },
            postAction: function (values, side, fn) {
                if (side !== 'left') {
                    throw new Error('not implemented');
                }
                var cnt, len = values.length;
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
            dataTypeList: function (item) {
                return ((item.dataType === 'record') || (item.parent) || item.isMultiValued) && ((item.dataType === 'integer') || (item.dataType === 'decimal'));
            },
            action: function (data) {
                if (!objUtils_1.isArray(data)) {
                    data = [data];
                }
                var cnt, len = data.length, r = 0;
                for (cnt = 0; cnt < len; cnt += 1) {
                    r += data[cnt];
                }
                return r;
            }
        },
        'averageOf': {
            name: 'averageOf',
            dataTypeList: function (item) {
                return ((item.dataType === 'record') || (item.parent) || item.isMultiValued) && ((item.dataType === 'integer') || (item.dataType === 'decimal'));
            },
            action: function (data) {
                if (!objUtils_1.isArray(data)) {
                    data = [data];
                }
                var cnt, len = data.length, r = 0;
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
    var SelectorOptions;
    (function (SelectorOptions) {
        SelectorOptions[SelectorOptions["date"] = 'date'] = "date";
        SelectorOptions[SelectorOptions["time"] = 'time'] = "time";
    })(SelectorOptions || (SelectorOptions = {}));
    function toDateString(dateObj, options) {
        var dateObject = dateObj;
        var _ = function (n) { return (n < 10) ? '0' + n : n; };
        options = options || {};
        var formattedDate = [], getter = options.zulu ? 'getUTC' : 'get', date = '';
        if (options.selector !== SelectorOptions.time) {
            var year = dateObject[getter + 'FullYear']();
            date = ['0000'.substr((year + '').length) + year, _(dateObject[getter + 'Month']() + 1), _(dateObject[getter + 'Date']())].join('-');
        }
        formattedDate.push(date);
        if (options.selector !== SelectorOptions.date) {
            var time = [_(dateObject[getter + 'Hours']()), _(dateObject[getter + 'Minutes']()), _(dateObject[getter + 'Seconds']())].join(':');
            var millis = dateObject[getter + 'Milliseconds']();
            if (options.milliseconds) {
                time += '.' + (millis < 100 ? '0' : '') + _(millis);
            }
            if (options.zulu) {
                time += 'Z';
            }
            else if (options.selector !== SelectorOptions.time) {
                var timezoneOffset = dateObject.getTimezoneOffset();
                var absOffset = Math.abs(timezoneOffset);
                time += (timezoneOffset > 0 ? '-' : '+') +
                    _(Math.floor(absOffset / 60)) + ':' + _(absOffset % 60);
            }
            formattedDate.push(time);
        }
        return formattedDate.join('T');
    }
    var Expression = (function (_super) {
        __extends(Expression, _super);
        function Expression(args) {
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
            _super.call(this, args);
        }
        Expression.prototype._formatValue = function (val, isVariable) {
            if ((val === null) || (((typeof val) === 'number') && isNaN(val))) {
                return null;
            }
            if (isVariable) {
                return '[' + val + ']';
            }
            else {
                if (val.getMonth && objUtils_1.isFunction(val.getMonth)) {
                    return '{' + toDateString(val, {
                        selector: SelectorOptions.date
                    }) + '}';
                }
                else if (objUtils_1.isString(val)) {
                    return '\'' + val + '\'';
                }
                else {
                    return val.toString();
                }
            }
        };
        Expression.prototype.sourceValueGetter = function () {
            return objUtils_1.isFunction(this.source) ? this._formatValue(this.source(), true) : this._formatValue(this.source);
        };
        Expression.prototype.targetValueGetter = function () {
            return objUtils_1.isFunction(this.target) ? this._formatValue(this.target(), true) : this._formatValue(this.target);
        };
        Expression.prototype.toString = function () {
            var result = '';
            function valueWhenNoOperators(self) {
                if ((self.sourceSummary === null) && (!self.hasSource()) && (!self.hasTarget())) {
                    if (self.isNegative) {
                        return resources.alwaysFalse;
                    }
                    else {
                        return resources.alwaysTrue;
                    }
                }
                else {
                    return resources.invalidExpression;
                }
            }
            function appendWhenSingleExpression() {
                var result = '';
                var lval = this.get('sourceValue');
                var lsummary = null;
                if (this.sourceSummary) {
                    lsummary = (resources[this.sourceSummary] || this.sourceSummary);
                }
                if (lsummary) {
                    result += lsummary + '(' + lval + ')';
                    if (this.get('where')) {
                        result += ' ( ' + resources.whereCaps + ' ' + this.get('where').toString() + ' )';
                    }
                }
                else {
                    result += lval;
                }
                result += ' ' + (resources[this.operator] || this.operator) + ' ';
                var rval = this.get('targetValue');
                var rsummary = null;
                if (this.targetSummary) {
                    rsummary = (resources[this.targetSummary] || this.targetSummary);
                }
                if (rsummary) {
                    result += rsummary + '(' + rval + ')';
                }
                else {
                    result += rval;
                }
                return result;
            }
            if (this.get('ambiguous')) {
                return resources.ambiguousExpression;
            }
            if (!this.operator) {
                return valueWhenNoOperators(this);
            }
            if (this.isNegative) {
                result += resources.not + '( ';
            }
            var joiner = null;
            if (this.operatorList[this.operator].reductor) {
                joiner = ' ' + (resources[this.operator] || this.operator) + ' ';
            }
            if (joiner && this.expressionList) {
                result += array_1.map(this.expressionList, function (item) {
                    return '(' + item.toString() + ')';
                }).join(joiner);
            }
            else {
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
        };
        Expression.prototype._buildGetterFunction = function (src) {
            return function (data, recordContextStack, where) {
                if (data == null) {
                    return src;
                }
                else {
                    var fields = src.split('/'), cnt, len = fields.length, r = [], current, possibleValues = [data], linearize = function (arr, fields, fieldIndex, recordContextStack) {
                        var r = [], cnt, len, fieldName, val;
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
                                if (objUtils_1.isArray(item)) {
                                    item.forEach(function (i) {
                                        recordContextStack.push({ name: fieldName, value: i });
                                        linearize([i], fields, fieldIndex + 1, recordContextStack).forEach(function (i) {
                                            r.push(i);
                                        });
                                        recordContextStack.pop();
                                    });
                                }
                                else {
                                }
                            });
                        }
                        else {
                            for (cnt = 0; cnt < len; cnt += 1) {
                                if (where) {
                                    val = arr[cnt][fieldName];
                                    if (objUtils_1.isArray(val)) {
                                        val.forEach(function (v) {
                                            recordContextStack.push({ name: fieldName, value: v });
                                            if (where.evaluate(data, recordContextStack)) {
                                                r.push(v);
                                            }
                                            recordContextStack.pop();
                                        });
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
                            if (objUtils_1.isArray(current)) {
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
        };
        Expression.prototype.sourceFieldSetter = function (src) {
            this.set('source', this._buildGetterFunction(src));
        };
        Expression.prototype.targetFieldSetter = function (src) {
            this.set('target', this._buildGetterFunction(src));
        };
        Expression.prototype.ambiguousSetter = function (val) {
            this.ambiguous = val;
        };
        Expression.prototype.filter = function (arr, recordContextStack) {
            var cnt, len = (arr || []).length, r = [];
            for (cnt = 0; cnt < len; cnt += 1) {
                if (this.evaluate(arr[cnt], recordContextStack)) {
                    r.push(arr[cnt]);
                }
            }
            return r;
        };
        Expression.prototype.evaluate = function (data, recordContextStack) {
            var r, lval, lsummary, rval, rsummary, operator;
            function singleVal(v) {
                if (objUtils_1.isArray(v)) {
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
                    r = lsummary.postAction((objUtils_1.isArray(lval) ? lval : [lval]), 'left', function (lval) {
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
                r = array_1.map(this.expressionList || [], function (i) { return i.evaluate(data); }).reduce(operator.reductor);
            }
            else {
                if (typeof (this.get('source')) === 'function') {
                    lval = this.get('source')(data, recordContextStack, this.get('where'));
                }
                else {
                    lval = this.get('source');
                }
                if (typeof (this.get('target')) === 'function') {
                    rval = this.get('target')(data, recordContextStack, this.get('where'));
                }
                else {
                    rval = this.get('target');
                }
                lsummary = this.summaryList[this.get('sourceSummary') || 'valueOf'];
                rsummary = this.summaryList[this.get('targetSummary') || 'valueOf'];
                r = handlePostAction();
            }
            r = (this.get('isNegative')) ? !r : r;
            return r;
        };
        Expression.prototype.involvedSourcesGetter = function () {
            var r = {}, cnt, len, subArray, subCnt, subLen;
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
                if (typeof (this.get('source')) === 'function') {
                    r[this.get('source')()] = true;
                }
                if (typeof (this.get('target')) === 'function') {
                    r[this.get('target')()] = true;
                }
            }
            return keys(r);
        };
        Expression.prototype.reset = function () {
            this.operator = 'equals';
            this.isNegative = false;
            this.source = null;
            this.target = null;
            this.where = null;
            this.expressionList = null;
        };
        Expression.prototype.clone = function () {
            var r = new Expression({});
            r.operator = this.operator;
            r.isNegative = this.isNegative;
            r.source = this.source;
            r.target = this.target;
            r.sourceSummary = this.sourceSummary;
            r.targetSummary = this.targetSummary;
            if (this.get('where')) {
                r.where = this.get('where').clone();
            }
            r.expressionList = array_1.map(this.expressionList || [], function (item) {
                return item.clone();
            });
            return r;
        };
        Expression.prototype.toJson = function () {
            var r = {
                operator: this.operator,
                isNegative: this.isNegative,
                sourceSummary: this.sourceSummary,
                targetSummary: this.targetSummary
            };
            if (objUtils_1.isFunction(this.source)) {
                r.sourceField = this.source();
            }
            else {
                r.source = this.source;
            }
            if (objUtils_1.isFunction(this.target)) {
                r.targetField = this.target();
            }
            else {
                r.target = this.target;
            }
            if (this.where) {
                r.where = this.where.toJson();
            }
            r.expressionList = array_1.map(this.expressionList || [], function (item) {
                return item.toJson();
            });
            return r;
        };
        Expression.prototype.fromJson = function (data) {
            this.set('operator', data.operator);
            this.set('isNegative', data.isNegative);
            if (data.sourceField) {
                this.set('sourceField', data.sourceField);
            }
            else {
                this.set('source', data.source);
            }
            if (data.targetField) {
                this.set('targetField', data.targetField);
            }
            else {
                this.set('target', data.target);
            }
            if (data.where) {
                var whereExpression = new Expression({});
                whereExpression.fromJson(data.where);
                this.set('where', whereExpression);
            }
            this.set('sourceSummary', data.sourceSummary);
            this.set('targetSummary', data.targetSummary);
            this.set('expressionList', array_1.map(data.expressionList || [], function (item) {
                var r = new Expression({});
                r.fromJson(item);
                return r;
            }));
        };
        Expression.prototype.hasSource = function () {
            var r = false;
            if (this.source) {
                if (objUtils_1.isFunction(this.source)) {
                    r = !!(this.source());
                }
                else {
                    r = !!(this.source);
                }
            }
            return r;
        };
        Expression.prototype.hasTarget = function () {
            var r = false;
            if (this.target) {
                if (objUtils_1.isFunction(this.target)) {
                    r = !!(this.target());
                }
                else {
                    r = !!(this.target);
                }
            }
            return r;
        };
        Expression.prototype.isValid = function () {
            var valid = !this.get('ambiguous');
            valid = valid && this.hasSource();
            if (valid) {
                valid = valid && !!this.operator;
                if (valid) {
                    if (objUtils_1.isFunction(this.target)) {
                        valid = valid && this.target();
                    }
                    else {
                        valid = valid && !((this.target === null) || (typeof (this.target) === 'undefined') || ((!objUtils_1.isString(this.target)) && isNaN(this.target)));
                    }
                }
                if (this.get('where')) {
                    valid = valid && this.get('where').isValid();
                }
            }
            return valid;
        };
        return Expression;
    })(Properties_1.default);
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = Expression;
});
//# sourceMappingURL=Expression.js.map