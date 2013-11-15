(function(global) {
	'use strict';
	var isAmd = (typeof(define) !== 'undefined' && define.amd);
	var isNode = (typeof(window) === 'undefined');

	if (typeof Object.create !== 'function') {
		Object.create = (function () {
			return function (o) {
				function F() {}
				F.prototype = o;
				return new F();
			};
		})();
	}
	function moduleExport() {
		var Extend,
			decoratorList = {},
			decoratorIdentifier = '$$ninejsType';

		function isArray(obj) {
			return Object.prototype.toString.call( obj ) === '[object Array]';
		}
		function mixin(obj, target) {
			var p;
			for(p in target) {
				if (target.hasOwnProperty(p)) {
					obj[p] = target[p];
				}
			}
		}
		function mixinAll(obj, target) {
			/* jshint forin: false */
			var p;
			for(p in target) {
				obj[p] = target[p];
			}
		}
		function mixinRecursive(obj, target) {
			var p;
			for(p in target) {
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
		function registerDecorator(decoratorName, decoratorFunction) {
			Extend[decoratorName] = function() {
				var decorator = decoratorFunction.apply(this, arguments);
				decorator[decoratorIdentifier] = decoratorName;
				decorator.method = arguments[0];
				return decorator;
			};
			Extend[decoratorName][decoratorIdentifier] = decoratorName;
			decoratorList[decoratorName] = Extend[decoratorName];
		}
		function injectMethod(targetType, currentMethod, name) {
			var toInjectMethod = currentMethod;
			if (currentMethod[decoratorIdentifier] && decoratorList[currentMethod[decoratorIdentifier]]){
				var existingMethod = targetType.prototype[name];
				var resultFunction = decoratorList[currentMethod[decoratorIdentifier]].call(targetType, existingMethod, currentMethod.method);
				toInjectMethod = resultFunction;
			}
			targetType.prototype[name] = toInjectMethod;
		}
		Extend = function() {
			var idx = 0,
				SuperClass,
				njsType,
				typeArgs = [],
				inheritList = [];

			var fillArguments = function(args) {
				while (args[idx]){
					if (typeof(args[idx]) === 'function'){
						inheritList.push(args[idx]);
					}
					typeArgs.push(args[idx]);
					idx += 1;
				}
			};
			fillArguments.call(this, arguments);
			njsType = function() {
				var idx = 0, current;
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
						current.apply(this, arguments);
						this.$njsInstanceDepth -= 1;
					}
					idx += 1;
				}
				if (!this.$njsInstanceDepth){
					for (idx = 0; idx < this.$njsConstructors.length; idx += 1) {
						current = this.$njsConstructors[idx];
						current.apply(this, arguments);
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
				var args = [njsType], cnt;
				for (cnt = 0; cnt < arguments.length; cnt += 1) {
					args.push(arguments[cnt]);
				}
				return Extend.apply(this, args);
			};

			return njsType;
		};
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
		registerDecorator('around', function(original, currentMethod){
			return function() {
				return currentMethod(original).apply(this, arguments);
			};
		});
		Extend.registerDecorator = registerDecorator;
		Extend.isArray = isArray;
		Extend.mixin = mixin;
		Extend.mixinRecursive = mixinRecursive;
		Extend.postConstruct = function(construct) {
			return function() {
				this.$njsConstructors.push(construct);
			};
		};
		return Extend;
	}

	if (isAmd) { //AMD
		define([], moduleExport);
	} else if (isNode) { //Server side
		module.exports = moduleExport();
	} else { //Try to inject in global (hopefully no one does this ever)
		var extend = moduleExport();
		extend.mixinRecursive(global, { ninejs: { core: { extend: extend } } });
	}
})(this);