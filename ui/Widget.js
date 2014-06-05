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
		/**
		 * Sets the given id to the domNoe.
		 * If the domNode exists the assigment is performed imnediately, otherwise is executed on the 'updateSkin' event (only once.)
		 * @param  {string} v dom id for this component
		 * @return {undefined}
		 */
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
		/**
		 * Sets the given style to the domNode.
		 * If the domNode exists the assigment is performed imnediately, otherwise is executed on the 'updateSkin' event (only once.)
		 * @param  {object} v Style for widget's domNode
		 * @return {undefined}
		 */
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
		/**
		 * Register a new handler for the given event. 
		 * @param  {string} type         event type
		 * @param  {function} action       new handler
		 * @param  {boolean} persistEvent if true the action will be added to internal event listeners map and the handler to the event listeners handler list
		 * @return {object}              A pointer to the new event handler
		 * @throws {Error} If domNode is not defined
		 */
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
		/**
		 * Short hand for on.emit(this.domNode, type, data)
		 * @param  {string} type Type of event/message being emitted
		 * @param  {object} data Event/message data
		 * @return {undefined}
		 */
		emit: function (type, data) {
			return on.emit(this.domNode, type, data);
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
	});
	return Widget;
});