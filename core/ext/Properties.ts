'use strict';

import extend from '../extend'
import { isArrayLike, isDate } from '../objUtils'

var emitToWatchList: (self: Properties, name: string, oldValue: any, newValue: any) => void;

function sliceArguments(arr: IArguments, refIndex: number) {
	var r: any[] = [];
	for (var cnt = refIndex; cnt < arr.length; cnt += 1) {
		r.push(arr[cnt]);
	}
	return r;
}
var watchIdCount = 0;

export interface WatchHandle {
	new (action: (name: string, oldValue: any, newValue: any) => void, watchList: WatchHandle[]): WatchHandle;
	pause: () => void;
	resume: () => void;
	remove: () => void;
	id: number;
	action: (name: string, oldValue: any, newValue: any) => void;
	watchList: WatchHandle[]
}

export interface EventedArray extends Array<any> {
	new (arr: any[]): EventedArray;
}

var WatchHandleConstructor = extend<WatchHandle>({
	pause: function() {
		if (this.action && !this.action['$njsIsEmpty']) {
			this.bkAction = this.action;
			this.action = function() {};
			this.action['$njsIsEmpty'] = true;
		}
	},
	resume: function() {
		if (this.action && this.action['$njsIsEmpty']) {
			this.action = this.bkAction;
			this.bkAction = null;
			delete this.bkAction;
		}
	},
	remove: function() {
		var cnt: number,
			found = -1;
		for (cnt=0; cnt < this.watchList.length; cnt += 1){
			if (this.watchList[cnt].id === this.id){
				found = cnt;
			}
		}
		if (found >= 0) {
			this.watchList.splice(found, 1);
		}
	}
}, function (action: (name: string, oldValue: any, newValue: any) => void, watchList: WatchHandle[]){
	watchIdCount += 1;
	this.id = watchIdCount;
	this.action = action;
	this.watchList = watchList;
});
var EventedArrayConstructor: { new (...rest: any[] ): EventedArray } = extend<EventedArray>(Array, function (arr: any[]) {
		var cnt: number,
			len: number;
		if (arr && arr.length) {
			len = arr.length;
			for (cnt = 0; cnt < len; cnt += 1) {
				this.push(arr[cnt]);
			}
		}
	}),
	mixRecursive: (src: any, tgt: any) => void;
function getMixedElement(element: any): any {
	var evArray: EventedArray,
		properties: Properties;
	if (isArrayLike(element)) {
		evArray = new EventedArrayConstructor();
		mixRecursive(evArray, element);
		return evArray;
	}
	else if (typeof(element) === 'object') {
		properties = new Properties({});
		mixRecursive(properties, element);
		return properties;
	}
	else {
		return element; //atomic property I guess
	}
}
mixRecursive = function (src: any, tgt: any) {
	var arr: any[],
		cnt: number,
		len: number;
	if (isArrayLike(src) && isArrayLike(tgt)) {
		while (src.length) {
			src.pop();
		}
		len = tgt.length;
		for (cnt = 0; cnt < len; cnt += 1) {
			src.push(getMixedElement(tgt[cnt]));
		}
	}
	else if (src && (typeof(src.set) === 'function') && tgt && (typeof(tgt) === 'object')) {
		for (var p in tgt) {
			if (tgt.hasOwnProperty(p)) {
				if (isArrayLike(tgt[p])) {
					arr = tgt[p];
					src[p] = new EventedArrayConstructor();
					mixRecursive(src[p], arr);
				}
				else if (typeof(tgt[p]) === 'object') {
					if (typeof(src[p]) === 'undefined') {
						src[p] = new Properties({});
					}
					mixRecursive(src[p], tgt[p]);
				}
				else {
					Properties.prototype.set.call(src, p, tgt[p]);
				}
			}
		}
	}
};

export default class Properties {
	[name: string]: any;
	get(name: string) {
		var getter = this[name + 'Getter'],
			args: any[];
		if (typeof(getter) === 'function') {
			args = sliceArguments(arguments, 1);
			return getter.apply(this, args);
		}
		else {
			return this[name];
		}
	}
	set (name: any, ...values: any[]) {
		var result: any,
			value = values[0];
		if (typeof(name) === 'string') {
			var sname: string = <string> name,
				old = this.get(sname),
				newValue = value,
				setter = this[sname + 'Setter'],
				args: any[];
			if (typeof(setter) === 'function') {
				args = sliceArguments(arguments, 1);
				result = setter.apply(this, args);
			}
			else {
				this[sname] = value;
				result = this;
			}
			if (isDate(old) && isDate(newValue)) {
				if (old.getTime() !== newValue.getTime()) {
					emitToWatchList(this, name, old, newValue);
				}
			}
			else if (old !== newValue) {
				emitToWatchList(this, sname, old, newValue);
			}
		}
		else if (name) {
			for (var p in name) {
				if (name.hasOwnProperty(p)){
					this.set(p, name[p]);
				}
			}
			result = this;
		}
		return result;
	}
	watch (name: string, action: (name: string, oldValue: any, newValue: any) => void) {
		var currentWatch = this.$njsWatch[name],
			result: WatchHandle;
		if (!currentWatch){
			currentWatch = this.$njsWatch[name] = [];
		}
		result = new WatchHandleConstructor(action, currentWatch);
		currentWatch.push(result);
		return result;
	}
	mixinProperties (target: any): Properties {
		Properties.mixin(this)(target);
		return this;
	}
	mixinRecursive (target: any): Properties {
		mixRecursive(this, target);
		return this;
	}
	$njsWatch: {
		[ name: string ]: { action: (name: string, oldValue: any, newValue: any) => void, remove: () => void }[]
	}
	$njsConstructors: ((args: any) => void)[];
	constructor (props: {}, ...argslist: any[]){
		var self = this,
			me: any = this,
			args: any = props,
			execute = () => {
				if (typeof(args) === 'object'){
					for (var p in args) {
						if (args.hasOwnProperty(p)){
							self.set(p, args[p]);
						}
					}
				}
			};
		this.$njsWatch = { };
		if (me.$njsInstanceDepth) {
			this.$njsConstructors.push(function(args: any) {
				self.$njsConstructors.push(execute);
			});
		}
		else {
			execute();
		}
	}
	static mixin (target: any) {
		return (args: any) => {
			for (var p in args) {
				if (args.hasOwnProperty(p)) {
					Properties.prototype.set.call(target, p, args[p]);
				}
			}
		};
	}
};


emitToWatchList = function (self: Properties, name: string, oldValue: any, newValue: any) {
	var watchList = self.$njsWatch,
		watchProp: { action: (name: string, oldValue: any, newValue: any) => void, remove: () => void }[],
		cnt: number;
	if (watchList) {
		watchProp = watchList[name];
		if (watchProp) {
			for (cnt = 0; cnt < watchProp.length; cnt += 1) {
				watchProp[cnt].action.call(self, name, oldValue, newValue);
			}
		}
	}
}