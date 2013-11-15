/* global window */
define(['../core/extend', '../core/ext/Properties', 'dojo/on'], function(extend, Properties, on) {
	'use strict';
	window.setTimeout(function () {
		on(window.document.body, 'click', function (evt) {
			on.emit(window.document.body, '9jsclosewidgets', { target: null });
			evt.stopPropagation();
		});
	}, 0);
	var Widget = extend({
		'$njsWidget': true,
		'$njsEventListeners': {},
		'$njsEventListenerHandlers': [],
		destroy: function() { },
		skinSetter: function(value) {
			var cnt, skinContract = this.skinContract, current, p, item;
			if (skinContract) {
				for (cnt = 0; cnt < skinContract.length; cnt += 1){
					current = skinContract[cnt];
					for (p in current) {
						if (current.hasOwnProperty(p)){
							item = current[p];
							if (p.type === 'function'){
								if (typeof(value[p] !== 'function')){
									throw new Error('incompatible skins. This skin must have a ' + p + ' function defined');
								}
							}
							else if (p.type === 'property') {
								if ((typeof(value[p]) === 'undefined') || (typeof(value[p]) === 'function')) {
									throw new Error('incompatible skins. This skin must have a ' + p + ' property defined');
								}
							}
						}
					}
				}
			}
			this.skin = value;
		},
		updateSkin: function() {
			var cnt, itemSkin, currentSkin = this.currentSkin, skinList = [], toApply;
			if ((typeof(this.skin) === 'object') && !extend.isArray(this.skin)){
				skinList.push(this.skin);
				if (this.skin.applies()){
					toApply = this.skin;
				}
			}
			else if (this.skin && this.skin.length) {
				for (cnt = 0; cnt < this.skin.length; cnt += 1) {
					itemSkin = this.skin[cnt];
					if (!toApply && itemSkin.applies()){
						toApply = itemSkin;
					}
					skinList.push(itemSkin);
				}
			}
			if (toApply !== currentSkin){
				if (currentSkin) {
					for (cnt = 0; cnt < skinList.length; cnt += 1) {
						itemSkin = skinList[cnt];
						itemSkin.disable();
					}
				}
				toApply.enable(this);
				this.currentSkin = toApply;
			}
		},
		forceUpdateSkin: function() {
			if (this.currentSkin) {
				this.currentSkin.disable();
			}
			this.currentSkin = null;
			this.updateSkin();
		},
		own: function() {
			var cnt,
				len = arguments.length;
			for (cnt = 0; cnt < len; cnt += 1) {
				this.$njsEventListenerHandlers.push(arguments[cnt]);
			}
		},
		show: function(parentNode) {
			var p, listeners, current, cnt;
			if (!this.currentSkin){
				this.updateSkin();
				if (this.domNode) {
					listeners =  this.$njsEventListeners;
					for (cnt=0; cnt < this.$njsEventListenerHandlers; cnt += 1){
						current = this.$njsEventListenerHandlers[cnt];
						current.remove();
					}
					this.$njsEventListenerHandlers = [];
					for (p in listeners){
						if (listeners.hasOwnProperty(p)) {
							current = listeners[p];
							for (cnt=0; cnt < current.length; cnt += 1){
								this.$njsEventListenerHandlers.push(on(this.domNode, p, current[cnt]));
							}
						}
					}
				}
			}
			if (typeof(parentNode) === 'string') {
				parentNode = window.document.getElementById(parentNode);
			}
			if (parentNode) {
				parentNode.appendChild(this.domNode);
			}
			return this;
		},
		on: function(type, action, persistEvent) {
			var r, self = this;
			if (!this.$njsEventListeners[type]) {
				this.$njsEventListeners[type] = [];
			}
			if (persistEvent) {
				this.$njsEventListeners[type].push(action);
			}
			if (!this.domNode) {
				this.show();
			}
			r = on(this.domNode, type, function() {
				action.apply(self, arguments);
			});
			if (persistEvent) {
				this.$njsEventListenerHandlers.push(r);
			}

			return r;
		},
		emit: function(type, data) {
			return on.emit(this.domNode, type, data);
		}
	}, Properties, function() {
		this.skin = this.skin || [];
		this.skinContract = this.skinContract || [];
	});
	return Widget;
});