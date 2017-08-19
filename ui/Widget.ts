'use strict';

/* global window */
import extend from '../core/extend';
import Properties from '../core/ext/Properties';
import { default as on, EventHandler, RemovableType } from '../core/on';
import { PromiseConstructorType, when, defer, isPromise, resolve } from '../core/deferredUtils';
import setClass from './utils/setClass';
import append from './utils/append';
import { isArray, isHTMLElement } from '../core/objUtils';
import Skin from './Skin';

declare var require: any;

let widgetSpecialEvents: { [name: string]: boolean } = {
	'updatedSkin': true,
	'updatingSkin': true,
	'removing': true,
	'show': true
};

window.setTimeout(function () {
	on(window.document.body, 'click', function (/*evt*/) {
		on.emit(window.document.body, '9jsclosewidgets', { target: null });
	});
}, 0);
function createWaitNode (parent: HTMLElement, self: Widget) {
	if (!self.waiting) {
		self.waiting = true;
		setClass(parent, 'njsWaiting');
		return setClass(append(parent, 'div'), 'njsWaitNode');
	}
}
function destroyWaitNode (parent: HTMLElement, node: HTMLElement, self: Widget) {
	if (self.waiting) {
		setClass(parent, '!njsWaiting');
		delete self.waiting;
	}
	if (node) {
		parent.removeChild(node);
	}
}

let collectReduce = (previous: { array: any[], data: any }, current: (data: any) => any) => {
	let data = previous.data,
		t = current(data),
		arr = previous.array;
	if (typeof(t) !== 'undefined') {
		if (isArray(t)) {
			t.forEach(function (item: any) {
				arr.push(item);
			});
		}
		else {
			arr.push(t);
		}
	}
	return previous;
};

export interface WidgetArgs {
	skin?: any;
	waitSkin?: any;
	class?: string;
	id?: string;
	style?: string;
}

