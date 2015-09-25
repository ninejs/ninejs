(function (deps, factory) {
    if (typeof module === 'object' && typeof module.exports === 'object') {
        var v = factory(require, exports); if (v !== undefined) module.exports = v;
    }
    else if (typeof define === 'function' && define.amd) {
        define(deps, factory);
    }
})(["require", "exports", '../css'], function (require, exports) {
    var css = require('../css');
    function load() {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i - 0] = arguments[_i];
        }
        var id = args[0];
        if (!(/\!/.test(id))) {
            args[0] = id + '!enable';
        }
        return css.load.apply(this, args);
    }
    exports.load = load;
});
//# sourceMappingURL=styleEnable.js.map