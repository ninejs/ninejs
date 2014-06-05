/* global window */
define(['../core/extend', '../core/ext/Properties', '../core/on', '../core/deferredUtils', './utils/setClass'], function (extend, Properties, on, def, setClass) {
	'use strict';
	window.setTimeout(function () {
		on(window.document.body, 'click', function (/*evt*/) {
			on.emit(window.document.body, '9jsclosewidgets', { target: null });
			//evt.stopPropagation();
		});
	}, 0);
	var Widget = extend({
		'$njsWidget': true,
		destroy: function () {
			var cnt,
				len = this.$njsChildWidgets.length;
			for (cnt = 0; cnt < len; cnt += 1) {
				this.$njsChildWidgets[cnt].destroy();
			}
			len = this.$njsEventListenerHandlers.length;
			this.remove();
			for (cnt = 0; cnt < len; cnt += 1) {
				this.$njsEventListenerHandlers[cnt].remove();
			}
		},
		registerChildWidget: function (w) {
			this.$njsChildWidgets.push(w);
		},
		remove: function () {
			if (this.domNode && this.domNode.parentNode) {
				this.emit('removing', {});
				this.domNode.parentNode.removeChild(this.domNode);
				return true;
			}
			return false;
		},
		skinSetter: function (value) {
			if (typeof(value) === 'string') {
				return this.loadSkin(value);
			}
			var self = this;
			this.skin = value;
			return def.when(value, function (sk) {
				var skinContract = self.skinContract,
					p,
					item;
				if (skinContract) {
					for (p in skinContract) {
						if (skinContract.hasOwnProperty(p)) {
							item = skinContract[p];
							if (item.type === 'function') {
								if (typeof(sk[p]) !== 'function') {
									throw new Error('incompatible skins. This skin must have a ' + p + ' function defined');
								}
							}
							else if (item.type === 'property') {
								if ((typeof(sk[p]) === 'undefined') || (typeof(sk[p]) === 'function')) {
									throw new Error('incompatible skins. This skin must have a ' + p + ' property defined');
								}
							}
						}
					}
				}
				self.skin = sk;
				return sk;
			}, function (err) {
				throw new Error(err);
			});
		},
		classSetter: function (v) {
			var arg = v.split(' ');
			arg.unshift(this.domNode);
			if (this.domNode) {
				setClass.apply(null, arg);
			}
			else {
				on.once(this, 'updatedSkin', function () {
					setClass.apply(null, arg);
				});
			}
		},
		idSetter: function (v) {
			if (this.domNode) {
				this.domNode.id = v;
			}
			else {
				var self = this;
				on.once(this, 'updatedSkin', function () {
					self.domNode.id = v;
				});
			}
		},
		styleSetter: function (v) {
			if (this.domNode) {
				this.domNode.style = v;
			}
			else {
				var self = this;
				on.once('updatedSkin', function () {
					self.domNode.style = v;
				});
			}
		},
		updateSkin: function () {
			var self = this;
			return def.when(this.skin, function () {
				var cnt, itemSkin, currentSkin = self.currentSkin, skinList = [], toApply;
				if ((typeof(self.skin) === 'object') && !extend.isArray(self.skin)) {
					skinList.push(self.skin);
					if (self.skin.applies()){
						toApply = self.skin;
					}
				}
				else if (self.skin && self.skin.length) {
					for (cnt = 0; cnt < self.skin.length; cnt += 1) {
						itemSkin = self.skin[cnt];
						if (!toApply && itemSkin.applies()){
							toApply = itemSkin;
						}
						skinList.push(itemSkin);
					}
				}
				if (toApply !== currentSkin) {
					if (currentSkin) {
						self.emit('updatingSkin', {});
						for (cnt = 0; cnt < skinList.length; cnt += 1) {
							itemSkin = skinList[cnt];
							itemSkin.disable();
						}
					}
					return def.when(toApply.enable(self), function () {
						self.currentSkin = toApply;
						self.onUpdatedSkin();
					});
				}
			});
		},
		onUpdatedSkin: function () {
			var self = this;
			this.currentSkin.updated(this);
			setTimeout(function() {
				self.emit('updatedSkin', {});
			}, 10);
		},
		forceUpdateSkin: function() {
			if (this.currentSkin) {
				this.currentSkin.disable();
			}
			this.currentSkin = null;
			this.updateSkin();
		},
		loadSkin: function(name) {
			var defer = def.defer();
			this.set('skin', defer.promise);
			require([name], function (skin) {
				defer.resolve(skin);
			});
			return defer.promise;
		},
		own: function () {
			var cnt,
				len = arguments.length;
			for (cnt = 0; cnt < len; cnt += 1) {
				this.$njsEventListenerHandlers.push(arguments[cnt]);
			}
		},
		show: function (parentNode) {
			var listeners,
				current,
				cnt,
				self = this;
			function appendIt() {
				if (typeof(parentNode) === 'string') {
					parentNode = window.document.getElementById(parentNode);
				}
				if (parentNode) {
					parentNode.appendChild(self.domNode);
				}
				return self;
			}
			if (!this.currentSkin) {
				if (this.waitSkin) {
					return this.waitSkin;
				}
				else {
					this.waitSkin = def.when(this.updateSkin(), function(/*sk*/) {
						if (self.domNode) {
							listeners =  self.$njsEventListeners;
							for (cnt = 0; cnt < self.$njsEventListenerHandlers; cnt += 1) {
								current = self.$njsEventListenerHandlers[cnt];
								current.remove();
							}
							self.$njsEventListenerHandlers = [];
							for (var p in listeners) {
								if (listeners.hasOwnProperty(p)) {
									current = listeners[p];
									for (cnt = 0; cnt < current.length; cnt += 1) {
										self.$njsEventListenerHandlers.push(on(self.domNode, p, current[cnt]));
									}
								}
							}
						}
						var result = appendIt();
						self.waitSkin = null;
						return result;
					});
					return this.waitSkin;
				}
			}
			else {
				return appendIt();
			}
		},
		on: function (type, action, persistEvent) {
			var r,
				self = this;
			if (!this.$njsEventListeners[type]) {
				this.$njsEventListeners[type] = [];
			}
			if (persistEvent) {
				this.$njsEventListeners[type].push(action);
			}
			if (!this.domNode) {
				throw new Error('Widget must have a root node prior to attaching events. Try calling widget.show() first.');
			}
			r = on(this.domNode, type, function () {
				action.apply(self, arguments);
			});
			if (persistEvent) {
				this.$njsEventListenerHandlers.push(r);
			}
			else {
				this.own(r);
			}

			return r;
		},
		emit: function (type, data) {
			return on.emit(this.domNode, type, data);
		}
	}, Properties, function () {
		this.skin = this.skin || [];
		this.skinContract = this.skinContract || [];
		this.$njsEventListeners = {};
		this.$njsEventListenerHandlers = [];
		this.$njsChildWidgets = [];
	});
	return Widget;
});