export class Widget extends Properties {
	$njsWidget: boolean;
	$njsChildWidgets: Widget[];
	$njsCollect: { [ name: string]: ((data: any) => any)[] }
	$njsEventListenerHandlers: RemovableType[];
	$njsEventListeners: { [name: string]: EventHandler[] };
	$njsShowDefer: PromiseConstructorType<HTMLElement>;
	currentSkin: Skin;
	waiting: boolean;
	/*
	Starts as a Promise then turns into a HTMLElement
	 */
	domNode: HTMLElement | Promise<HTMLElement>;
	skin: any;
	skinContract: { [name: string]: { type: string } };
	waitNode: HTMLElement;
	waitSkin: any; //Promise or Skin
	static extend(...args: any[]) {
		args.unshift(this);
		return extend.apply(null, args);
	}
	/**
	 * Calls destroy() on every registered child, and later removes all event listeners.
	 * Extend this function in order to do any implementation specific destroy logic,like finalizing non-ninejs child components.
	 * @return {undefined}
	 */
	destroy () {
		var cnt: number,
			len = this.$njsChildWidgets.length;
		for (cnt = 0; cnt < len; cnt += 1) {
			this.$njsChildWidgets[cnt].destroy();
		}
		len = this.$njsEventListenerHandlers.length;
		this.remove();
		for (cnt = 0; cnt < len; cnt += 1) {
			this.$njsEventListenerHandlers[cnt].remove();
		}
	}
	/**
	 * Registers a new child widget.
	 * @param  {ninejs/ui/Widget} w the new child to be added.
	 * @return {undefined}
	 */
	registerChildWidget (w: Widget) {
		this.$njsChildWidgets.push(w);
	}
	/**
	 * Remove this Widget from its parent, if this.domNode and this.domNode.parentNode are defined. Also emits a 'removing' event with an empty data.
	 * This method is used during destroying sequence in order to detach child and parent widgets.
	 *
	 * @return {boolean} true if the component was removed from its parent; false otherwise.
	 */
	remove () {
		let domNode = this.domNode;
		if (isHTMLElement(domNode)) {
			this.emit('removing', {});
			domNode.parentNode.removeChild(domNode);
			return true;
		}
		return false;
	}
	/**
	 * Sets the new Skin. If value is a string just returns loadSkin(value); otherwise the following checks are performed:
	 * If this widget has a skinContract; then every function and property of the current skinContract must have a match on the new skin.
	 * @param  {string|promise|object} value New skin
	 * @return {object}       A promise (if loadSkin() was called); or the actual skin value (object or string)
	 * @throws {Error} If one function or property is not found
	 */
	skinSetter (value: Skin | Promise<Skin> | string) {
		if (typeof(value) === 'string') {
			return this.loadSkin(value as string);
		}
		var self = this;
		this.skin = value;
		return when<Skin, Skin>(value as (Skin | Promise<Skin>), function (sk: Skin) {
			var skinContract = self.skinContract,
				p: string,
				item: { type: string };
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
		}, function (err: any) {
			throw new Error(err);
		});
	}
	/**
	 * Sets the given css class (or classes separated by space).
	 * If the domNode exists the assigment is performed imnediately, otherwise is executed on the 'updateSkin' event (only once.)
	 * @param  {string} v Single or space-separated list of CSS classes
	 * @return {undefined}
	 */
	classSetter (v: string) {
		var arg: any[] = v.split(' ');
		return when<HTMLElement, HTMLElement>(this.domNode, (domNode: HTMLElement) => {
			arg.unshift(domNode);
			return setClass.apply(null, arg);
		});
	}
	/**
	 * Sets the given id to the domNoe.
	 * If the domNode exists the assigment is performed imnediately, otherwise is executed on the 'updateSkin' event (only once.)
	 * @param  {string} v dom id for this component
	 * @return {undefined}
	 */
	idSetter (v: string) {
		return when<HTMLElement, HTMLElement>(this.domNode, (domNode: HTMLElement) => {
			domNode.id = v;
			return domNode;
		});
	}
	/**
	 * Sets the given style to the domNode.
	 * If the domNode exists the assigment is performed imnediately, otherwise is executed on the 'updateSkin' event (only once.)
	 * @param  {object} v Style for widget's domNode
	 * @return {undefined}
	 */
	styleSetter (v: string) {
		return when<HTMLElement, HTMLElement>(this.domNode, (domNode: HTMLElement) => {
			domNode.setAttribute('style', v);
			return domNode;
		});
	}
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
	updateSkin () {
		var self = this;
		function doUpdateSkin(sk: any) {
			var cnt: number,
				itemSkin: Skin,
				currentSkin = self.currentSkin,
				skinList: Skin[] = [],
				toApply: Skin;
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
					return when(toApply.enable(self), function () {
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
		}
		if (isPromise(this.skin)) {
			return when(this.skin, doUpdateSkin, console.error);
		}
		else {
			return doUpdateSkin(this.skin);
		}
	}
	/**
	 * Calls update over the currentSkin and then emits an 'updatedSkin' event without data.
	 * @return {undefined}
	 */
	onUpdatedSkin () {
		var self = this;
		this.currentSkin.updated(this);
		setTimeout(function() {
			self.emit('updatedSkin', {});
		}, 10);
	}
	/**
	 * If currentSkin is defined it gets disabled.
	 * After that currentSkin is set to null and updateSkin() is called.
	 * @return {object} same as updateSkin()
	 */
	forceUpdateSkin () {
		if (this.currentSkin) {
			this.currentSkin.disable();
		}
		this.currentSkin = null;
		this.updateSkin();
	}
	/**
	 * Wraps the skin within a promise and calls 'skin' setter. Then the module represented by 'name' is required and resolved to the actual value.
	 * @param  {string} name Skin component AMD path
	 * @return {promise}      The promise used to wraps the skin
	 */
	loadSkin (name: string) {
		var _defer = defer<Skin>();
		this.set('skin', _defer.promise);
		require([name], function (skin: any) {
			if (skin.default) {
				skin = skin.default;
			}
			var result: Skin = skin as Skin;
			_defer.resolve(result);
		});
		return _defer.promise;
	}
	/**
	 * Adds all arguments to the Event Listener Handlers list. This list is later used when destroying the widget to call remove over all handlers.
	 * @return {undefined}
	 */
	own (...args: RemovableType[]) {
		var cnt: number,
			len = args.length;
		for (cnt = 0; cnt < len; cnt += 1) {
			this.$njsEventListenerHandlers.push(args[cnt]);
		}
	}
	/**
	 * If the widget has a currentSkin then it is appended (as text or domNode) to the parent node.
	 * If the widget does not have a skin yet, then a promise is returned that resolves when updateSkin() finished; at that point all event listeners are moved (for the old domNode) and attached to the new one. The node is appended to the parent node and a self referece is returned.
	 * @param  {string|domNode} parentNode The id of the dom element, or the element itself
	 * @return {object}            This widget or a promise
	 */
	show (parentNode?: HTMLElement | string): Promise<HTMLElement> {
		var listeners: { [ name: string ]: EventHandler[] },
			current: EventHandler[],
			cnt: number,
			parent: HTMLElement,
			self = this;
		function appendIt(domNode: HTMLElement) {
			if (typeof(parentNode) === 'string') {
				parent = window.document.getElementById(parentNode as string);
			}
			else if (isHTMLElement(parentNode)){
				parent = parentNode;
			}
			if (parent) {
				parent.appendChild(domNode);
			}
			return resolve(domNode);
		}
		if (this.waitSkin) {
			if (parentNode) {
				return when(this.waitSkin, function () {
					self.waitSkin = null;
					return self.show(parentNode);
				});
			}
			return this.waitSkin;
		}
		if (!this.currentSkin) {
			let domNode = this.domNode;
			if (isHTMLElement(domNode)) {
				appendIt(domNode);
			}

			for (cnt = 0; cnt < self.$njsEventListenerHandlers.length; cnt += 1) {
				self.$njsEventListenerHandlers[cnt].remove();
			}
			self.$njsEventListenerHandlers = [];

			this.waitSkin = when(this.updateSkin(), function(/*sk*/) {
				if (self.domNode) {
					listeners =  self.$njsEventListeners;

					for (var p in listeners) {
						if (listeners.hasOwnProperty(p)) {
							current = listeners[p];
							for (cnt = 0; cnt < current.length; cnt += 1) {
								self.$njsEventListenerHandlers.push(on(self.domNode, p, current[cnt].action));
							}
						}
					}
				}
				let domNode = self.domNode;
				if (isHTMLElement(domNode)) {
					var result = appendIt(self.domNode as HTMLElement);
					self.waitSkin = null;
					return result;
				}
				else {
					throw new Error('Invalid domNode');
				}
			}, (error => {
				console.error(error);
				throw error;
			}));
			return this.waitSkin;
		}
		else {
			return appendIt(this.domNode as HTMLElement);
		}
	}
	/**
	 * Register a new handler for the given event.
	 * @param  {string} type         event type
	 * @param  {function} action       new handler
	 * @param  {boolean} persistEvent if true the action will be added to internal event listeners map and the handler to the event listeners handler list
	 * @return {object}              A pointer to the new event handler
	 * @throws {Error} If domNode is not defined
	 */
	on (type: string, action: (e?: any) => any, persistEvent?: boolean) {
		var r: RemovableType,
			self = this;
		if (!this.$njsEventListeners[type]) {
			this.$njsEventListeners[type] = [];
		}
		r = new EventHandler(this, this.$njsEventListeners[type], function (e) {
			action.apply(self, arguments);
			if (self.domNode && e.bubbles && (!e.cancelled)) {
				on.emit(self.domNode, type, e);
			}
		});
		if (persistEvent) {
			if (!widgetSpecialEvents[type]) {
				this.$njsEventListenerHandlers.push(r);
			}
		}
		else {
			this.own(r);
		}
		return r;
	}
	/**
	 * Short hand for on.emit(this.domNode, type, data)
	 * @param  {string} type Type of event/message being emitted
	 * @param  {object} data Event/message data
	 * @return {undefined}
	 */
	emit (type: string, data: any) {
		var method = 'on' + type;
		if (!this[method]) {
			this[method] = function (e: any) {
				var cnt: number,
					arr = this.$njsEventListeners[type] || [],
					len = arr.length;
				for (cnt = 0; cnt < len; cnt += 1) {
					arr[cnt].action.call(arr[cnt], e);
				}
			};
		}
		this[method].call(this, data);
	}
	subscribe (type: string, action: (data: any) => any) {
		if (!this.$njsCollect[type]) {
			this.$njsCollect[type] = [];
		}
		this.$njsCollect[type].push(action);
	}
	collect (type: string, data: any) {
		return (this.$njsCollect[type] || []).reduce(collectReduce, { array: [], data: data }).array;
	}
	/**
	 * Allows a Widget to display a state while waiting for a promise.
	 * @param _defer {Promise}
	 * @returns {Promise}
	 */
	wait (_defer: Promise<any>) {
		var d: PromiseConstructorType<any>,
			self = this;
		if (_defer) {
			if (typeof(_defer.then) === 'function') {
				if (this.domNode) {
					return when(this.domNode, () => {
						var w = (self.waitNode || self.domNode) as HTMLElement,
							waitNode = createWaitNode(w, self);
						return when(_defer, () => {
							destroyWaitNode(w, waitNode, self);
						}, () => {
							destroyWaitNode(w, waitNode, self);
						});
					});
				}
				else {
					return when(this.show(), function () {
						var w = (self.waitNode || self.domNode) as HTMLElement;
						var waitNode = createWaitNode(w, self);
						return when(_defer, function () {
							destroyWaitNode(w, waitNode, self);
						}, function () {
							destroyWaitNode(w, waitNode, self);
						});
					}, function (err) {
						throw err;
					});
				}
			}
		}
		d = defer();
		d.resolve(true);
		return d.promise;
	}
	/**
	 * Sets default values for skin, skinContract,$njsEventListeners, $njsEventListenerHandlers, and $njsChildWidgets.
	 *
	 * @return {undefined}
	 */
	constructor (args: WidgetArgs, init?: any) {
		init = init || {};
		init.skin = init.skin || [];
		init.skinContract = init.skinContract || {};
		init.$njsEventListeners = {};
		init.$njsEventListenerHandlers = [];
		init.$njsCollect = {};
		init.$njsChildWidgets = [];
		init.$njsShowDefer = defer<HTMLElement>();
		if (!init.domNode) {
			init.domNode = init.$njsShowDefer.promise;
		}
		else if (init.$njsShowDefer) {
			init.$njsShowDefer.resolve(init.domNode);
			init.$njsShowDefer = null;
		}
		super(args, init);
	}
}

Widget.prototype.$njsWidget = true;
Widget.prototype.waiting = false;
export default Widget;

export interface WidgetConstructor {
	new (args: any) : Widget;
}