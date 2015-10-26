
/*
 strips out the function name after 'function '

 @param {string} fstring - the function as a string
 */
function stripFunctionName(fstring: string) {
	var idx = fstring.indexOf('(');
	if (idx > 9) {
		fstring = fstring.substr(0, 9) + fstring.substr(idx);
	}
	return fstring;
}
/*
 Iterates over an array to have the string representation of each element.
 @param {Array} obj - the array
 */
function resolveArray(obj: any[]) {
	var result: string,
		idx: number;
	result = '[';
	for (idx = 0; idx < obj.length; idx += 1) {
		if (idx > 0) {
			result += ',';
		}
		result += deepToString(obj[idx]);
	}
	result += ']';
	return result;
}

/**
returns the string representation of an object regardless of it's type
@param {(Object|Array|Function|string)} obj - the object to be represented
*/
export function deepToString (obj: any) {
	var result = '',
		o: string, idx: number;
	if ((obj !== null) && (obj !== undefined)) {
		if (obj instanceof Array) {
			result = resolveArray(obj);
		} else if (typeof(obj) === 'string') {
			result = '\'' + obj.toString() + '\'';
		} else if (typeof(obj) === 'function') {
			result = stripFunctionName(obj.toString());
		} else if (obj instanceof Object) {
			result = '{';
			idx = 0;
			for (o in obj) {
				if (obj.hasOwnProperty(o)) {
					if (idx > 0) {
						result += ',';
					}
					result += o + ':' + deepToString(obj[o]);
					idx += 1;
				}
			}
			result += '}';
		} else {
			result = obj.toString();
		}
	}
	else if (obj === null) {
		result = 'null';
	}
	return result;
}
export function protoClone (obj: any): any {
	class A {
	}
	A.prototype = obj;
	return new A();
}
export function isFunction (f: any) {
	return typeof(f) === 'function';
}
export function isString (obj: any) {
	return Object.prototype.toString.call(obj) === '[object String]';
}
export function isArray (obj: any) {
	return (Object.prototype.toString.call(obj) === '[object Array]');
}
export function isArrayLike (value: any) {
	return value &&
		typeof value === 'object' &&
		typeof value.length === 'number' &&
		//hasOwnProperty.call(value, "length") &&
		((!value.length) || Object.prototype.hasOwnProperty.call(value, value.length - 1));
}
export function isNumber (n: any) {
	return !isNaN(parseFloat(n)) && isFinite(n);
}
export function isDate (date: any) {
	return (date instanceof Date) && (!isNaN(date.valueOf()));
}

export function isHTMLElement (v: any): v is HTMLElement {
	return v && (v.nodeType === 1);
}
