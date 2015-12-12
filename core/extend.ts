'use strict';

export interface DecoratorFunction {
	(fn: Function): any,
	$$ninejsType: string,
	method: Function
}
export interface Extendable {
	(fn: Function): any,
	extend: (...rest: any[]) => any
}
export interface Extend {
	<T>(...rest: any[]): { new (...rest: any[]): T };
	registerDecorator: (name: string, dec: (original: Function, current: Function) => any ) => void;
	after: Function;
	before: Function;
	around: Function;
	isArray: (obj: any) => boolean;
	mixin: (obj: any, target: any) => void;
	mixinRecursive: (obj: any, target: any) => void;
	postConstruct: (construct: Function) => any;
	decorators: { [decoratorName: string]: { (fn: Function): any, $$ninejsType: string, method: Function }; }
}

var decoratorList: { [name: string]: Function } = {};

function isArray(obj: any) {
	return Object.prototype.toString.call( obj ) === '[object Array]';
}
function mixin(obj: any, target: any) {
	for (var p in target) {
		if (target.hasOwnProperty(p)) {
			obj[p] = target[p];
		}
	}
}
function mixinAll(obj: any, target: any) {
	for(var p in target) {
		obj[p] = target[p];
	}
}
function mixinRecursive(obj: any, target: any) {
	for(var p in target) {
		if (target.hasOwnProperty(p)) {
			if (!isArray(obj[p]) && (!isArray(target[p])) && (typeof(obj[p]) === 'object') && (typeof(target[p]) === 'object')) {
				mixinRecursive(obj[p], target[p]);
			}
			else {
				obj[p] = target[p];
			}
		}
	}
}
function registerDecorator(decoratorName: string, decoratorFn: (...rest: any[]) => any) {
	extend.decorators[decoratorName] = (() => {
		var dec: any = function() {
			var decorator = decoratorFn.apply(this, arguments);
			decorator.$$ninejsType = decoratorName;
			decorator.method = arguments[0];
			return decorator;
		};
		dec.$$ninejsType = decoratorName;
		decoratorList[decoratorName] = dec;
		return dec;
	})();

}

function injectMethod(targetType: Function, currentMethod: DecoratorFunction, name: string) {
	var toInjectMethod = currentMethod;
	if (currentMethod.$$ninejsType && decoratorList[currentMethod.$$ninejsType]){
		var existingMethod = targetType.prototype[name];
		var resultFunction = decoratorList[currentMethod.$$ninejsType].call(targetType, existingMethod, currentMethod.method);
		toInjectMethod = resultFunction;
	}
	targetType.prototype[name] = toInjectMethod;
}
var extend: Extend = (() => {
	var extend : any = function() {
		var idx = 0,
			SuperClass: Function,
			njsType: Extendable,
			typeArgs: any[] = [];//,
//			inheritList = [];

		var fillArguments = function(args: any[]) {
			while (args[idx]){
				//if (typeof(args[idx]) === 'function'){
				//	inheritList.push(args[idx]);
				//}
				typeArgs.push(args[idx]);
				idx += 1;
			}
		};
		fillArguments.call(this, arguments);
		njsType = (() => {
			var njsType: any = function() {
				var idx = 0,
					current: any,
					currentFn: Function;
				if (!this.$njsConstructors){
					this.$njsConstructors = [];
				}
				while (typeArgs[idx]){
					current = typeArgs[idx];
					if (typeof(current) === 'function'){
						if (!this.$njsInstanceDepth) {
							this.$njsInstanceDepth = 1;
						}
						else {
							this.$njsInstanceDepth += 1;
						}
						currentFn = current;
						currentFn.apply(this, arguments);
						this.$njsInstanceDepth -= 1;
					}
					idx += 1;
				}
				if (!this.$njsInstanceDepth) {
					for (idx = 0; idx < this.$njsConstructors.length; idx += 1) {
						current = this.$njsConstructors[idx];
						(<Function> current).apply(this, arguments);
					}
					this.$njsInstanceDepth = null;
					this.$njsConstructors = null;
					delete this.$njsInstanceDepth;
					delete this.$njsConstructors;
				}
			};

			for (idx = 0; idx < typeArgs.length; idx += 1){
				var current = typeArgs[idx];
				if (typeof(current) === 'function'){
					if (idx === 0){
						SuperClass = current;
						njsType.prototype = Object.create(SuperClass.prototype);
					}
					else {//mixin into current prototype
						mixinAll(njsType.prototype, current.prototype);
					}
				}
				else if (typeof(current) === 'object'){
					for(var p in current) {
						if (current.hasOwnProperty(p)) {
							if (typeof(current[p]) === 'function') {
								injectMethod(njsType, current[p], p);
							}
							else {
								njsType.prototype[p] = current[p];
							}
						}
					}
				}
			}
			njsType.prototype.constructor = njsType;
			njsType.extend = function() {
				var args = [njsType],
					cnt: number;
				for (cnt = 0; cnt < arguments.length; cnt += 1) {
					args.push(arguments[cnt]);
				}
				return extend.apply(this, args);
			};

			return njsType;
		})();
		return njsType;
	};
	extend.decorators = {};
	return extend;
})();
registerDecorator('after', function(original, currentMethod){
	return function() {
		original.apply(this, arguments);
		return currentMethod.apply(this, arguments);
	};
});
registerDecorator('before', function(original, currentMethod){
	return function() {
		currentMethod.apply(this, arguments);
		return original.apply(this, arguments);
	};
});
registerDecorator('around', function(original: Function, currentMethod: Function){
	return function() {
		return currentMethod(original).apply(this, arguments);
	};
});
extend.after = extend.decorators['after'];
extend.before = extend.decorators['before'];
extend.around = extend.decorators['around'];
extend.registerDecorator = registerDecorator;
extend.isArray = isArray;
extend.mixin = mixin;
extend.mixinRecursive = mixinRecursive;
extend.postConstruct = function(construct: Function) {
	return function() {
		this.$njsConstructors.push(construct);
	};
};
var after = extend.after,
	before = extend.before,
	around = extend.around;

export { after, before, around, isArray, mixin, mixinRecursive }
export default extend;