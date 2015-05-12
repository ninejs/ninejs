/* global window */
define(['../core/extend', '../core/ext/Properties', '../core/on', '../core/deferredUtils', './utils/setClass', './utils/append'], function (extend, Properties, on, def, setClass, append) {
	'use strict';
	window.setTimeout(function () {
		on(window.document.body, 'click', function (/*evt*/) {
			on.emit(window.document.body, '9jsclosewidgets', { target: null });
			//evt.stopPropagation();
		});
	}, 0);
	function createWaitNode (parent) {
		setClass(parent, 'njsWaiting');
		return setClass(append(parent, 'div'), 'njsWaitNode');
	}
	function destroyWaitNode (parent, node) {
		setClass(parent, '!njsWaiting');
		parent.removeChild(node);
	}
	var EventHandler = function (owner, collection, action) {
		this.owner = owner;
		this.action = action;
		this.remove = function () {
			var index = collection.indexOf(this);
			if (index >= 0) {
				collection.splice(index, 1);
			}
		};
		this.stopPropagation = function () {
			this.bubbles = false;
			this.cancelled = true;
		};
		collection.push(this);
	};

	var Widget = extend({
		'$njsWidget': true,
		/**
		 * Calls destroy() on every registered child, and later removes all event listeners.
		 * Extend this function in order to do any implementation specific destroy logic,like finalizing non-ninejs child components.
		 * @return {undefined}
		 */
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
		/**
		 * Retisters a new child widget.
		 * @param  {ninejs/ui/Widget} w the new child to be added.
		 * @return {undefined}
		 */
		registerChildWidget: function (w) {
			this.$njsChildWidgets.push(w);
		},
		/**
		 * Remove this Widget from its parent, if this.domNode and this.domNode.parentNode are defined. Also emits a 'removing' event with an empty data.
		 * This method is used during destroying sequence in order to detach child and parent widgets.
		 * 
		 * @return {boolean} true if the component was removed from its parent; false otherwise.
		 */
		remove: function () {
			if (this.domNode && this.domNode.parentNode) {
				this.emit('removing', {});
				this.domNode.parentNode.removeChild(this.domNode);
				return true;
			}
			return false;
		},
		/**
		 * Sets the new Skin. If value is a string just returns loadSkin(value); otherwise the following checks are performed:
		 * If this widget has a skinContract; then every function and property of the current skinContract must have a match on the new skin.
		 * @param  {string|promise|object} value New skin
		 * @return {object}       A promise (if loadSkin() was called); or the actual skin value (object or string)
		 * @throws {Error} If one function or property is not found
		 */
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
		/**
		 * Sets the given css class (or classes separated by space).
		 * If the domNode exists the assigment is performed imnediately, otherwise is executed on the 'updateSkin' event (only once.)
		 * @param  {string} v Single or space-separated list of CSS classes
		 * @return {undefined}
		 */
		classSetter: function (v) {
			var arg = v.split(' ');
			var self = this;
			def.when(this.domNode, function () {
				arg.unshift(self.domNode);
				setClass.apply(null, arg);
			});
		},
		/**
		 * Sets the given id to the domNoe.
		 * If the domNode exists the assigment is performed imnediately, otherwise is executed on the 'updateSkin' event (only once.)
		 * @param  {string} v dom id for this component
		 * @return {undefined}
		 */
		idSetter: function (v) {
			var self = this;
			def.when(this.domNode, function () {
				self.domNode.id = v;
			});
		},
		/**
		 * Sets the given style to the domNode.
		 * If the domNode exists the assigment is performed imnediately, otherwise is executed on the 'updateSkin' event (only once.)
		 * @param  {object} v Style for widget's domNode
		 * @return {undefined}
		 */
		styleSetter: function (v) {
			var self = this;
			def.when(this.domNode, function () {
				self.domNode.setAttribute('style', v);
			});
		},
		/**
		 * If the current skin is a single object (not an array) and it applies (skin.applies() is true) then is cosindered the current option to be applied.
		 * 
		 * If the current skin is an array then all elements are checked to see if any one applies, the first one that applies is considered the one to be applied.
		 *
		 * If some skin was selected to be applied and is different from the currentSkin the following steps are performed:
		 * (1) If currentSkin is defined an 'updatingSkin' event is emitted; and all other skins (the ones that did not apply) are disabled.
		 * (2) A promise is built using skin.enable().
		 * 
		 * @return {promise} A promise that gets resoved when skin.enable(); after that the new skin is assigned to currentSkin and onUpdatedSkin() gets called.
		 */
		updateSkin: function () {
			var self = this;
			return def.when(this.skin, function (sk) {
				var cnt, itemSkin, currentSkin = self.currentSkin, skinList = [], toApply;
				if ((typeof(sk) === 'object') && !extend.isArray(sk)) {
					skinList.push(sk);
					if (sk.applies()){
						toApply = sk;
					}
				}
				else if (sk && sk.length) {
					for (cnt = 0; cnt < sk.length; cnt += 1) {
						itemSkin = sk[cnt];
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
					self.currentSkin = toApply;
					try {
						return def.when(toApply.enable(self), function () {
							if (self.$njsShowDefer) {
								self.$njsShowDefer.resolve(self.domNode);
								self.$njsShowDefer = null;
							}
							try {
								return self.onUpdatedSkin();
							}
							catch (err) {
								console.error(err);
							}
						}, function (err) {
							console.error(err);
						});
					}
					catch (err) {
						console.error(err);
						throw err;
					}
				}
			}, console.error);
		},
		/**
		 * Calls update over the currentSkin and then emits an 'updatedSkin' event without data.
		 * @return {undefined}
		 */
		onUpdatedSkin: function () {
			var self = this;
			this.currentSkin.updated(this);
			setTimeout(function() {
				self.emit('updatedSkin', {});
			}, 10);
		},
		/**
		 * If currentSkin is defined it gets disabled.
		 * After that currentSkin is set to null and updateSkin() is called.
		 * @return {object} same as updateSkin()
		 */
		forceUpdateSkin: function() {
			if (this.currentSkin) {
				this.currentSkin.disable();
			}
			this.currentSkin = null;
			this.updateSkin();
		},
		/**
		 * Wraps the skin within a promise and calls 'skin' setter. Then the module represented by 'name' is required and resolved to the actual value.
		 * @param  {string} name Skin component AMD path
		 * @return {promise}      The promise used to wraps the skin
		 */
		loadSkin: function(name) {
			var defer = def.defer();
			this.set('skin', defer.promise);
			require([name], function (skin) {
				defer.resolve(skin);
			});
			return defer.promise;
		},
		/**
		 * Adds all arguments to the Event Listener Handlers list. This list is later used when destroying the widget to call remove over all handlers.
		 * @return {undefined}
		 */
		own: function () {
			var cnt,
				len = arguments.length;
			for (cnt = 0; cnt < len; cnt += 1) {
				this.$njsEventListenerHandlers.push(arguments[cnt]);
			}
		},
		/**
		 * If the widged has a currentSkin then it is appended (as text or domNode) to the parent node.
		 * If the widged does not have a skin yet, then a promise is returned that resolves when updateSkin() finished; at that point all event listeners are moved (for the old domNode) and attached to the new one. The node is appended to the parent node and a self referece is returned.
		 * @param  {string|domNode} parentNode The id of the dom element, or the element itself
		 * @return {object}            This widget or a promise 
		 */
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
			if (this.waitSkin) {
				if (parentNode) {
					return def.when(this.waitSkin, function () {
						self.waitSkin = null;
						self.show(parentNode);
					});
				}
				return this.waitSkin;
			}
			if (!this.currentSkin) {
				if (this.domNode && this.domNode.nodeType === 1) {
					appendIt();
				}
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
				}, console.error);
				return this.waitSkin;
			}
			else {
				return appendIt();
			}
		},
		/**
		 * Register a new handler for the given event. 
		 * @param  {string} type         event type
		 * @param  {function} action       new handler
		 * @param  {boolean} persistEvent if true the action will be added to internal event listeners map and the handler to the event listeners handler list
		 * @return {object}              A pointer to the new event handler
		 * @throws {Error} If domNode is not defined
		 */
		on: function (type, action, persistEvent) {
			var r;
			if (!this.$njsEventListeners[type]) {
				this.$njsEventListeners[type] = [];
			}
			r = new EventHandler(this, this.$njsEventListeners[type], function (e) {
				action.apply(this.owner, arguments);
				if (this.owner.domNode && e.bubbles && (!e.cancelled)) {
					on.emit(this.owner.domNode, type, e);
				}
			});
			if (persistEvent) {
				this.$njsEventListenerHandlers.push(r);
			}
			else {
				this.own(r);
			}
			return r;
		},
		/**
		 * Short hand for on.emit(this.domNode, type, data)
		 * @param  {string} type Type of event/message being emitted
		 * @param  {object} data Event/message data
		 * @return {undefined}
		 */
		emit: function (type, data) {
			var method = 'on' + type;
			if (!this[method]) {
				this[method] = function (e) {
					var cnt,
						arr = this.$njsEventListeners[type] || [],
						len = arr.length;
					for (cnt = 0; cnt < len; cnt += 1) {
						arr[cnt].action.call(arr[cnt], e);
					}
				};
			}
			this[method].call(this, data);
		},
		/**
		 * Allows for a Widget to display a state while waiting for a promise.
		 * @param defer {Promise}
		 * @returns {Promise}
		 */
		wait: function (defer) {
			var d,
				self = this;
			if (defer) {
				if (typeof(defer.then) === 'function') {
					if (this.domNode) {
						return def.when(this.domNode, function() {
							var w = self.waitNode || self.domNode,
								waitNode = createWaitNode(w);
							return def.when(defer, function () {
								destroyWaitNode(w, waitNode);
							}, function () {
								destroyWaitNode(w, waitNode);
							});
						});
					}
					else {
						return def.when(this.show(), function () {
							var w = self.waitNode || self.domNode;
							var waitNode = createWaitNode(w);
							return def.when(defer, function () {
								destroyWaitNode(w, waitNode);
							}, function () {
								destroyWaitNode(w, waitNode);
							});
						}, function (err) {
							throw err;
						});
					}
				}
			}
			d = def.defer();
			d.resolve(true);
			return d.promise;
		}
	}, Properties,
	/**
	 * Sets default values for skin, skinContract,$njsEventListeners, $njsEventListenerHandlers, and $njsChildWidgets.
	 * 
	 * @return {undefined} 
	 */
	function () {
		this.skin = this.skin || [];
		this.skinContract = this.skinContract || [];
		this.$njsEventListeners = {};
		this.$njsEventListenerHandlers = [];
		this.$njsChildWidgets = [];
		this.$njsShowDefer = def.defer();
		if (!this.domNode) {
			this.domNode = this.$njsShowDefer.promise;
		}
		else {
			this.$njsShowDefer.resolve(this.domNode);
			this.$njsShowDefer = null;
		}
	});
	return Widget;
});