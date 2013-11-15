(function(global) {
	'use strict';
	var isAmd = (typeof(define) !== 'undefined' && define.amd);
	var isNode = (typeof(window) === 'undefined');

	function emitToWatchList(self, name, oldValue, newValue){
		var watchList = self['$njsWatch'], watchProp, cnt;
		if (watchList) {
			watchProp = watchList[name];
			if (watchProp){
				for (cnt=0; cnt < watchProp.length; cnt += 1){
					watchProp[cnt].action.call(self, name, oldValue, newValue);
				}
			}
		}

	}
	function sliceArguments(arr, refIndex){
		var r = [];
		for (var cnt = refIndex; cnt < arr.length; cnt += 1){
			r.push(arr[cnt]);
		}
		return r;
	}
	function moduleExport(extend){
		var watchIdCount = 0;
		var WatchHandle = extend({
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
				var cnt, found = -1;
				for (cnt=0; cnt < this.watchList.length; cnt += 1){
					if (this.watchList[cnt].id === this.id){
						found = cnt;
					}
				}
				if (found >= 0) {
					this.watchList.splice(found, 1);
				}
			}
		}, function(action, watchList){
			watchIdCount += 1;
			this.id = watchIdCount;
			this.action = action;
			this.watchList = watchList;
		});
		var Properties = extend({
			get: function(name) {
				var getter = this[name + 'Getter'], args;
				if (typeof(getter) === 'function'){
					args = sliceArguments(arguments, 1);
					return getter.apply(this, args);
				}
				else {
					return this[name];
				}
			},
			set: function(name, value) {
				var result;
				if (typeof(name) === 'string'){
					var old = this.get(name), newValue = value, setter = this[name + 'Setter'], args;
					if (typeof(setter) === 'function'){
						args = sliceArguments(arguments, 1);
						result = setter.apply(this, args);
					}
					else {
						this[name] = value;
						result = this;
					}
					if (old !== newValue) {
						emitToWatchList(this, name, old, newValue);
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
			},
			watch: function(name, action) {
				var currentWatch = this['$njsWatch'][name], result;
				if (!currentWatch){
					currentWatch = this['$njsWatch'][name] = [];
				}
				result = new WatchHandle(action, currentWatch);
				currentWatch.push(result);
				return result;
			},
			mixinProperties: function(target) {
				Properties.mixin(target).call(this);
				return this;
			}
		}, function(){
			var self = this;
			this['$njsWatch'] = { };
			this.$njsConstructors.push(function(args) {
				self.$njsConstructors.push(function() {
					if (typeof(args) === 'object'){
						for (var p in args) {
							if (args.hasOwnProperty(p)){
								this.set(p, args[p]);
							}
						}
					}
				});
			});
		});
		Properties.mixin = function(target) {
			return function() {
				for (var p in target) {
					if (target.hasOwnProperty(p)) {
						Properties.prototype.set.call(this, p, target[p]);
					}
				}
			};
		};

		return Properties;
	}

	if (isAmd) { //AMD
		define(['../extend'], moduleExport);
	} else if (isNode) { //Server side
		var req = require, extend = req('../extend');
		module.exports = moduleExport(extend);
	} else { //Try to inject in global (hopefully no one does this ever)
		global.ninejs.core.extend.mixinRecursive(global, { ninejs: { core: { ext: { Properties: moduleExport(global.ninejs.core.extend) }}}});
	}
})(this);