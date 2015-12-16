(function (factory) {
    if (typeof module === 'object' && typeof module.exports === 'object') {
        var v = factory(require, exports); if (v !== undefined) module.exports = v;
    }
    else if (typeof define === 'function' && define.amd) {
        define(["require", "exports"], factory);
    }
})(function (require, exports) {
    'use strict';
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = (function (window) {
        var _window = (typeof (window) !== 'undefined') ? window : {}, _document = window.document;
        var Modernizr = (function (window, document) {
            var version = '2.6.2', Modernizr = function (tst) {
                return Modernizr[tst];
            }, enableClasses = false;
            if (typeof (process) !== 'undefined') {
                return Modernizr;
            }
            var docElement = document.documentElement, mod = 'modernizr', modElem = document.createElement(mod), mStyle = modElem.style, inputElem = document.createElement('input'), smile = ':)', toString = {}.toString, prefixes = ' -webkit- -moz- -o- -ms- '.split(' '), omPrefixes = 'Webkit Moz O ms', cssomPrefixes = omPrefixes.split(' '), domPrefixes = omPrefixes.toLowerCase().split(' '), ns = {
                'svg': 'http://www.w3.org/2000/svg'
            }, tests = {}, inputs = {}, attrs = {}, classes = [], slice = classes.slice, featureName, injectElementWithStyles = function (rule, callback, nodes, testnames) {
                var style, ret, node, docOverflow, div = document.createElement('div'), body = document.body, fakeBody = body || document.createElement('body');
                if (parseInt(nodes, 10)) {
                    while (nodes--) {
                        node = document.createElement('div');
                        node.id = testnames ? testnames[nodes] : mod + (nodes + 1);
                        div.appendChild(node);
                    }
                }
                style = ['&#173;', '<style id="s', mod, '">', rule, '</style>'].join('');
                div.id = mod;
                (body ? div : fakeBody).innerHTML += style;
                fakeBody.appendChild(div);
                if (!body) {
                    fakeBody.style.background = '';
                    fakeBody.style.overflow = 'hidden';
                    docOverflow = docElement.style.overflow;
                    docElement.style.overflow = 'hidden';
                    docElement.appendChild(fakeBody);
                }
                ret = callback(div, rule);
                if (!body) {
                    fakeBody.parentNode.removeChild(fakeBody);
                    docElement.style.overflow = docOverflow;
                }
                else {
                    div.parentNode.removeChild(div);
                }
                return !!ret;
            }, testMediaQuery = function (mq) {
                var matchMedia = _window.matchMedia || _window.msMatchMedia;
                if (matchMedia) {
                    return matchMedia(mq).matches;
                }
                var bool;
                injectElementWithStyles('@media ' + mq + ' { #' + mod + ' { position: absolute; } }', function (node) {
                    bool = (_window.getComputedStyle ?
                        getComputedStyle(node, null) :
                        node.currentStyle)['position'] == 'absolute';
                });
                return bool;
            }, isEventSupported = (function () {
                var TAGNAMES = {
                    'select': 'input',
                    'change': 'input',
                    'submit': 'form',
                    'reset': 'form',
                    'error': 'img',
                    'load': 'img',
                    'abort': 'img'
                };
                function isEventSupported(eventName, element) {
                    element = element || document.createElement(TAGNAMES[eventName] || 'div');
                    eventName = 'on' + eventName;
                    var isSupported = eventName in element;
                    if (!isSupported) {
                        if (!element.setAttribute) {
                            element = document.createElement('div');
                        }
                        if (element.setAttribute && element.removeAttribute) {
                            element.setAttribute(eventName, '');
                            isSupported = is(element[eventName], 'function');
                            if (!is(element[eventName], 'undefined')) {
                                element[eventName] = undefined;
                            }
                            element.removeAttribute(eventName);
                        }
                    }
                    element = null;
                    return isSupported;
                }
                return isEventSupported;
            })(), _hasOwnProperty = ({}).hasOwnProperty, hasOwnProp;
            if (!is(_hasOwnProperty, 'undefined') && !is(_hasOwnProperty.call, 'undefined')) {
                hasOwnProp = function (object, property) {
                    return _hasOwnProperty.call(object, property);
                };
            }
            else {
                hasOwnProp = function (object, property) {
                    return ((property in object) && is(object.constructor.prototype[property], 'undefined'));
                };
            }
            if (!Function.prototype.bind) {
                Function.prototype.bind = function bind(that) {
                    var target = this;
                    if (typeof target != "function") {
                        throw new TypeError();
                    }
                    var args = slice.call(arguments, 1), bound = function () {
                        if (this instanceof bound) {
                            var F = (function () {
                                function F() {
                                }
                                return F;
                            })();
                            F.prototype = target.prototype;
                            var self = new F();
                            var result = target.apply(self, args.concat(slice.call(arguments)));
                            if (Object(result) === result) {
                                return result;
                            }
                            return self;
                        }
                        else {
                            return target.apply(that, args.concat(slice.call(arguments)));
                        }
                    };
                    return bound;
                };
            }
            function setCss(str) {
                mStyle.cssText = str;
            }
            function setCssAll(str1, str2) {
                return setCss(prefixes.join(str1 + ';') + (str2 || ''));
            }
            function is(obj, type) {
                return typeof obj === type;
            }
            function contains(str, substr) {
                return !!~('' + str).indexOf(substr);
            }
            function testProps(props, prefixed) {
                for (var i in props) {
                    var prop = props[i];
                    if (!contains(prop, "-") && mStyle[prop] !== undefined) {
                        return prefixed == 'pfx' ? prop : true;
                    }
                }
                return false;
            }
            function testDOMProps(props, obj, elem) {
                for (var i in props) {
                    var item = obj[props[i]];
                    if (item !== undefined) {
                        if (elem === false)
                            return props[i];
                        if (is(item, 'function')) {
                            return item.bind(elem || obj);
                        }
                        return item;
                    }
                }
                return false;
            }
            function testPropsAll(prop, prefixed, elem) {
                var ucProp = prop.charAt(0).toUpperCase() + prop.slice(1), props = (prop + ' ' + cssomPrefixes.join(ucProp + ' ') + ucProp).split(' ');
                if (is(prefixed, "string") || is(prefixed, "undefined")) {
                    return testProps(props, prefixed);
                }
                else {
                    props = (prop + ' ' + (domPrefixes).join(ucProp + ' ') + ucProp).split(' ');
                    return testDOMProps(props, prefixed, elem);
                }
            }
            tests['flexbox'] = function () {
                return testPropsAll('flexWrap');
            };
            tests['flexboxlegacy'] = function () {
                return testPropsAll('boxDirection');
            };
            tests['canvas'] = function () {
                var elem = document.createElement('canvas');
                return !!(elem.getContext && elem.getContext('2d'));
            };
            tests['canvastext'] = function () {
                return !!(Modernizr['canvas'] && is(document.createElement('canvas').getContext('2d').fillText, 'function'));
            };
            tests['webgl'] = function () {
                return (typeof (WebGLRenderingContext) !== 'undefined') && (!!WebGLRenderingContext);
            };
            tests['touch'] = function () {
                var bool;
                if (('ontouchstart' in _window) || (typeof (DocumentTouch) !== 'undefined') && (DocumentTouch) && document instanceof DocumentTouch) {
                    bool = true;
                }
                else {
                    injectElementWithStyles(['@media (', prefixes.join('touch-enabled),('), mod, ')', '{#modernizr{top:9px;position:absolute}}'].join(''), function (node) {
                        bool = node.offsetTop === 9;
                    });
                }
                return bool;
            };
            tests['geolocation'] = function () {
                return 'geolocation' in navigator;
            };
            tests['postmessage'] = function () {
                return !!_window.postMessage;
            };
            tests['websqldatabase'] = function () {
                return !!_window.openDatabase;
            };
            tests['indexedDB'] = function () {
                return !!testPropsAll("indexedDB", _window);
            };
            tests['hashchange'] = function () {
                return isEventSupported('hashchange', _window) && (_document.documentMode === undefined || _document.documentMode > 7);
            };
            tests['history'] = function () {
                return !!(_window.history && history.pushState);
            };
            tests['draganddrop'] = function () {
                var div = document.createElement('div');
                return ('draggable' in div) || ('ondragstart' in div && 'ondrop' in div);
            };
            tests['websockets'] = function () {
                return 'WebSocket' in _window || 'MozWebSocket' in _window;
            };
            tests['rgba'] = function () {
                setCss('background-color:rgba(150,255,150,.5)');
                return contains(mStyle.backgroundColor, 'rgba');
            };
            tests['hsla'] = function () {
                setCss('background-color:hsla(120,40%,100%,.5)');
                return contains(mStyle.backgroundColor, 'rgba') || contains(mStyle.backgroundColor, 'hsla');
            };
            tests['multiplebgs'] = function () {
                setCss('background:url(https://),url(https://),red url(https://)');
                return (/(url\s*\(.*?){3}/).test(mStyle.background);
            };
            tests['backgroundsize'] = function () {
                return testPropsAll('backgroundSize');
            };
            tests['borderimage'] = function () {
                return testPropsAll('borderImage');
            };
            tests['borderradius'] = function () {
                return testPropsAll('borderRadius');
            };
            tests['boxshadow'] = function () {
                return testPropsAll('boxShadow');
            };
            tests['textshadow'] = function () {
                return document.createElement('div').style.textShadow === '';
            };
            tests['opacity'] = function () {
                setCssAll('opacity:.55');
                return (/^0.55$/).test(mStyle.opacity);
            };
            tests['cssanimations'] = function () {
                return testPropsAll('animationName');
            };
            tests['csscolumns'] = function () {
                return testPropsAll('columnCount');
            };
            tests['cssgradients'] = function () {
                var str1 = 'background-image:', str2 = 'gradient(linear,left top,right bottom,from(#9f9),to(white));', str3 = 'linear-gradient(left top,#9f9, white);';
                setCss((str1 + '-webkit- '.split(' ').join(str2 + str1) +
                    prefixes.join(str3 + str1)).slice(0, -str1.length));
                return contains(mStyle.backgroundImage, 'gradient');
            };
            tests['cssreflections'] = function () {
                return testPropsAll('boxReflect');
            };
            tests['csstransforms'] = function () {
                return !!testPropsAll('transform');
            };
            tests['csstransforms3d'] = function () {
                var ret = !!testPropsAll('perspective');
                if (ret && 'webkitPerspective' in docElement.style) {
                    injectElementWithStyles('@media (transform-3d),(-webkit-transform-3d){#modernizr{left:9px;position:absolute;height:3px;}}', function (node, rule) {
                        ret = node.offsetLeft === 9 && node.offsetHeight === 3;
                    });
                }
                return ret;
            };
            tests['csstransitions'] = function () {
                return testPropsAll('transition');
            };
            tests['fontface'] = function () {
                var bool;
                injectElementWithStyles('@font-face {font-family:"font";src:url("https://")}', function (node, rule) {
                    var style = document.getElementById('smodernizr'), sheet = style.sheet || style.styleSheet, cssText = sheet ? (sheet.cssRules && sheet.cssRules[0] ? sheet.cssRules[0].cssText : sheet.cssText || '') : '';
                    bool = /src/i.test(cssText) && cssText.indexOf(rule.split(' ')[0]) === 0;
                });
                return bool;
            };
            tests['generatedcontent'] = function () {
                var bool;
                injectElementWithStyles(['#', mod, '{font:0/0 a}#', mod, ':after{content:"', smile, '";visibility:hidden;font:3px/1 a}'].join(''), function (node) {
                    bool = node.offsetHeight >= 3;
                });
                return bool;
            };
            tests['video'] = function () {
                var elem = document.createElement('video'), bool = false;
                try {
                    if (bool = !!elem.canPlayType) {
                        bool = new Boolean(bool);
                        bool.ogg = elem.canPlayType('video/ogg; codecs="theora"').replace(/^no$/, '');
                        bool.h264 = elem.canPlayType('video/mp4; codecs="avc1.42E01E"').replace(/^no$/, '');
                        bool.webm = elem.canPlayType('video/webm; codecs="vp8, vorbis"').replace(/^no$/, '');
                    }
                }
                catch (e) { }
                return bool;
            };
            tests['audio'] = function () {
                var elem = document.createElement('audio'), bool = false;
                try {
                    if (bool = !!elem.canPlayType) {
                        bool = new Boolean(bool);
                        bool.ogg = elem.canPlayType('audio/ogg; codecs="vorbis"').replace(/^no$/, '');
                        bool.mp3 = elem.canPlayType('audio/mpeg;').replace(/^no$/, '');
                        bool.wav = elem.canPlayType('audio/wav; codecs="1"').replace(/^no$/, '');
                        bool.m4a = (elem.canPlayType('audio/x-m4a;') ||
                            elem.canPlayType('audio/aac;')).replace(/^no$/, '');
                    }
                }
                catch (e) { }
                return bool;
            };
            tests['localstorage'] = function () {
                try {
                    localStorage.setItem(mod, mod);
                    localStorage.removeItem(mod);
                    return true;
                }
                catch (e) {
                    return false;
                }
            };
            tests['sessionstorage'] = function () {
                try {
                    sessionStorage.setItem(mod, mod);
                    sessionStorage.removeItem(mod);
                    return true;
                }
                catch (e) {
                    return false;
                }
            };
            tests['webworkers'] = function () {
                return !!_window.Worker;
            };
            tests['applicationcache'] = function () {
                return !!_window.applicationCache;
            };
            tests['svg'] = function () {
                return !!document.createElementNS && !!_document.createElementNS(ns.svg, 'svg').createSVGRect;
            };
            tests['inlinesvg'] = function () {
                var div = document.createElement('div');
                div.innerHTML = '<svg/>';
                return (div.firstChild && div.firstChild.namespaceURI) == ns.svg;
            };
            tests['smil'] = function () {
                return !!document.createElementNS && /SVGAnimate/.test(toString.call(document.createElementNS(ns.svg, 'animate')));
            };
            tests['svgclippaths'] = function () {
                return !!document.createElementNS && /SVGClipPath/.test(toString.call(document.createElementNS(ns.svg, 'clipPath')));
            };
            function webforms() {
                Modernizr['input'] = (function (props) {
                    for (var i = 0, len = props.length; i < len; i++) {
                        attrs[props[i]] = !!(props[i] in inputElem);
                    }
                    if (attrs.list) {
                        attrs.list = !!(document.createElement('datalist') && _window.HTMLDataListElement);
                    }
                    return attrs;
                })('autocomplete autofocus list placeholder max min multiple pattern required step'.split(' '));
                Modernizr['inputtypes'] = (function (props) {
                    for (var i = 0, bool, inputElemType, defaultView, len = props.length; i < len; i++) {
                        inputElem.value = null;
                        inputElem.setAttribute('type', inputElemType = props[i]);
                        bool = inputElem.type !== 'text';
                        if (bool) {
                            inputElem.style.cssText = 'position:absolute;visibility:hidden;';
                            if (/^range$/.test(inputElemType) && inputElem.style.WebkitAppearance !== undefined) {
                                docElement.appendChild(inputElem);
                                defaultView = document.defaultView;
                                bool = defaultView.getComputedStyle &&
                                    defaultView.getComputedStyle(inputElem, null).WebkitAppearance !== 'textfield' &&
                                    (inputElem.offsetHeight !== 0);
                                docElement.removeChild(inputElem);
                            }
                            else if (/^(search|tel)$/.test(inputElemType)) { }
                            else if (/^(url|email)$/.test(inputElemType)) {
                                bool = inputElem.checkValidity && inputElem.checkValidity() === false;
                            }
                            else {
                                if ('date' !== inputElemType) {
                                    inputElem.value = smile;
                                    bool = inputElem.value != smile;
                                }
                            }
                        }
                        inputs[props[i]] = !!bool;
                    }
                    return inputs;
                })('search tel url email datetime date month week time datetime-local number range color'.split(' '));
            }
            for (var feature in tests) {
                if (hasOwnProp(tests, feature)) {
                    featureName = feature.toLowerCase();
                    Modernizr[featureName] = tests[feature]();
                    classes.push((Modernizr[featureName] ? '' : 'no-') + featureName);
                }
            }
            Modernizr.input || webforms();
            Modernizr.addTest = function (feature, test) {
                if (typeof feature == 'object') {
                    for (var key in feature) {
                        if (hasOwnProp(feature, key)) {
                            Modernizr.addTest(key, feature[key]);
                        }
                    }
                }
                else {
                    feature = feature.toLowerCase();
                    if (Modernizr[feature] !== undefined) {
                        return Modernizr;
                    }
                    test = typeof test == 'function' ? test() : test;
                    if (typeof enableClasses !== "undefined" && enableClasses) {
                        docElement.className += " mdrn-" + (test ? '' : 'no-') + feature;
                    }
                    Modernizr[feature] = test;
                }
                return Modernizr;
            };
            setCss('');
            modElem = inputElem = null;
            ;
            (function (window, document) {
                var options = window.html5 || {};
                var reSkip = /^<|^(?:button|map|select|textarea|object|iframe|option|optgroup)$/i;
                var saveClones = /^(?:a|b|code|div|fieldset|h1|h2|h3|h4|h5|h6|i|label|li|ol|p|q|span|strong|style|table|tbody|td|th|tr|ul)$/i;
                var supportsHtml5Styles;
                var expando = '_html5shiv';
                var expanID = 0;
                var expandoData = {};
                var supportsUnknownElements;
                (function () {
                    try {
                        var a = document.createElement('a');
                        a.innerHTML = '<xyz></xyz>';
                        supportsHtml5Styles = ('hidden' in a);
                        supportsUnknownElements = a.childNodes.length == 1 || (function () {
                            (document.createElement)('a');
                            var frag = document.createDocumentFragment();
                            return (typeof frag.cloneNode == 'undefined' ||
                                typeof frag.createDocumentFragment == 'undefined' ||
                                typeof frag.createElement == 'undefined');
                        }());
                    }
                    catch (e) {
                        supportsHtml5Styles = true;
                        supportsUnknownElements = true;
                    }
                }());
                function addStyleSheet(ownerDocument, cssText) {
                    var p = ownerDocument.createElement('p'), parent = ownerDocument.getElementsByTagName('head')[0] || ownerDocument.documentElement;
                    p.innerHTML = 'x<style>' + cssText + '</style>';
                    return parent.insertBefore(p.lastChild, parent.firstChild);
                }
                function getElements() {
                    var elements = html5.elements;
                    return typeof elements == 'string' ? elements.split(' ') : elements;
                }
                function getExpandoData(ownerDocument) {
                    var data = expandoData[ownerDocument[expando]];
                    if (!data) {
                        data = {};
                        expanID++;
                        ownerDocument[expando] = expanID;
                        expandoData[expanID] = data;
                    }
                    return data;
                }
                function createElement(nodeName, ownerDocument, data) {
                    if (!ownerDocument) {
                        ownerDocument = document;
                    }
                    if (supportsUnknownElements) {
                        return ownerDocument.createElement(nodeName);
                    }
                    if (!data) {
                        data = getExpandoData(ownerDocument);
                    }
                    var node;
                    if (data.cache[nodeName]) {
                        node = data.cache[nodeName].cloneNode();
                    }
                    else if (saveClones.test(nodeName)) {
                        node = (data.cache[nodeName] = data.createElem(nodeName)).cloneNode();
                    }
                    else {
                        node = data.createElem(nodeName);
                    }
                    return node.canHaveChildren && !reSkip.test(nodeName) ? data.frag.appendChild(node) : node;
                }
                function createDocumentFragment(ownerDocument, data) {
                    if (!ownerDocument) {
                        ownerDocument = document;
                    }
                    if (supportsUnknownElements) {
                        return ownerDocument.createDocumentFragment();
                    }
                    data = data || getExpandoData(ownerDocument);
                    var clone = data.frag.cloneNode(), i = 0, elems = getElements(), l = elems.length;
                    for (; i < l; i++) {
                        clone.createElement(elems[i]);
                    }
                    return clone;
                }
                function shivMethods(ownerDocument, data) {
                    if (!data.cache) {
                        data.cache = {};
                        data.createElem = ownerDocument.createElement;
                        data.createFrag = ownerDocument.createDocumentFragment;
                        data.frag = data.createFrag();
                    }
                    ownerDocument.createElement = function (nodeName) {
                        if (!html5.shivMethods) {
                            return data.createElem(nodeName);
                        }
                        return createElement(nodeName, ownerDocument, data);
                    };
                    ownerDocument.createDocumentFragment = Function('h,f', 'return function(){' +
                        'var n=f.cloneNode(),c=n.createElement;' +
                        'h.shivMethods&&(' +
                        getElements().join().replace(/\w+/g, function (nodeName) {
                            data.createElem(nodeName);
                            data.frag.createElement(nodeName);
                            return 'c("' + nodeName + '")';
                        }) +
                        ');return n}')(html5, data.frag);
                }
                function shivDocument(ownerDocument) {
                    if (!ownerDocument) {
                        ownerDocument = document;
                    }
                    var data = getExpandoData(ownerDocument);
                    if (html5.shivCSS && !supportsHtml5Styles && !data.hasCSS) {
                        data.hasCSS = !!addStyleSheet(ownerDocument, 'article,aside,figcaption,figure,footer,header,hgroup,nav,section{display:block}' +
                            'mark{background:#FF0;color:#000}');
                    }
                    if (!supportsUnknownElements) {
                        shivMethods(ownerDocument, data);
                    }
                    return ownerDocument;
                }
                var html5 = {
                    'elements': options.elements || 'abbr article aside audio bdi canvas data datalist details figcaption figure footer header hgroup mark meter nav output progress section summary time video',
                    'shivCSS': (options.shivCSS !== false),
                    'supportsUnknownElements': supportsUnknownElements,
                    'shivMethods': (options.shivMethods !== false),
                    'type': 'default',
                    'shivDocument': shivDocument,
                    createElement: createElement,
                    createDocumentFragment: createDocumentFragment
                };
                window.html5 = html5;
                shivDocument(document);
            }(this, document));
            Modernizr._version = version;
            Modernizr._prefixes = prefixes;
            Modernizr._domPrefixes = domPrefixes;
            Modernizr._cssomPrefixes = cssomPrefixes;
            Modernizr.mq = testMediaQuery;
            Modernizr.hasEvent = isEventSupported;
            Modernizr.testProp = function (prop) {
                return testProps([prop]);
            };
            Modernizr.testAllProps = testPropsAll;
            Modernizr.testStyles = injectElementWithStyles;
            Modernizr.prefixed = function (prop, obj, elem) {
                if (!obj) {
                    return testPropsAll(prop, 'pfx');
                }
                else {
                    return testPropsAll(prop, obj, elem);
                }
            };
            docElement.className = docElement.className.replace(/(^|\s)no-js(\s|$)/, '$1$2') +
                (enableClasses ? " mdrn-js mdrn-" + classes.join(" mdrn-") : '');
            return Modernizr;
        }).call(_window, _window, _window.document);
        if (typeof (process) !== 'undefined') {
            return Modernizr;
        }
        (function (a, b, c) {
            function d(a) {
                return "[object Function]" == o.call(a);
            }
            function e(a) {
                return "string" == typeof a;
            }
            function f() { }
            function g(a) {
                return !a || "loaded" == a || "complete" == a || "uninitialized" == a;
            }
            function h() {
                var a = p.shift();
                q = 1, a ? a.t ? m(function () {
                    ("c" == a.t ? B.injectCss : B.injectJs)(a.s, 0, a.a, a.x, a.e, 1);
                }, 0) : (a(), h()) : q = 0;
            }
            function i(a, c, d, e, f, i, j) {
                function k(b) {
                    if (!o && g(l.readyState) && (u.r = o = 1, !q && h(), l.onload = l.onreadystatechange = null, b)) {
                        "img" != a && m(function () {
                            t.removeChild(l);
                        }, 50);
                        for (var d in y[c])
                            y[c].hasOwnProperty(d) && y[c][d].onload();
                    }
                }
                var j = j || B.errorTimeout, l = b.createElement(a), o = 0, r = 0, u = {
                    t: d,
                    s: c,
                    e: f,
                    a: i,
                    x: j
                };
                1 === y[c] && (r = 1, y[c] = []), "object" == a ? l.data = c : (l.src = c, l.type = a), l.width = l.height = "0", l.onerror = l.onload = l.onreadystatechange = function () {
                    k.call(this, r);
                }, p.splice(e, 0, u), "img" != a && (r || 2 === y[c] ? (t.insertBefore(l, s ? null : n), m(k, j)) : y[c].push(l));
            }
            function j(a, b, c, d, f) {
                return q = 0, b = b || "j", e(a) ? i("c" == b ? v : u, a, b, this.i++, c, d, f) : (p.splice(this.i++, 0, a), 1 == p.length && h()), this;
            }
            function k() {
                var a = B;
                return a.loader = {
                    load: j,
                    i: 0
                }, a;
            }
            var l = b.documentElement, m = a.setTimeout, n = b.getElementsByTagName("script")[0], o = {}.toString, p = [], q = 0, r = "MozAppearance" in l.style, s = r && !!b.createRange().compareNode, t = s ? l : n.parentNode, l2 = a.opera && "[object Opera]" == o.call(a.opera), l3 = !!b.attachEvent && !l2, u = r ? "object" : l ? "script" : "img", v = l3 ? "script" : u, w = Array.isArray || function (a) {
                return "[object Array]" == o.call(a);
            }, x = [], y = {}, z = {
                timeout: function (a, b) {
                    return b.length && (a.timeout = b[0]), a;
                }
            }, A, B;
            B = function (a) {
                function b(a) {
                    var a = a.split("!"), b = x.length, c = a.pop(), d = a.length, c = {
                        url: c,
                        origUrl: c,
                        prefixes: a
                    }, e, f, g;
                    for (f = 0; f < d; f++)
                        g = a[f].split("="), (e = z[g.shift()]) && (c = e(c, g));
                    for (f = 0; f < b; f++)
                        c = x[f](c);
                    return c;
                }
                function g(a, e, f, g, h) {
                    var i = b(a), j = i.autoCallback;
                    i.url.split(".").pop().split("?").shift(), i.bypass || (e && (e = d(e) ? e : e[a] || e[g] || e[a.split("/").pop().split("?")[0]]), i.instead ? i.instead(a, e, f, g, h) : (y[i.url] ? i.noexec = !0 : y[i.url] = 1, f.load(i.url, i.forceCSS || !i.forceJS && "css" == i.url.split(".").pop().split("?").shift() ? "c" : c, i.noexec, i.attrs, i.timeout), (d(e) || d(j)) && f.load(function () {
                        k(), e && e(i.origUrl, h, g), j && j(i.origUrl, h, g), y[i.url] = 2;
                    })));
                }
                function h(a, b) {
                    function c(a, c) {
                        if (a) {
                            if (e(a))
                                c || (j = function () {
                                    var a = [].slice.call(arguments);
                                    k.apply(this, a), l();
                                }), g(a, j, b, 0, h);
                            else if (Object(a) === a)
                                for (n in m = function () {
                                    var b = 0, c;
                                    for (c in a)
                                        a.hasOwnProperty(c) && b++;
                                    return b;
                                }(), a)
                                    a.hasOwnProperty(n) && (!c && !--m && (d(j) ? j = function () {
                                        var a = [].slice.call(arguments);
                                        k.apply(this, a), l();
                                    } : j[n] = function (a) {
                                        return function () {
                                            var b = [].slice.call(arguments);
                                            a && a.apply(this, b), l();
                                        };
                                    }(k[n])), g(a[n], j, b, n, h));
                        }
                        else
                            !c && l();
                    }
                    var h = !!a.test, i = a.load || a.both, j = a.callback || f, k = j, l = a.complete || f, m, n;
                    c(h ? a.yep : a.nope, !!i), i && c(i);
                }
                var i, j, l = this.yepnope.loader;
                if (e(a))
                    g(a, 0, l, 0);
                else if (w(a))
                    for (i = 0; i < a.length; i++)
                        j = a[i], e(j) ? g(j, 0, l, 0) : w(j) ? B(j) : Object(j) === j && h(j, l);
                else
                    Object(a) === a && h(a, l);
            }, B.addPrefix = function (a, b) {
                z[a] = b;
            }, B.addFilter = function (a) {
                x.push(a);
            }, B.errorTimeout = 1e4, null == b.readyState && b.addEventListener && (b.readyState = "loading", b.addEventListener("DOMContentLoaded", A = function () {
                b.removeEventListener("DOMContentLoaded", A, 0), b.readyState = "complete";
            }, 0)), a.yepnope = k(), a.yepnope.executeStack = h, a.yepnope.injectJs = function (a, c, d, e, i, j) {
                var k = b.createElement("script"), l, o, e = e || B.errorTimeout;
                k.src = a;
                for (o in d)
                    k.setAttribute(o, d[o]);
                c = j ? h : c || f, k.onreadystatechange = k.onload = function () {
                    !l && g(k.readyState) && (l = 1, c(), k.onload = k.onreadystatechange = null);
                }, m(function () {
                    l || (l = 1, c(1));
                }, e), i ? k.onload() : n.parentNode.insertBefore(k, n);
            }, a.yepnope.injectCss = function (a, c, d, e, g, i) {
                var e = b.createElement("link"), j, c = i ? h : c || f;
                e.href = a, e.rel = "stylesheet", e.type = "text/css";
                for (j in d)
                    e.setAttribute(j, d[j]);
                g || (n.parentNode.insertBefore(e, n), m(c, 0));
            };
        })(_window, document);
        Modernizr.load = function () {
            _window.yepnope.apply(window, [].slice.call(arguments, 0));
        };
        Modernizr.addTest('adownload', 'download' in document.createElement('a'));
        Modernizr.addTest('audiodata', !!(_window.Audio));
        Modernizr.addTest('webaudio', !!(_window.AudioContext || _window.webkitAudioContext));
        Modernizr.addTest('battery', !!Modernizr.prefixed('battery', navigator));
        Modernizr.addTest('lowbattery', function () {
            var minLevel = 0.20, battery = Modernizr.prefixed('battery', navigator);
            return !!(battery && !battery.charging && battery.level <= minLevel);
        });
        Modernizr.addTest('blobconstructor', function () {
            try {
                return !!new Blob();
            }
            catch (e) {
                return false;
            }
        });
        (function () {
            if (!Modernizr('canvas')) {
                return false;
            }
            var image = new Image(), canvas = document.createElement('canvas'), ctx = canvas.getContext('2d');
            image.onload = function () {
                ctx.drawImage(image, 0, 0);
                Modernizr.addTest('todataurljpeg', function () {
                    return canvas.toDataURL('image/jpeg').indexOf('data:image/jpeg') === 0;
                });
                Modernizr.addTest('todataurlwebp', function () {
                    return canvas.toDataURL('image/webp').indexOf('data:image/webp') === 0;
                });
            };
            image.src = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAACklEQVR4nGMAAQAABQABDQottAAAAABJRU5ErkJggg==';
        }());
        Modernizr.addTest('contenteditable', 'contentEditable' in document.documentElement);
        Modernizr.addTest('contentsecuritypolicy', 'SecurityPolicy' in document);
        Modernizr.addTest('contextmenu', ('contextMenu' in document.documentElement && 'HTMLMenuItemElement' in window));
        Modernizr.addTest('cookies', function () {
            if (navigator.cookieEnabled)
                return true;
            document.cookie = "cookietest=1";
            var ret = document.cookie.indexOf("cookietest=") != -1;
            document.cookie = "cookietest=1; expires=Thu, 01-Jan-1970 00:00:01 GMT";
            return ret;
        });
        Modernizr.addTest('cors', !!(_window.XMLHttpRequest && 'withCredentials' in new XMLHttpRequest()));
        (function () {
            var elem = document.createElement('a'), eStyle = elem.style, val = "right 10px bottom 10px";
            Modernizr.addTest('bgpositionshorthand', function () {
                eStyle.cssText = "background-position: " + val + ";";
                return (eStyle.backgroundPosition === val);
            });
        }());
        (function () {
            function getBgRepeatValue(elem) {
                return (window.getComputedStyle ?
                    getComputedStyle(elem, null).getPropertyValue('background') :
                    elem.currentStyle['background']);
            }
            Modernizr.testStyles(' #modernizr { background-repeat: round; } ', function (elem, rule) {
                Modernizr.addTest('bgrepeatround', getBgRepeatValue(elem) == 'round');
            });
            Modernizr.testStyles(' #modernizr { background-repeat: space; } ', function (elem, rule) {
                Modernizr.addTest('bgrepeatspace', getBgRepeatValue(elem) == 'space');
            });
        })();
        Modernizr.testStyles('#modernizr{background-size:cover}', function (elem) {
            var style = window.getComputedStyle ?
                window.getComputedStyle(elem, null) : elem.currentStyle;
            Modernizr.addTest('bgsizecover', style.backgroundSize == 'cover');
        });
        Modernizr.addTest("boxsizing", function () {
            return Modernizr.testAllProps("boxSizing") && (_document.documentMode === undefined || _document.documentMode > 7);
        });
        Modernizr.addTest('csscalc', function () {
            var prop = 'width:';
            var value = 'calc(10px);';
            var el = document.createElement('div');
            el.style.cssText = prop + Modernizr._prefixes.join(value + prop);
            return !!el.style.length;
        });
        Modernizr.addTest('cubicbezierrange', function () {
            var el = document.createElement('div');
            el.style.cssText = Modernizr._prefixes.join('transition-timing-function' + ':cubic-bezier(1,0,0,1.1); ');
            return !!el.style.length;
        });
        Modernizr.addTest('bgpositionxy', function () {
            return Modernizr.testStyles('#modernizr {background-position: 3px 5px;}', function (elem) {
                var cssStyleDeclaration = window.getComputedStyle ? getComputedStyle(elem, null) : elem.currentStyle;
                var xSupport = (cssStyleDeclaration.backgroundPositionX == '3px') || (cssStyleDeclaration['background-position-x'] == '3px');
                var ySupport = (cssStyleDeclaration.backgroundPositionY == '5px') || (cssStyleDeclaration['background-position-y'] == '5px');
                return xSupport && ySupport;
            });
        });
        Modernizr.testStyles(' #modernizr { display: run-in; } ', function (elem, rule) {
            var ret = (window.getComputedStyle ?
                getComputedStyle(elem, null).getPropertyValue('display') :
                elem.currentStyle['display']);
            Modernizr.addTest('display-runin', ret == 'run-in');
        });
        Modernizr.addTest("display-table", function () {
            var doc = window.document, docElem = doc.documentElement, parent = doc.createElement("div"), child = doc.createElement("div"), childb = doc.createElement("div"), ret;
            parent.style.cssText = "display: table";
            child.style.cssText = childb.style.cssText = "display: table-cell; padding: 10px";
            parent.appendChild(child);
            parent.appendChild(childb);
            docElem.insertBefore(parent, docElem.firstChild);
            ret = child.offsetLeft < childb.offsetLeft;
            docElem.removeChild(parent);
            return ret;
        });
        Modernizr.addTest('cssfilters', function () {
            var el = document.createElement('div');
            el.style.cssText = Modernizr._prefixes.join('filter' + ':blur(2px); ');
            return !!el.style.length && ((_document.documentMode === undefined || _document.documentMode > 9));
        });
        (function () {
            if (!document.body) {
                window.console && console.warn('document.body doesn\'t exist. Modernizr hyphens test needs it.');
                return;
            }
            function test_hyphens_css() {
                try {
                    var div = document.createElement('div'), span = document.createElement('span'), divStyle = div.style, spanHeight = 0, spanWidth = 0, result = false, firstChild = document.body.firstElementChild || document.body.firstChild;
                    div.appendChild(span);
                    span.innerHTML = 'Bacon ipsum dolor sit amet jerky velit in culpa hamburger et. Laborum dolor proident, enim dolore duis commodo et strip steak. Salami anim et, veniam consectetur dolore qui tenderloin jowl velit sirloin. Et ad culpa, fatback cillum jowl ball tip ham hock nulla short ribs pariatur aute. Pig pancetta ham bresaola, ut boudin nostrud commodo flank esse cow tongue culpa. Pork belly bresaola enim pig, ea consectetur nisi. Fugiat officia turkey, ea cow jowl pariatur ullamco proident do laborum velit sausage. Magna biltong sint tri-tip commodo sed bacon, esse proident aliquip. Ullamco ham sint fugiat, velit in enim sed mollit nulla cow ut adipisicing nostrud consectetur. Proident dolore beef ribs, laborum nostrud meatball ea laboris rump cupidatat labore culpa. Shankle minim beef, velit sint cupidatat fugiat tenderloin pig et ball tip. Ut cow fatback salami, bacon ball tip et in shank strip steak bresaola. In ut pork belly sed mollit tri-tip magna culpa veniam, short ribs qui in andouille ham consequat. Dolore bacon t-bone, velit short ribs enim strip steak nulla. Voluptate labore ut, biltong swine irure jerky. Cupidatat excepteur aliquip salami dolore. Ball tip strip steak in pork dolor. Ad in esse biltong. Dolore tenderloin exercitation ad pork loin t-bone, dolore in chicken ball tip qui pig. Ut culpa tongue, sint ribeye dolore ex shank voluptate hamburger. Jowl et tempor, boudin pork chop labore ham hock drumstick consectetur tri-tip elit swine meatball chicken ground round. Proident shankle mollit dolore. Shoulder ut duis t-bone quis reprehenderit. Meatloaf dolore minim strip steak, laboris ea aute bacon beef ribs elit shank in veniam drumstick qui. Ex laboris meatball cow tongue pork belly. Ea ball tip reprehenderit pig, sed fatback boudin dolore flank aliquip laboris eu quis. Beef ribs duis beef, cow corned beef adipisicing commodo nisi deserunt exercitation. Cillum dolor t-bone spare ribs, ham hock est sirloin. Brisket irure meatloaf in, boudin pork belly sirloin ball tip. Sirloin sint irure nisi nostrud aliqua. Nostrud nulla aute, enim officia culpa ham hock. Aliqua reprehenderit dolore sunt nostrud sausage, ea boudin pork loin ut t-bone ham tempor. Tri-tip et pancetta drumstick laborum. Ham hock magna do nostrud in proident. Ex ground round fatback, venison non ribeye in.';
                    document.body.insertBefore(div, firstChild);
                    divStyle.cssText = 'position:absolute;top:0;left:0;width:5em;text-align:justify;text-justification:newspaper;';
                    spanHeight = span.offsetHeight;
                    spanWidth = span.offsetWidth;
                    divStyle.cssText = 'position:absolute;top:0;left:0;width:5em;text-align:justify;' +
                        'text-justification:newspaper;' +
                        Modernizr._prefixes.join('hyphens:auto; ');
                    result = (span.offsetHeight != spanHeight || span.offsetWidth != spanWidth);
                    document.body.removeChild(div);
                    div.removeChild(span);
                    return result;
                }
                catch (e) {
                    return false;
                }
            }
            function test_hyphens(delimiter, testWidth) {
                try {
                    var div = document.createElement('div'), span = document.createElement('span'), divStyle = div.style, spanSize = 0, result = false, result1 = false, result2 = false, firstChild = document.body.firstElementChild || document.body.firstChild;
                    divStyle.cssText = 'position:absolute;top:0;left:0;overflow:visible;width:1.25em;';
                    div.appendChild(span);
                    document.body.insertBefore(div, firstChild);
                    span.innerHTML = 'mm';
                    spanSize = span.offsetHeight;
                    span.innerHTML = 'm' + delimiter + 'm';
                    result1 = (span.offsetHeight > spanSize);
                    if (testWidth) {
                        span.innerHTML = 'm<br />m';
                        spanSize = span.offsetWidth;
                        span.innerHTML = 'm' + delimiter + 'm';
                        result2 = (span.offsetWidth > spanSize);
                    }
                    else {
                        result2 = true;
                    }
                    if (result1 === true && result2 === true) {
                        result = true;
                    }
                    document.body.removeChild(div);
                    div.removeChild(span);
                    return result;
                }
                catch (e) {
                    return false;
                }
            }
            function test_hyphens_find(delimiter) {
                try {
                    var dummy = document.createElement('input'), div = document.createElement('div'), testword = 'lebowski', result = false, textrange, firstChild = document.body.firstElementChild || document.body.firstChild;
                    div.innerHTML = testword + delimiter + testword;
                    document.body.insertBefore(div, firstChild);
                    document.body.insertBefore(dummy, div);
                    if (dummy.setSelectionRange) {
                        dummy.focus();
                        dummy.setSelectionRange(0, 0);
                    }
                    else if (dummy.createTextRange) {
                        textrange = dummy.createTextRange();
                        textrange.collapse(true);
                        textrange.moveEnd('character', 0);
                        textrange.moveStart('character', 0);
                        textrange.select();
                    }
                    if (_window.find) {
                        result = _window.find(testword + testword);
                    }
                    else {
                        try {
                            textrange = _window.self.document.body.createTextRange();
                            result = textrange.findText(testword + testword);
                        }
                        catch (e) {
                            result = false;
                        }
                    }
                    document.body.removeChild(div);
                    document.body.removeChild(dummy);
                    return result;
                }
                catch (e) {
                    return false;
                }
            }
            Modernizr.addTest("csshyphens", function () {
                if (!Modernizr.testAllProps('hyphens'))
                    return false;
                try {
                    return test_hyphens_css();
                }
                catch (e) {
                    return false;
                }
            });
            Modernizr.addTest("softhyphens", function () {
                try {
                    return test_hyphens('&#173;', true) && test_hyphens('&#8203;', false);
                }
                catch (e) {
                    return false;
                }
            });
            Modernizr.addTest("softhyphensfind", function () {
                try {
                    return test_hyphens_find('&#173;') && test_hyphens_find('&#8203;');
                }
                catch (e) {
                    return false;
                }
            });
        })();
        Modernizr.addTest('lastchild', function () {
            return Modernizr.testStyles("#modernizr div {width:100px} #modernizr :last-child{width:200px;display:block}", function (elem) {
                return elem.lastChild.offsetWidth > elem.firstChild.offsetWidth;
            }, 2);
        });
        Modernizr.addTest('cssmask', Modernizr.testAllProps('mask-repeat'));
        Modernizr.addTest('mediaqueries', Modernizr.mq('only all'));
        Modernizr.addTest('object-fit', !!Modernizr.prefixed('objectFit'));
        Modernizr.addTest("overflowscrolling", function () {
            return Modernizr.testAllProps("overflowScrolling");
        });
        Modernizr.addTest('pointerevents', function () {
            var element = document.createElement('x'), documentElement = document.documentElement, getComputedStyle = window.getComputedStyle, supports;
            if (!('pointerEvents' in element.style)) {
                return false;
            }
            element.style.pointerEvents = 'auto';
            element.style.pointerEvents = 'x';
            documentElement.appendChild(element);
            supports = getComputedStyle &&
                getComputedStyle(element, '').pointerEvents === 'auto';
            documentElement.removeChild(element);
            return !!supports;
        });
        Modernizr.addTest('csspositionsticky', function () {
            var prop = 'position:';
            var value = 'sticky';
            var el = document.createElement('modernizr');
            var mStyle = el.style;
            mStyle.cssText = prop + Modernizr._prefixes.join(value + ';' + prop).slice(0, -prop.length);
            return mStyle.position.indexOf(value) !== -1;
        });
        Modernizr.addTest('cssremunit', function () {
            var div = document.createElement('div');
            try {
                div.style.fontSize = '3rem';
            }
            catch (er) { }
            return (/rem/).test(div.style.fontSize);
        });
        Modernizr.addTest('regions', function () {
            var flowFromProperty = Modernizr.prefixed("flowFrom"), flowIntoProperty = Modernizr.prefixed("flowInto");
            if (!flowFromProperty || !flowIntoProperty) {
                return false;
            }
            var container = document.createElement('div'), content = document.createElement('div'), region = document.createElement('div'), flowName = 'modernizr_flow_for_regions_check';
            content.innerText = 'M';
            container.style.cssText = 'top: 150px; left: 150px; padding: 0px;';
            region.style.cssText = 'width: 50px; height: 50px; padding: 42px;';
            region.style[flowFromProperty] = flowName;
            container.appendChild(content);
            container.appendChild(region);
            document.documentElement.appendChild(container);
            var flowedRect, delta, plainRect = content.getBoundingClientRect();
            content.style[flowIntoProperty] = flowName;
            flowedRect = content.getBoundingClientRect();
            delta = flowedRect.left - plainRect.left;
            document.documentElement.removeChild(container);
            content = region = container = undefined;
            return (delta == 42);
        });
        Modernizr.addTest('cssresize', Modernizr.testAllProps('resize'));
        Modernizr.addTest('cssscrollbar', function () {
            var bool, styles = "#modernizr{overflow: scroll; width: 40px }#" +
                Modernizr._prefixes
                    .join("scrollbar{width:0px}" + ' #modernizr::')
                    .split('#')
                    .slice(1)
                    .join('#') + "scrollbar{width:0px}";
            Modernizr.testStyles(styles, function (node) {
                bool = 'scrollWidth' in node && node.scrollWidth == 40;
            });
            return bool;
        });
        Modernizr.addTest('subpixelfont', function () {
            var bool, styles = "#modernizr{position: absolute; top: -10em; visibility:hidden; font: normal 10px arial;}#subpixel{float: left; font-size: 33.3333%;}";
            Modernizr.testStyles(styles, function (elem) {
                var subpixel = elem.firstChild;
                subpixel.innerHTML = 'This is a text written in Arial';
                bool = window.getComputedStyle ?
                    window.getComputedStyle(subpixel, null).getPropertyValue("width") !== '44px' : false;
            }, 1, ['subpixel']);
            return bool;
        });
        Modernizr.addTest("supports", "CSSSupportsRule" in window);
        Modernizr.addTest("userselect", function () {
            return Modernizr.testAllProps("user-select");
        });
        Modernizr.addTest('cssvhunit', function () {
            var bool;
            Modernizr.testStyles("#modernizr { height: 50vh; }", function (elem, rule) {
                var height = _window.parseInt(_window.innerHeight / 2, 10), compStyle = parseInt((window.getComputedStyle ?
                    getComputedStyle(elem, null) :
                    elem.currentStyle)["height"], 10);
                bool = (compStyle == height);
            });
            return bool;
        });
        Modernizr.addTest('cssvmaxunit', function () {
            var bool;
            Modernizr.testStyles("#modernizr { width: 50vmax; }", function (elem, rule) {
                var one_vw = window.innerWidth / 100, one_vh = window.innerHeight / 100, compWidth = parseInt((window.getComputedStyle ?
                    getComputedStyle(elem, null) :
                    elem.currentStyle)['width'], 10);
                bool = (_window.parseInt(_window.Math.max(one_vw, one_vh) * 50, 10) == compWidth);
            });
            return bool;
        });
        Modernizr.addTest('cssvminunit', function () {
            var bool;
            Modernizr.testStyles("#modernizr { width: 50vmin; }", function (elem, rule) {
                var one_vw = window.innerWidth / 100, one_vh = window.innerHeight / 100, compWidth = parseInt((window.getComputedStyle ?
                    getComputedStyle(elem, null) :
                    elem.currentStyle)['width'], 10);
                bool = (_window.parseInt(_window.Math.min(one_vw, one_vh) * 50, 10) == compWidth);
            });
            return bool;
        });
        Modernizr.addTest('cssvwunit', function () {
            var bool;
            Modernizr.testStyles("#modernizr { width: 50vw; }", function (elem, rule) {
                var width = _window.parseInt(_window.innerWidth / 2, 10), compStyle = parseInt((window.getComputedStyle ?
                    getComputedStyle(elem, null) :
                    elem.currentStyle)["width"], 10);
                bool = (compStyle == width);
            });
            return bool;
        });
        Modernizr.addTest('customprotocolhandler', function () {
            var _navigator = window.navigator;
            return !!_navigator.registerProtocolHandler;
        });
        Modernizr.addTest('dataview', (typeof DataView !== 'undefined' && 'getFloat64' in DataView.prototype));
        Modernizr.addTest('classlist', 'classList' in document.documentElement);
        Modernizr.addTest('createelement-attrs', function () {
            try {
                return document.createElement("<input name='test' />").getAttribute('name') == 'test';
            }
            catch (e) {
                return false;
            }
        });
        Modernizr.addTest('dataset', function () {
            var n = document.createElement("div");
            n.setAttribute("data-a-b", "c");
            return !!(n.dataset && n.dataset.aB === "c");
        });
        Modernizr.addTest('microdata', !!(_document['getItems']));
        Modernizr.addTest('datalistelem', Modernizr['input'].list);
        Modernizr.addTest('details', function () {
            var doc = document, el = doc.createElement('details'), fake, root, diff;
            if (!('open' in el)) {
                return false;
            }
            root = doc.body || (function () {
                var de = doc.documentElement;
                fake = true;
                return de.insertBefore(doc.createElement('body'), de.firstElementChild || de.firstChild);
            }());
            el.innerHTML = '<summary>a</summary>b';
            el.style.display = 'block';
            root.appendChild(el);
            diff = el.offsetHeight;
            el.open = true;
            diff = diff != el.offsetHeight;
            root.removeChild(el);
            fake && root.parentNode.removeChild(root);
            return diff;
        });
        Modernizr.addTest('outputelem', 'value' in document.createElement('output'));
        Modernizr.addTest("progressbar", function () {
            return document.createElement('progress').max !== undefined;
        });
        Modernizr.addTest("meter", function () {
            return _document.createElement('meter').max !== undefined;
        });
        Modernizr.addTest('ruby', function () {
            var ruby = document.createElement('ruby'), rt = document.createElement('rt'), rp = document.createElement('rp'), docElement = document.documentElement, displayStyleProperty = 'display', fontSizeStyleProperty = 'fontSize';
            ruby.appendChild(rp);
            ruby.appendChild(rt);
            docElement.appendChild(ruby);
            if (getStyle(rp, displayStyleProperty) == 'none' ||
                getStyle(ruby, displayStyleProperty) == 'ruby' && getStyle(rt, displayStyleProperty) == 'ruby-text' ||
                getStyle(rp, fontSizeStyleProperty) == '6pt' && getStyle(rt, fontSizeStyleProperty) == '6pt') {
                cleanUp();
                return true;
            }
            else {
                cleanUp();
                return false;
            }
            function getStyle(element, styleProperty) {
                var result;
                if (window.getComputedStyle) {
                    result = document.defaultView.getComputedStyle(element, null).getPropertyValue(styleProperty);
                }
                else if (element.currentStyle) {
                    result = element.currentStyle[styleProperty];
                }
                return result;
            }
            function cleanUp() {
                docElement.removeChild(ruby);
                ruby = null;
                rt = null;
                rp = null;
            }
        });
        Modernizr.addTest('time', 'valueAsDate' in document.createElement('time'));
        Modernizr.addTest({
            texttrackapi: (typeof (document.createElement('video').addTextTrack) === 'function'),
            track: ('kind' in document.createElement('track'))
        });
        Modernizr.addTest('emoji', function () {
            if (!Modernizr['canvastext'])
                return false;
            var node = document.createElement('canvas'), ctx = node.getContext('2d');
            ctx.textBaseline = 'top';
            ctx.font = '32px Arial';
            ctx.fillText('\ud83d\ude03', 0, 0);
            return ctx.getImageData(16, 16, 1, 1).data[0] !== 0;
        });
        Modernizr.addTest('strictmode', function () {
            return (function () {
                "use strict";
                return !this;
            })();
        });
        Modernizr.addTest('devicemotion', ('DeviceMotionEvent' in window));
        Modernizr.addTest('deviceorientation', ('DeviceOrientationEvent' in window));
        (function () {
            var img = new Image();
            img.onerror = function () {
                Modernizr.addTest('exif-orientation', function () {
                    return false;
                });
            };
            img.onload = function () {
                Modernizr.addTest('exif-orientation', function () {
                    return img.width !== 2;
                });
            };
            img.src = "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQEAYABgAAD/4QAiRXhpZgAASUkqAAgAAAABABIBAwABAAAABgASAAAAAAD/2wBDAAEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQH/2wBDAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQH/wAARCAABAAIDASIAAhEBAxEB/8QAHwAAAQUBAQEBAQEAAAAAAAAAAAECAwQFBgcICQoL/8QAtRAAAgEDAwIEAwUFBAQAAAF9AQIDAAQRBRIhMUEGE1FhByJxFDKBkaEII0KxwRVS0fAkM2JyggkKFhcYGRolJicoKSo0NTY3ODk6Q0RFRkdISUpTVFVWV1hZWmNkZWZnaGlqc3R1dnd4eXqDhIWGh4iJipKTlJWWl5iZmqKjpKWmp6ipqrKztLW2t7i5usLDxMXGx8jJytLT1NXW19jZ2uHi4+Tl5ufo6erx8vP09fb3+Pn6/8QAHwEAAwEBAQEBAQEBAQAAAAAAAAECAwQFBgcICQoL/8QAtREAAgECBAQDBAcFBAQAAQJ3AAECAxEEBSExBhJBUQdhcRMiMoEIFEKRobHBCSMzUvAVYnLRChYkNOEl8RcYGRomJygpKjU2Nzg5OkNERUZHSElKU1RVVldYWVpjZGVmZ2hpanN0dXZ3eHl6goOEhYaHiImKkpOUlZaXmJmaoqOkpaanqKmqsrO0tba3uLm6wsPExcbHyMnK0tPU1dbX2Nna4uPk5ebn6Onq8vP09fb3+Pn6/9oADAMBAAIRAxEAPwD+/iiiigD/2Q==";
        })();
        Modernizr.addTest('filereader', function () {
            return !!(_window.File && _window.FileList && _window.FileReader);
        });
        Modernizr.addTest('fileinput', function () {
            var elem = document.createElement('input');
            elem.type = 'file';
            return !elem.disabled;
        });
        Modernizr.addTest("formattribute", function () {
            var form = document.createElement("form"), input = document.createElement("input"), div = document.createElement("div"), id = "formtest" + (new Date().getTime()), attr, bool = false;
            form.id = id;
            if (document.createAttribute) {
                attr = document.createAttribute("form");
                if (attr.hasOwnProperty('value')) {
                    attr.value = id;
                }
                else {
                    attr.nodeValue = id;
                }
                input.setAttributeNode(attr);
                div.appendChild(form);
                div.appendChild(input);
                document.documentElement.appendChild(div);
                bool = form.elements.length === 1 && input.form == form;
                div.parentNode.removeChild(div);
            }
            return bool;
        });
        Modernizr.addTest('filesystem', !!Modernizr.prefixed('requestFileSystem', window));
        Modernizr.addTest('placeholder', function () {
            return !!('placeholder' in (Modernizr['input'] || document.createElement('input')) &&
                'placeholder' in (Modernizr['textarea'] || document.createElement('textarea')));
        });
        Modernizr.addTest('speechinput', function () {
            var elem = document.createElement('input');
            return 'speech' in elem || 'onwebkitspeechchange' in elem;
        });
        (function (document, Modernizr) {
            Modernizr.formvalidationapi = false;
            Modernizr.formvalidationmessage = false;
            Modernizr.addTest('formvalidation', function () {
                var form = document.createElement('form');
                if (!('checkValidity' in form)) {
                    return false;
                }
                var body = document.body, html = document.documentElement, bodyFaked = false, invaildFired = false, input;
                Modernizr.formvalidationapi = true;
                form.onsubmit = function (e) {
                    if (!_window.opera) {
                        e.preventDefault();
                    }
                    e.stopPropagation();
                };
                form.innerHTML = '<input name="modTest" required><button></button>';
                form.style.position = 'absolute';
                form.style.top = '-99999em';
                if (!body) {
                    bodyFaked = true;
                    body = document.createElement('body');
                    body.style.background = "";
                    html.appendChild(body);
                }
                body.appendChild(form);
                input = form.getElementsByTagName('input')[0];
                input.oninvalid = function (e) {
                    invaildFired = true;
                    e.preventDefault();
                    e.stopPropagation();
                };
                Modernizr.formvalidationmessage = !!input.validationMessage;
                form.getElementsByTagName('button')[0].click();
                body.removeChild(form);
                bodyFaked && html.removeChild(body);
                return invaildFired;
            });
        })(document, Modernizr);
        Modernizr.addTest('fullscreen', function () {
            for (var i = 0; i < Modernizr['_domPrefixes'].length; i++) {
                if (_document[Modernizr['_domPrefixes'][i].toLowerCase() + 'CancelFullScreen'])
                    return true;
            }
            return !!_document['cancelFullScreen'] || false;
        });
        Modernizr.addTest('gamepads', !!Modernizr.prefixed('getGamepads', navigator));
        Modernizr.addTest('ie8compat', function () {
            return (!window.addEventListener && _document.documentMode && _document.documentMode === 7);
        });
        Modernizr.addTest('sandbox', 'sandbox' in document.createElement('iframe'));
        Modernizr.addTest('seamless', 'seamless' in document.createElement('iframe'));
        Modernizr.addTest('getusermedia', !!Modernizr.prefixed('getUserMedia', navigator));
        Modernizr.addTest('srcdoc', 'srcdoc' in document.createElement('iframe'));
        (function () {
            if (!Modernizr['canvas'])
                return false;
            var image = new Image(), canvas = document.createElement('canvas'), ctx = canvas.getContext('2d');
            image.onload = function () {
                Modernizr.addTest('apng', function () {
                    if (typeof canvas.getContext == 'undefined') {
                        return false;
                    }
                    else {
                        ctx.drawImage(image, 0, 0);
                        return ctx.getImageData(0, 0, 1, 1).data[3] === 0;
                    }
                });
            };
            image.src = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAACGFjVEwAAAABAAAAAcMq2TYAAAANSURBVAiZY2BgYPgPAAEEAQB9ssjfAAAAGmZjVEwAAAAAAAAAAQAAAAEAAAAAAAAAAAD6A+gBAbNU+2sAAAARZmRBVAAAAAEImWNgYGBgAAAABQAB6MzFdgAAAABJRU5ErkJggg==";
        }());
        (function () {
            var image = new Image();
            image.onerror = function () {
                Modernizr.addTest('webp', false);
            };
            image.onload = function () {
                Modernizr.addTest('webp', function () {
                    return image.width == 1;
                });
            };
            image.src = 'data:image/webp;base64,UklGRiwAAABXRUJQVlA4ICAAAAAUAgCdASoBAAEAL/3+/3+CAB/AAAFzrNsAAP5QAAAAAA==';
        }());
        Modernizr.addTest('json', !!_window.JSON && !!JSON.parse);
        Modernizr.addTest('olreversed', 'reversed' in document.createElement('ol'));
        Modernizr.addTest('mathml', function () {
            var hasMathML = false;
            if (document.createElementNS) {
                var ns = "http://www.w3.org/1998/Math/MathML", div = document.createElement("div");
                div.style.position = "absolute";
                var mfrac = div.appendChild(document.createElementNS(ns, "math"))
                    .appendChild(document.createElementNS(ns, "mfrac"));
                mfrac.appendChild(document.createElementNS(ns, "mi"))
                    .appendChild(document.createTextNode("xx"));
                mfrac.appendChild(document.createElementNS(ns, "mi"))
                    .appendChild(document.createTextNode("yy"));
                try {
                    document.body.appendChild(div);
                    hasMathML = div.offsetHeight > div.offsetWidth;
                    if (div.parentNode) {
                        div.parentNode.removeChild(div);
                    }
                }
                catch (e) {
                    hasMathML = false;
                }
            }
            return hasMathML;
        });
        Modernizr.addTest('lowbandwidth', function () {
            var _navigator = window.navigator;
            var connection = _navigator.connection || {
                type: 0
            };
            return connection.type == 3 ||
                connection.type == 4 ||
                /^[23]g$/.test(connection.type);
        });
        Modernizr.addTest('eventsource', !!_window.EventSource);
        Modernizr.addTest('xhr2', 'FormData' in window);
        Modernizr.addTest('notification', !!Modernizr.prefixed('Notifications', window));
        Modernizr.addTest('pointerlock', !!Modernizr.prefixed('pointerLockElement', document));
        Modernizr.addTest('quotamanagement', function () {
            var temporaryStorage = Modernizr.prefixed('TemporaryStorage', window), persistentStorage = Modernizr.prefixed('PersistentStorage', window);
            return !!(temporaryStorage && persistentStorage);
        });
        Modernizr.addTest('raf', !!Modernizr.prefixed('requestAnimationFrame', window));
        Modernizr.addTest('scriptasync', 'async' in document.createElement('script'));
        Modernizr.addTest('scriptdefer', 'defer' in document.createElement('script'));
        Modernizr.addTest('stylescoped', 'scoped' in document.createElement('style'));
        Modernizr.addTest('svgfilters', function () {
            var result = false;
            try {
                result = typeof SVGFEColorMatrixElement !== undefined &&
                    SVGFEColorMatrixElement.SVG_FECOLORMATRIX_TYPE_SATURATE == 2;
            }
            catch (e) { }
            return result;
        });
        Modernizr.addTest('unicode', function () {
            var bool, missingGlyph = document.createElement('span'), star = document.createElement('span');
            Modernizr.testStyles('#modernizr{font-family:Arial,sans;font-size:300em;}', function (node) {
                missingGlyph.innerHTML = '&#5987';
                star.innerHTML = '&#9734';
                node.appendChild(missingGlyph);
                node.appendChild(star);
                bool = 'offsetWidth' in missingGlyph && missingGlyph.offsetWidth !== star.offsetWidth;
            });
            return bool;
        });
        (function () {
            var datauri = new Image();
            datauri.onerror = function () {
                Modernizr.addTest('datauri', function () {
                    return false;
                });
            };
            datauri.onload = function () {
                Modernizr.addTest('datauri', function () {
                    return (datauri.width == 1 && datauri.height == 1);
                });
            };
            datauri.src = "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///ywAAAAAAQABAAACAUwAOw==";
        })();
        Modernizr.addTest('userdata', function () {
            return !!_document.createElement('div').addBehavior;
        });
        Modernizr.addTest('vibrate', !!Modernizr.prefixed('vibrate', navigator));
        Modernizr.addTest('webintents', function () {
            return !!Modernizr.prefixed('startActivity', navigator);
        });
        (function () {
            if (!Modernizr['webgl'])
                return;
            var canvas, ctx, exts;
            try {
                canvas = document.createElement('canvas');
                ctx = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
                exts = ctx.getSupportedExtensions();
            }
            catch (e) {
                return;
            }
            if (ctx === undefined) {
                Modernizr['webgl'] = new Boolean(false);
            }
            else {
                Modernizr['webgl'] = new Boolean(true);
            }
            for (var i = -1, len = exts.length; ++i < len;) {
                Modernizr['webgl'][exts[i]] = true;
            }
            if (_window.TEST && _window.TEST.audvid) {
                _window.TEST.audvid.push('webgl');
            }
            canvas = undefined;
        })();
        Modernizr.addTest('framed', function () {
            return window.location != top.location;
        });
        (function () {
            try {
                var BlobBuilder = _window.MozBlobBuilder || _window.WebKitBlobBuilder || _window.MSBlobBuilder || _window.OBlobBuilder || _window.BlobBuilder, URL = window.URL || _window.MozURL || _window.webkitURL || _window.MSURL || _window.OURL;
                var data = 'Modernizr', bb = new BlobBuilder();
                bb.append('this.onmessage=function(e){postMessage(e.data)}');
                var url = URL.createObjectURL(bb.getBlob()), worker = new Worker(url);
                bb = null;
                worker.onmessage = function (e) {
                    worker.terminate();
                    URL.revokeObjectURL(url);
                    Modernizr.addTest('blobworkers', data === e.data);
                    worker = null;
                };
                worker.onerror = function () {
                    Modernizr.addTest('blobworkers', false);
                    worker = null;
                };
                setTimeout(function () {
                    Modernizr.addTest('blobworkers', false);
                }, 200);
                worker.postMessage(data);
            }
            catch (e) {
                Modernizr.addTest('blobworkers', false);
            }
        }());
        (function () {
            try {
                var data = 'Modernizr', worker = new Worker('data:text/javascript;base64,dGhpcy5vbm1lc3NhZ2U9ZnVuY3Rpb24oZSl7cG9zdE1lc3NhZ2UoZS5kYXRhKX0=');
                worker.onmessage = function (e) {
                    worker.terminate();
                    Modernizr.addTest('dataworkers', data === e.data);
                    worker = null;
                };
                worker.onerror = function () {
                    Modernizr.addTest('dataworkers', false);
                    worker = null;
                };
                setTimeout(function () {
                    Modernizr.addTest('dataworkers', false);
                }, 200);
                worker.postMessage(data);
            }
            catch (e) {
                Modernizr.addTest('dataworkers', false);
            }
        }());
        Modernizr.addTest('sharedworkers', function () {
            return !!_window.SharedWorker;
        });
        Modernizr.addTest('performance', !!Modernizr.prefixed('performance', window));
        ;
        Modernizr.add = Modernizr.addTest;
        Modernizr.addTest('ietrident', function () {
            var ua = navigator.userAgent, rv;
            var re = new RegExp('Trident/.*rv:([0-9]{1,}[\\.0-9]{0,})');
            if (re.exec(ua) != null) {
                rv = parseFloat(RegExp.$1);
                return rv;
            }
        });
        Modernizr.add('dom-addeventlistener', (!Modernizr('ietrident') || (Modernizr('ietrident') >= 10)) && !!document.addEventListener);
        Modernizr.add('touch', 'ontouchstart' in document || window.navigator.msMaxTouchPoints > 0);
        return Modernizr;
    })((typeof (window) !== 'undefined') ? window : this);
});
//# sourceMappingURL=modernizer.js.map