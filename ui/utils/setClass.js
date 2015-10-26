(function (factory) {
    if (typeof module === 'object' && typeof module.exports === 'object') {
        var v = factory(require, exports); if (v !== undefined) module.exports = v;
    }
    else if (typeof define === 'function' && define.amd) {
        define(["require", "exports", "../../modernizer"], factory);
    }
})(function (require, exports) {
    var modernizer = require('../../modernizer');
    var ietrident = modernizer.ietrident;
    function localTrim() {
        return this.replace((/^\s+|\s+$/g), '');
    }
    var doTrim = String.prototype.trim || localTrim;
    function trim(str) {
        return doTrim.call(str);
    }
    ;
    function clSetClass(node, name) {
        if (name.indexOf('!!') === 0) {
            while (node.classList[0]) {
                node.classList.remove(node.classList[0]);
            }
        }
        else {
            if (name[0] === '!') {
                name = name.substr(1);
                node.classList.remove(name);
            }
            else if (name[0] === '~') {
                name = name.substr(1);
                node.classList.toggle(name);
            }
            else {
                node.classList.add(name);
            }
        }
        return node;
    }
    var clSetClassHas = function (node, name) {
        return node.classList.contains(name);
    };
    function oldSetClass(node, clName) {
        var name = trim(clName), remove, className = ' ' + node.className + ' ', toggle, idx, strip;
        if (name.indexOf('!!') === 0) {
            node.className = '';
        }
        else {
            remove = (name.charAt(0) === '!');
            toggle = (name.charAt(0) === '~');
            if (remove || toggle) {
                name = name.substr(1);
            }
            if (toggle && (className.indexOf(' ' + name + ' ') >= 0)) {
                remove = true;
            }
            if (remove) {
                idx = className.indexOf(' ' + name + ' ');
                while (idx >= 0) {
                    className = className.substr(0, idx + 1) + className.substr(idx + 2 + name.length);
                    idx = className.indexOf(' ' + name + ' ');
                    strip = true;
                }
                if (strip) {
                    node.className = trim(className);
                }
            }
            else {
                if (className.indexOf(' ' + name + ' ') < 0) {
                    node.className += ' ' + name;
                }
            }
        }
        return node;
    }
    var oldSetClassHas = function (node, name) {
        var className = ' ' + node.className + ' ';
        return name && (className.indexOf(' ' + name + ' ') >= 0);
    };
    function unkSetClass(node, clName) {
        var hasClassList = node.classList && node.classList.length !== undefined;
        if (hasClassList) {
            doSetClass = clSetClass;
            setClass.has = clSetClassHas;
        }
        else {
            doSetClass = oldSetClass;
            setClass.has = oldSetClassHas;
        }
        return doSetClass(node, clName);
    }
    function unkHas(node, clName) {
        var hasClassList = node.classList && node.classList.length !== undefined;
        if (hasClassList) {
            setClass.has = clSetClassHas;
        }
        else {
            setClass.has = oldSetClassHas;
        }
        return setClass.has(node, clName);
    }
    var doSetClass = ietrident ? oldSetClass : unkSetClass;
    var setClass;
    setClass = (function () {
        var setClass = function (node) {
            var clist = [];
            for (var _i = 1; _i < arguments.length; _i++) {
                clist[_i - 1] = arguments[_i];
            }
            var cnt = 0, clName;
            while ((clName = clist[cnt])) {
                doSetClass(node, clName);
                cnt += 1;
            }
            return node;
        };
        setClass.has = ietrident ? oldSetClassHas : unkHas;
        setClass.temporary = function (node, delay) {
            var clist = [];
            for (var _i = 2; _i < arguments.length; _i++) {
                clist[_i - 2] = arguments[_i];
            }
            var len = clist.length, cnt;
            for (cnt = 0; cnt < len; cnt += 1) {
                setClass(node, clist[cnt]);
            }
            return setTimeout(function () {
                for (cnt = 0; cnt < len; cnt += 1) {
                    setClass(node, '!' + clist[cnt]);
                }
            }, delay);
        };
        return setClass;
    })();
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = setClass;
});
//# sourceMappingURL=setClass.js.map