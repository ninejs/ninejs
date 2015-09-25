export interface ArrayLike {
	length: number,
	[name: string]: any
}
var map: (arr: any, callback: (src: any, idx?: number, arr?: ArrayLike) => any) => any[] = (() => {
	var map: any;
	if (typeof(Array.prototype.map) === 'function') {
		map = function (arr:any, fn:(src:any, idx?:number, arr?:ArrayLike) => any) {
			return Array.prototype.map.call(arr, fn);
		};
	}
	else {
		map = function (arr:any, fn:(src:any, idx?:number, arr?:ArrayLike) => any) {
			var cnt:number,
				len = arr.length,
				r:any[] = [];
			for (cnt = 0; cnt < len; cnt += 1) {
				r.push(fn(arr[cnt], cnt, arr));
			}
			return r;
		};
	}
	return map;
})();

var forEach: (arr: any, callback: (src: any, idx?: number, arr?: ArrayLike) => void) => void = (() => {
	var forEach: any;
	if (typeof(Array.prototype.forEach) === 'function') {
		forEach = function(arr: any, fn: (src: any, idx?: number, arr?: ArrayLike) => void) {
			return Array.prototype.forEach.call(arr, fn);
		};
	}
	else {
		forEach = function(arr: any, fn: (src: any, idx?: number, arr?: ArrayLike) => void) {
			var cnt: number,
				len = arr.length;
			for (cnt = 0; cnt < len; cnt += 1) {
				fn(arr[cnt], cnt, arr);
			}
		};
	}
	return forEach;
})();

var indexOf: (arr: any, obj: any) => number = (() => {
	var indexOf: any;
	if (typeof(Array.prototype.indexOf) === 'function') {
		indexOf = function(arr: any, obj: any) {
			return Array.prototype.indexOf.call(arr, obj);
		};
	}
	else {
		indexOf = function(arr: any, obj: any) {
			var cnt: number,
				len = arr.length;
			for (cnt = 0; cnt < len; cnt += 1) {
				if (arr[cnt] === obj) {
					return cnt;
				}
			}
			return -1;
		};
	}
	return indexOf;
})();



var filter: (arr: any, callback: (src: any) => boolean, self?: any) => any[] = (() => {
	var filter: any;
	if (typeof(Array.prototype.filter) === 'function') {
		filter = function(arr: any, fun: (obj: any) => boolean, thisArg?: any) {
			return Array.prototype.filter.call(arr, fun, thisArg);
		};
	}
	else {
		filter = function(arr: any, fun: (obj: any) => boolean, thisArg?: any) {
			/* jshint bitwise: false */
			if (arr === void 0 || arr === null) {
				throw new TypeError();
			}

			var t = Object(arr);
			var len = t.length >>> 0;
			if (typeof fun !== 'function') {
				throw new TypeError();
			}

			var res: any[] = [];
			var thisArg = arguments.length >= 2 ? arguments[1] : void 0;
			for (var i = 0; i < len; i += 1) {
				if (i in t) {
					var val = t[i];

					// NOTE: Technically this should Object.defineProperty at
					//       the next index, as push can be affected by
					//       properties on Object.prototype and Array.prototype.
					//       But that method's new, and collisions should be
					//       rare, so use the more-compatible alternative.
					if (fun.call(thisArg, val, i, t)) {
						res.push(val);
					}
				}
			}

			return res;
		};
	}
	return filter;
})();

export { map, forEach, indexOf, filter };