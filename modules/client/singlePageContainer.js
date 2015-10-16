(function (deps, factory) {
    if (typeof module === 'object' && typeof module.exports === 'object') {
        var v = factory(require, exports); if (v !== undefined) module.exports = v;
    }
    else if (typeof define === 'function' && define.amd) {
        define(deps, factory);
    }
})(["require", "exports", '../moduleDefine', './FullScreenFrame', '../../ui/bootstrap/bootstrap'], function (require, exports) {
    var moduleDefine_1 = require('../moduleDefine');
    var FullScreenFrame_1 = require('./FullScreenFrame');
    var bootstrap_1 = require('../../ui/bootstrap/bootstrap');
    bootstrap_1.default.enable('vresponsiveViewPort');
    exports.default = moduleDefine_1.define(['ninejs', 'container'], function (provide) {
        provide('singlePageContainer', function (config, ninejs, containerModule) {
            var container = new FullScreenFrame_1.default({});
            container.show(window.document.body);
            containerModule.setContainer('singlePageContainer', container);
            return container;
        });
    });
});
//# sourceMappingURL=singlePageContainer.js.map