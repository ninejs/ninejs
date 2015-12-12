'use strict';

import extend from './extend'
import bluebird from './bluebird'

declare var Promise: any;
/**
@module ninejs/core/deferredUtils 
@author Eduardo Burgos <eburgos@gmail.com>
*/

var nativePromise = typeof(Promise) === 'function';

export interface PromiseType<T> {
	then<U>(resolve: (v: T) => U | PromiseType<U>, onrejected?: (reason: any) => any) : PromiseType<U>;
	catch(onrejected?: (reason: any) => any): PromiseType<T>;
	fin(act: () => void) : PromiseType<T>
};
export interface PromiseConstructorType<T> {
	promise: PromiseType<T>;
	resolve: (v: T | PromiseType<T>) => T;
	reject: (e: Error) => void;
};
export interface PromiseManagerType {
	when:<T, U> (v: T | PromiseType<T>, success: (v?: T) => U | PromiseType<U>, reject?: (e?: Error) => void, fin?: () => void) => PromiseType<U>,
	defer:<T> (v?: T) => PromiseConstructorType<T>,
	all: (arr: any[]) => PromiseType<any[]>,
	delay: (ms: number) => PromiseType<any>
}
var Q: PromiseManagerType = bluebird;
export function isPromise<T>(valueOrPromise: any): valueOrPromise is PromiseType<T> {
	return valueOrPromise && (typeof(valueOrPromise.then) === 'function');
}
var _mapToPromises: (arr: any[]) => PromiseType<any>[];
var _defer: <T> (v?: T) => PromiseConstructorType<T>;
var _when: <T, U> (v: T | PromiseType<T>, success: (v?: T) => U | PromiseType<U>, reject?: (e?: Error) => void, fin?: () => void) => PromiseType<U>;
var _all: (arr: any[]) => PromiseType<any[]>;
var _delay: (ms: number) => PromiseType<any>;
var _series: (taskList: any[]) => PromiseType<any>;

if (nativePromise) {
	_mapToPromises = function(arr: any[]) {
		var cnt: number,
			len = arr.length,
			current: any,
			result: PromiseType<any>[] = [];
		for (cnt = 0; cnt < len; cnt += 1) {
			current = arr[cnt];
			result.push(Promise.resolve(current));
		}
		return result;
	};
	_defer = function (r?: any) {
		var pResolve: (tgt: any) => any,
			pReject: (err: any) => void,
			p = new Promise(function (resolve: (tgt: any) => any, reject: (err: any) => void) {
				pResolve = resolve;
				pReject = reject;
			});
		p.resolve = (v: any) => {
			setTimeout ( () => {
				pResolve(v);
			}, 0);
		};
		p.reject = (v: any) => {
			setTimeout ( () => {
				pReject(v);
			}, 0);
		};
		p.promise = p;
		if (arguments.length) {
			p.resolve(r);
		}
		return p;
	};
	_when = <T, U> (v: T | PromiseType<T>, success: (v?: T) => U | PromiseType<U>, reject?: (e?: Error) => void, fin?: () => void) => {
		if (isPromise<T>(v)) {
			return v.then(success, reject);
		}
		else {
			return Promise.resolve(v).then(success);
		}
	};
	_all = function (arr: any[]) {
		if (!arr.length) {
			return Promise.resolve([]);
		}
		else {
			return Promise.all(arr);
		}
	};
	_delay = function (ms: number) {
		return new Promise(function (resolve: (tgt: any) => any) {
			setTimeout(function () {
				resolve(true);
			}, ms);
		});
	};
}
else {
	_mapToPromises = function (arr: any[]) {
		var cnt: number,
			len = arr.length,
			current: any,
			defer: PromiseConstructorType<any>,
			result: PromiseType<any>[] = [];
		for (cnt = 0; cnt < len; cnt += 1) {
			current = arr[cnt];
			if (this.isPromise(current)) {
				result.push(current);
			}
			else {
				defer = this.defer();
				defer.resolve(current);
				result.push(defer.promise);
			}
		}
		return result;
	};
	_defer = function (r?: any) {
		if (typeof(r) !== 'undefined') {
			var d = Q.defer();
			d.resolve(r);
			return d;
		}
		else {
			return Q.defer();
		}
	};
	/* jshint unused: true */
	_when = <T, U> (v: T | PromiseType<T>, success: (v?: T) => U | PromiseType<U>, reject?: (e?: Error) => void, fin?: () => void) => {
		var r: PromiseType<U>;
		if (isPromise(v)) {
			r = v.then(success, reject);
		}
		else {
			r = resolve(v).then(success, reject);
		}
		if (typeof(fin) === 'function') {
			return r.fin(fin);
		}
		else {
			return r;
		}
	};
	_all = function () {
		return Q.all.apply(Q, arguments);
	};
	_delay = function () {
		return Q.delay.apply(Q, arguments);
	};
}
/*
 Receives list of:
 {
 promise: value or Promise,
 action: Function
 }
 wait for the promises and it's actions in the specified order
 returns a promise that gets resolved when all is resolved
 */
_series = function (taskList: any[]) {
	var t: any,
		currentPromise: PromiseType<any>,
		result = _defer<any>(),
		self = this;
	currentPromise = result.promise;
	taskList.forEach(function (cur) {
		var defer = self.defer();
		if (typeof(t) === 'function') {
			t = t();
		}
		if (!isPromise(t)) {
			t = self.when(t, function (t: any) {
				return t;
			});
		}
		t.then(function () {
			defer.resolve(true);
		}, function (err: Error) {
			defer.reject(err);
		});
		currentPromise = self.all([currentPromise, defer.promise]).then(cur.action || function () {});
	});
	result.resolve(true);

	return currentPromise;
};
export var delay: (ms: number) => PromiseType<any> = _delay;
export var mapToPromises: (arr: any[]) => PromiseType<any>[] = _mapToPromises;
export var defer: <T> (v?: T) => PromiseConstructorType<T> = _defer;
export var when: <T, U> (v: T | PromiseType<T>, success: (v?: T) => U | PromiseType<U>, reject?: (e?: Error) => void, fin?: () => void) => PromiseType<U> = _when;
export var all: (arr: any[]) => PromiseType<any[]> = _all;
export var series: (taskList: any[]) => PromiseType<any> = _series;
export function resolve<T>(val: T) {
	let d = defer<T>();
	d.resolve(val);
	return d.promise;
}
export function ncall<T> (fn: (...args: any[]) => any, self: any, ...args: any[]) {
	var d = defer<T>();
	function callback (err: any, result: T) {
		if (err) {
			if (err instanceof Error) {
				d.reject(err);
			}
			else {
				d.reject(new Error(err));
			}
		}
		else {
			d.resolve(result);
		}
	};
	args.push(callback);
	fn.apply(self, args);
	return d.promise;
}
export function nfcall<T> (fn: (...args: any[]) => any, ...args: any[]) {
	var d = defer<T>();
	function callback (err: any, result: T) {
		if (err) {
			if (err instanceof Error) {
				d.reject(err);
			}
			else {
				d.reject(new Error(err));
			}
		}
		else {
			d.resolve(result);
		}
	}
	args.push(callback);
	fn.apply(null, args);
	return d.promise;
}
