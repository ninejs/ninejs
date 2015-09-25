/// <reference path="./extend.ts" />

import extend from './extend'
import bluebird from './bluebird'

//declare var define:{
//	(deps:string[], callback:(...rest:any[]) => any): void;
//	amd: any;
//};
declare var Promise: any;
/**
@module ninejs/core/deferredUtils 
@author Eduardo Burgos <eburgos@gmail.com>
*/

var nativePromise = typeof(Promise) === 'function';

export interface PromiseType {
	then(resolve: (v: any) => any, ...rest: ((v: any) => void)[]) : PromiseType;
	fin(act: () => void) : PromiseType
};
export interface PromiseConstructorType {
	promise: PromiseType;
	resolve: (v: any) => void;
	reject: (e: Error) => void;
};
export interface PromiseManagerType {
	when: (v: any, success: (v: any) => any, reject?: (e: Error) => void, fin?: () => void) => PromiseType,
	defer: (v?: any) => PromiseConstructorType,
	all: (arr: any[]) => PromiseType,
	delay: (ms: number) => PromiseType
}
var Q: PromiseManagerType = bluebird;
export function isPromise(valueOrPromise: any) {
	return valueOrPromise && (typeof(valueOrPromise.then) === 'function');
}
var _mapToPromises: (arr: any[]) => PromiseType[];
var _defer: (v: any) => PromiseConstructorType;
var _when: (valueOrPromise: any, onSuccess: (tgt: any) => any, onFailure: (err: any) => void) => PromiseType;
var _all: (arr: any[]) => PromiseType;
var _delay: (ms: number) => PromiseType;
var _series: (taskList: any[]) => PromiseType;

if (nativePromise) {
	_mapToPromises = function(arr: any[]) {
		var cnt: number,
			len = arr.length,
			current: any,
			result: PromiseType[] = [];
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
			setTimeout ( () => { pResolve(v); }, 0);
		};
		p.reject = (v: any) => {
			setTimeout ( () => { pReject(v); }, 0);
		};
		p.promise = p;
		if (arguments.length) {
			p.resolve(r);
		}
		return p;
	};
	_when = function (valueOrPromise: any, onSuccess: (tgt: any) => any, onFailure: (err: any) => void) {
		if (isPromise(valueOrPromise)) {
			return Promise.resolve(valueOrPromise).then(onSuccess, onFailure);
		}
		else {
			return Promise.resolve(onSuccess(valueOrPromise));
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
			defer: PromiseConstructorType,
			result: PromiseType[] = [];
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
	_when = function (valueOrPromise: any, resolve: (v: any) => any, reject?: (e: Error) => void, progress?: (p: any) => void, finalBlock?: () => void) {
		var r: PromiseType;
		if (isPromise(valueOrPromise)) {
			r = valueOrPromise.then(resolve, reject);
		}
		else {
			var defer = Q.defer();
			r = defer.promise.then(resolve, reject);
			defer.resolve(valueOrPromise);
		}
		if (typeof(finalBlock) === 'function') {
			return r.fin(finalBlock);
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
		currentPromise: PromiseType,
		result = this.defer(),
		self = this;
	currentPromise = result.promise;
	taskList.forEach(function (cur) {
		var defer = self.defer();
		t = cur.promise;
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
export var delay: (ms: number) => PromiseType = _delay;
export var mapToPromises: (arr: any[]) => PromiseType[] = _mapToPromises;
export var defer: (v?: any) => PromiseConstructorType = _defer;
export var when: (valueOrPromise: any, resolve: (v: any) => any, reject?: (e: any) => void, progress?: (p: any) => void, finalBlock?: () => void) => PromiseType = _when;
export var all: (arr: any[]) => PromiseType = _all;
export var series: (taskList: any[]) => PromiseType = _series;
export function ncall (fn: (...args: any[]) => any, self: any, ...args: any[]) {
	var d = defer();
	function callback (err: any, result: any) {
		if (err) {
			d.reject(err);
		}
		else {
			d.resolve(result);
		}
	};
	args.push(callback);
	fn.apply(self, args);
	return d.promise;
}
export function nfcall (fn: (...args: any[]) => any, ...args: any[]) {
	var d = defer();
	function callback (err: any, result: any) {
		if (err) {
			d.reject(err);
		}
		else {
			d.resolve(result);
		}
	};
	args.push(callback);
	fn.apply(null, args);
	return d.promise;
}
export function resolve(r: any) {
	var d = defer(r);
	return d.promise;
}

