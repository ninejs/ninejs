(function (deps, factory) {
    if (typeof module === 'object' && typeof module.exports === 'object') {
        var v = factory(require, exports); if (v !== undefined) module.exports = v;
    }
    else if (typeof define === 'function' && define.amd) {
        define(deps, factory);
    }
})(["require", "exports", '../modernizer', './aspect'], function (require, exports) {
    var modernizer_1 = require('../modernizer');
    var aspect = require('./aspect');
    var isNode = (typeof (process) !== 'undefined') && (process.toString() === '[object process]');
    function getSelector() {
        if (window.document && window.document.body && window.document.body.querySelectorAll) {
            return {
                matches: function (node, selector, root) {
                    var r = false, arr = root.querySelectorAll(selector), cnt, len = arr.length;
                    for (cnt = 0; cnt < len; cnt += 1) {
                        if (arr[cnt] === node) {
                            r = true;
                            break;
                        }
                    }
                    return r;
                }
            };
        }
        else if (typeof (jQuery) !== 'undefined') {
            return {
                matches: function (node, selector, root) {
                    var r = false, arr = jQuery(selector, root), cnt, len = arr.length;
                    for (cnt = 0; cnt < len; cnt += 1) {
                        if (arr[cnt] === node) {
                            r = true;
                            break;
                        }
                    }
                    return r;
                }
            };
        }
        else if ((typeof (dojo) !== 'undefined') && (dojo.query)) {
            return dojo.query;
        }
        return null;
    }
    var _dojoIEListeners_, _window = (typeof (window) !== 'undefined') ? window : {};
    var major = _window.ScriptEngineMajorVersion;
    if (!isNode) {
        modernizer_1.default.add('jscript', major && (major() + _window.ScriptEngineMinorVersion() / 10));
        modernizer_1.default.add('event-orientationchange', modernizer_1.default('touch') && !modernizer_1.default('android'));
        modernizer_1.default.add('event-stopimmediatepropagation', _window.Event && !!_window.Event.prototype && !!_window.Event.prototype.stopImmediatePropagation);
        modernizer_1.default.add('event-focusin', function () {
            var doc = window.document, element = doc.createElement('input');
            return 'onfocusin' in element || (element.addEventListener && (function () {
                var hasFocusInEvent = false;
                function testFocus() {
                    hasFocusInEvent = true;
                }
                try {
                    var element = doc.createElement('input'), activeElement = doc.activeElement;
                    element.style.position = 'fixed';
                    element.style.top = element.style.left = '0';
                    element.addEventListener('focusin', testFocus, false);
                    doc.body.appendChild(element);
                    element.focus();
                    doc.body.removeChild(element);
                    element.removeEventListener('focusin', testFocus, false);
                    activeElement.focus();
                }
                catch (e) {
                }
                return hasFocusInEvent;
            })());
        });
    }
    var EventHandler = (function () {
        function EventHandler(owner, collection, action) {
            var _this = this;
            this.owner = owner;
            this.action = action;
            collection.push(this);
            this.stopPropagation = function () {
                _this.bubbles = false;
                _this.cancelled = true;
            };
            this.remove = function () {
                var index = collection.indexOf(_this);
                if (index >= 0) {
                    collection.splice(index, 1);
                }
                return null;
            };
        }
        return EventHandler;
    })();
    exports.EventHandler = EventHandler;
    var IESignal = (function () {
        function IESignal(handle) {
            this.handle = handle;
        }
        return IESignal;
    })();
    var on;
    on = (function () {
        var on = function (target, type, listener, dontFix) {
            // summary:
            //		A function that provides core event listening functionality. With this function
            //		you can provide a target, event type, and listener to be notified of
            //		future matching events that are fired.
            // target: Element|Object
            //		This is the target object or DOM element that to receive events from
            // type: String|Function
            //		This is the name of the event to listen for or an extension event type.
            // listener: Function
            //		This is the function that should be called when the event fires.
            // returns: Object
            //		An object with a remove() method that can be used to stop listening for this
            //		event.
            // description:
            //		To listen for 'click' events on a button node, we can do:
            //		|	define(['dojo/on'], function(listen){
            //		|		on(button, 'click', clickHandler);
            //		|		...
            //		Evented JavaScript objects can also have their own events.
            //		|	var obj = new Evented;
            //		|	on(obj, 'foo', fooHandler);
            //		And then we could publish a 'foo' event:
            //		|	on.emit(obj, 'foo', {key: 'value'});
            //		We can use extension events as well. For example, you could listen for a tap gesture:
            //		|	define(['dojo/on', 'dojo/gesture/tap', function(listen, tap){
            //		|		on(button, tap, tapHandler);
            //		|		...
            //		which would trigger fooHandler. Note that for a simple object this is equivalent to calling:
            //		|	obj.onfoo({key:'value'});
            //		If you use on.emit on a DOM node, it will use native event dispatching when possible.
            if (typeof target.on === 'function' && typeof type !== 'function' && !target.nodeType) {
                return target.on(type, listener);
            }
            return on.parse(target, type, listener, addListener, dontFix, this);
        };
        on.pausable = function (target, type, listener, dontFix) {
            var paused;
            var signal = on(target, type, function () {
                if (!paused) {
                    return listener.apply(this, arguments);
                }
            }, dontFix);
            signal.pause = function () {
                paused = true;
            };
            signal.resume = function () {
                paused = false;
            };
            return signal;
        };
        on.once = function (target, type, listener) {
            var signal = on(target, type, function () {
                signal.remove();
                return listener.apply(this, arguments);
            });
            return signal;
        };
        on.parse = function (target, type, listener, addListener, dontFix, matchesTarget) {
            if (type.call) {
                return type.call(matchesTarget, target, listener);
            }
            if (type.indexOf(',') > -1) {
                var events = type.split(/\s*,\s*/);
                var handles = [];
                var i = 0;
                var eventName;
                while (eventName = events[i]) {
                    i += 1;
                    handles.push(addListener(target, eventName, listener, dontFix, matchesTarget));
                }
                handles.remove = function () {
                    for (var i = 0; i < handles.length; i += 1) {
                        handles[i].remove();
                    }
                };
                return handles;
            }
            return addListener(target, type, listener, dontFix, matchesTarget);
        };
        var touchEvents = /^touch/;
        function addListener(target, type, listener, dontFix, matchesTarget) {
            var selector = type.match(/(.*):(.*)/);
            if (selector) {
                type = selector[2];
                selector = selector[1];
                return on.selector(selector, type).call(matchesTarget, target, listener);
            }
            if (modernizer_1.default('touch')) {
                if (touchEvents.test(type)) {
                    listener = fixTouchListener(listener);
                }
                if (!modernizer_1.default('event-orientationchange') && (type === 'orientationchange')) {
                    type = 'resize';
                    target = window;
                    listener = fixTouchListener(listener);
                }
            }
            if (addStopImmediate) {
                listener = addStopImmediate(listener);
            }
            if (target.addEventListener) {
                var capture = type in captures, adjustedType = capture ? captures[type] : type;
                try {
                    target.addEventListener(adjustedType, listener, capture);
                }
                catch (err) {
                    console.error(err);
                    throw err;
                }
                return {
                    remove: function () {
                        target.removeEventListener(adjustedType, listener, capture);
                    }
                };
            }
            type = 'on' + type;
            if (fixAttach && target.attachEvent) {
                return fixAttach(target, type, listener);
            }
            throw new Error('Target must be an event emitter. Event = on' + type);
        }
        on.selector = function (selector, eventType, children) {
            return function (target, listener) {
                var matchesTarget = typeof selector === 'function' ? {
                    matches: selector
                } : this, bubble = eventType.bubble;
                function select(eventTarget) {
                    matchesTarget = matchesTarget && matchesTarget.matches ? matchesTarget : getSelector();
                    if (eventTarget.nodeType !== 1) {
                        eventTarget = eventTarget.parentNode;
                    }
                    while (!matchesTarget.matches(eventTarget, selector, target)) {
                        if (eventTarget === target || children === false || !(eventTarget = eventTarget.parentNode) || eventTarget.nodeType !== 1) {
                            return;
                        }
                    }
                    return eventTarget;
                }
                if (bubble) {
                    return on(target, bubble(select), listener);
                }
                return on(target, eventType, function (event) {
                    var eventTarget = select(event.target);
                    return eventTarget && listener.call(eventTarget, event);
                });
            };
        };
        var syntheticPreventDefault = function () {
            this.cancelable = false;
            this.defaultPrevented = true;
        };
        var syntheticStopPropagation = function () {
            this.bubbles = false;
        };
        var slice = [].slice, syntheticDispatch = on.emit = function (target, type, event) {
            var args = slice.call(arguments, 2);
            var method = 'on' + type;
            if ('parentNode' in target) {
                var newEvent = args[0] = {};
                for (var i in event) {
                    if (event.hasOwnProperty(i)) {
                        newEvent[i] = event[i];
                    }
                }
                newEvent.preventDefault = syntheticPreventDefault;
                newEvent.stopPropagation = syntheticStopPropagation;
                newEvent.target = target;
                newEvent.type = type;
                event = newEvent;
            }
            do {
                if (target[method]) {
                    target[method].apply(target, args);
                }
            } while (event && event.bubbles && (target = target.parentNode));
            return event && event.cancelable && event;
        };
        var captures = modernizer_1.default('event-focusin') ? {} : {
            focusin: 'focus',
            focusout: 'blur'
        };
        if (!modernizer_1.default('event-stopimmediatepropagation')) {
            var stopImmediatePropagation = function () {
                this.immediatelyStopped = true;
                this.modified = true;
            };
            var addStopImmediate = function (listener) {
                return function (event) {
                    if (!event.immediatelyStopped) {
                        event.stopImmediatePropagation = stopImmediatePropagation;
                        return listener.apply(this, arguments);
                    }
                };
            };
        }
        if (modernizer_1.default('dom-addeventlistener')) {
            on.emit = function (target, type, event) {
                if (target.dispatchEvent && window.document.createEvent) {
                    var ownerDocument = target.ownerDocument || window.document;
                    var nativeEvent = ownerDocument.createEvent('HTMLEvents');
                    nativeEvent.initEvent(type, !!event.bubbles, !!event.cancelable);
                    for (var i in event) {
                        if ((event.hasOwnProperty(i)) && (!(i in nativeEvent))) {
                            nativeEvent[i] = event[i];
                        }
                    }
                    return target.dispatchEvent(nativeEvent) && nativeEvent;
                }
                return syntheticDispatch.apply(on, arguments);
            };
        }
        else {
            on._fixEvent = function (evt, sender) {
                if (!evt) {
                    var w = sender && (sender.ownerDocument || sender.document || sender).parentWindow || window;
                    evt = w.event;
                }
                if (!evt) {
                    return evt;
                }
                try {
                    if (lastEvent && evt.type === lastEvent.type && evt.srcElement === lastEvent.target) {
                        evt = lastEvent;
                    }
                }
                catch (e) {
                }
                if (!evt.target) {
                    (function (evt) {
                        evt.target = evt.srcElement;
                        evt.currentTarget = (sender || evt.srcElement);
                        if (evt.type === 'mouseover') {
                            evt.relatedTarget = evt.fromElement;
                        }
                        if (evt.type === 'mouseout') {
                            evt.relatedTarget = evt.toElement;
                        }
                        if (!evt.stopPropagation) {
                            evt.stopPropagation = stopPropagation;
                            evt.preventDefault = preventDefault;
                        }
                        if (evt.type === 'keypress') {
                            var c = ('charCode' in evt ? evt.charCode : evt.keyCode);
                            (function () {
                                if (c === 10) {
                                    c = 0;
                                    evt.keyCode = 13;
                                }
                                else if (c === 13 || c === 27) {
                                    c = 0;
                                }
                                else if (c === 3) {
                                    c = 99;
                                }
                            })();
                            evt.charCode = c;
                            _setKeyChar(evt);
                        }
                    })(evt);
                }
                return evt;
            };
            var lastEvent;
            var fixListener = function (listener) {
                return function (evt) {
                    evt = on._fixEvent(evt, this);
                    var result = listener.call(this, evt);
                    if (evt.modified) {
                        if (!lastEvent) {
                            setTimeout(function () {
                                lastEvent = null;
                            });
                        }
                        lastEvent = evt;
                    }
                    return result;
                };
            };
            var fixAttach = function (target, type, listener) {
                listener = fixListener(listener);
                if (((target.ownerDocument ? target.ownerDocument.parentWindow : target.parentWindow || target.window || window) !== window.top ||
                    modernizer_1.default('jscript') < 5.8) && !modernizer_1.default('config-_allow_leaks')) {
                    if (typeof _dojoIEListeners_ === 'undefined') {
                        _dojoIEListeners_ = [];
                    }
                    var emitter = target[type];
                    if (!emitter || !emitter.listeners) {
                        var oldListener = emitter;
                        emitter = new Function('event', 'var callee = arguments.callee; for(var i = 0; i<callee.listeners.length; i++){var listener = _dojoIEListeners_[callee.listeners[i]]; if(listener){listener.call(this,event);}}');
                        emitter.listeners = [];
                        target[type] = emitter;
                        emitter.global = this;
                        if (oldListener) {
                            emitter.listeners.push(_dojoIEListeners_.push(oldListener) - 1);
                        }
                    }
                    var handle;
                    emitter.listeners.push(handle = (emitter.global._dojoIEListeners_.push(listener) - 1));
                    return new IESignal(handle);
                }
                return aspect.after(target, type, listener, true);
            };
            var _setKeyChar = function (evt) {
                evt.keyChar = evt.charCode ? String.fromCharCode(evt.charCode) : '';
                evt.charOrCode = evt.keyChar || evt.keyCode;
            };
            var stopPropagation = function () {
                this.cancelBubble = true;
            };
            var preventDefault = on._preventDefault = function () {
                this.bubbledKeyCode = this.keyCode;
                if (this.ctrlKey) {
                    try {
                        this.keyCode = 0;
                    }
                    catch (e) { }
                }
                this.defaultPrevented = true;
                this.returnValue = false;
                this.modified = true;
            };
        }
        if (modernizer_1.default('touch')) {
            var Event_1 = (function () {
                function Event_1() {
                }
                return Event_1;
            })();
            ;
            var windowOrientation = window.orientation;
            var fixTouchListener = function (listener) {
                return function (originalEvent) {
                    //Event normalization(for ontouchxxx and resize):
                    //1.incorrect e.pageX|pageY in iOS
                    //2.there are no 'e.rotation', 'e.scale' and 'onorientationchange' in Android
                    //3.More TBD e.g. force | screenX | screenX | clientX | clientY | radiusX | radiusY
                    var event = originalEvent.corrected;
                    if (!event) {
                        var type = originalEvent.type;
                        try {
                            delete originalEvent.type;
                        }
                        catch (e) { }
                        if (originalEvent.type) {
                            if (modernizer_1.default('mozilla')) {
                                var event = {};
                                for (var name in originalEvent) {
                                    if (originalEvent.hasOwnProperty(name)) {
                                        event[name] = originalEvent[name];
                                    }
                                }
                            }
                            else {
                                Event_1.prototype = originalEvent;
                                event = new Event_1();
                            }
                            event.preventDefault = function () {
                                originalEvent.preventDefault();
                            };
                            event.stopPropagation = function () {
                                originalEvent.stopPropagation();
                            };
                        }
                        else {
                            event = originalEvent;
                            event.type = type;
                        }
                        originalEvent.corrected = event;
                        if (type === 'resize') {
                            if (windowOrientation === window.orientation) {
                                return null;
                            }
                            windowOrientation = window.orientation;
                            event.type = 'orientationchange';
                            return listener.call(this, event);
                        }
                        if (!('rotation' in event)) {
                            event.rotation = 0;
                            event.scale = 1;
                        }
                        var firstChangeTouch = event.changedTouches[0];
                        (function (firstChangeTouch, event) {
                            for (var i in firstChangeTouch) {
                                if (firstChangeTouch.hasOwnProperty(i)) {
                                    delete event[i];
                                    event[i] = firstChangeTouch[i];
                                }
                            }
                        })(firstChangeTouch, event);
                    }
                    return listener.call(this, event);
                };
            };
        }
        return on;
    })();
    exports.emit = on.emit;
    exports.pausable = on.pausable;
    exports.once = on.once;
    exports.default = on;
});
//# sourceMappingURL=on.js.map