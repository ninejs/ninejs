(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports", "../builder", "fs"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var builder_1 = require("../builder");
    var fs = require("fs");
    var isAmd = (typeof (define) !== 'undefined') && define.amd, isDojo = isAmd && define.amd.vendor === 'dojotoolkit.org', isNode = (typeof (window) === 'undefined');
    var thisModuleMid = 'ninejs/css', configMid = 'ninejs/config';
    function deepToString(obj, quotes) {
        quotes = quotes || '\'';
        function stripFunctionName(functionName) {
            var idx = functionName.indexOf('(');
            if (idx > 9) {
                functionName = functionName.substr(0, 9) + functionName.substr(idx);
            }
            return functionName;
        }
        function resolveArray(obj, quotes) {
            var result;
            result = '[';
            for (idx = 0; idx < obj.length; idx += 1) {
                if (idx > 0) {
                    result += ',';
                }
                result += deepToString(obj[idx], quotes);
            }
            result += ']';
            return result;
        }
        var result = 'null', o, idx;
        if (obj) {
            if (obj instanceof Array) {
                result = resolveArray(obj, quotes);
            }
            else if (typeof (obj) === 'string') {
                result = quotes + obj.toString() + quotes;
            }
            else if (typeof (obj) === 'function') {
                result = stripFunctionName(obj.toString());
            }
            else if (obj instanceof Object) {
                result = '{';
                idx = 0;
                for (o in obj) {
                    if (obj.hasOwnProperty(o)) {
                        if (idx > 0) {
                            result += ',';
                        }
                        result += o + ':' + deepToString(obj[o], quotes);
                        idx += 1;
                    }
                }
                result += '}';
            }
            else {
                result = obj.toString();
            }
        }
        return result;
    }
    function buildAppender(text, name, src, packages, baseUrl, noWrap, options) {
        options = options || { toBase64: true, sizeLimit: 30000 };
        var cssText = text;
        var functionBody = 'define([\'' + thisModuleMid + '\', \'' + configMid + '\'], function(style, config) {\n';
        var cssResult;
        builder_1.processCss(cssText, name, src, packages, baseUrl, options, function (result) {
            if (!result.children) {
                delete result.children;
            }
            cssResult = result;
        });
        function replaceQuotes(obj) {
            var cnt;
            obj.data = JSON.stringify(obj.data);
            if (obj.data) {
                if (/^\"/.test(obj.data) && /\"$/.test(obj.data)) {
                    obj.data = obj.data.substr(1, obj.data.length - 2);
                }
            }
            if (obj.children) {
                for (cnt = 0; cnt < obj.children.length; cnt += 1) {
                    replaceQuotes(obj.children[cnt]);
                }
            }
        }
        replaceQuotes(cssResult);
        var data = cssResult.data, result = [], idx;
        while (data.length > 200) {
            idx = 199;
            while (data[idx] === '\\') {
                idx += 1;
            }
            result.push(data.substr(0, idx + 1));
            data = data.substr(idx + 1);
        }
        result.push(data);
        delete cssResult.data;
        data = '\"' + result.join('\" + \n \"') + '\"';
        functionBody += 'var result = ' + deepToString(cssResult, '\"') + ';\n';
        functionBody += 'result.data = ' + data + '; \n';
        functionBody += 'if (config.default.applicationUrl) { result.path = config.default.applicationUrl + result.path; }\n';
        functionBody += '\nreturn style.style(result);\n});';
        if (noWrap) {
            return functionBody;
        }
        else {
            return new Function(functionBody);
        }
    }
    exports.buildAppender = buildAppender;
    function start(mid, referenceModule, bc) {
        mid = mid.split('!')[0];
        var textPlugin = bc.amdResources['dojo/text'], moduleInfo = bc.getSrcModuleInfo(mid, referenceModule, true), textResource = bc.resources[moduleInfo.url];
        if (!textPlugin) {
            throw new Error('text! plugin missing');
        }
        if (!textResource) {
            throw new Error('text resource (' + moduleInfo.url + ') missing');
        }
        var theMid = moduleInfo.mid;
        var module = bc.amdResources[theMid];
        if (!module) {
            var result = [textPlugin];
            if (bc.internStrings && !bc.internSkip(moduleInfo.mid, referenceModule)) {
                var req_1 = require;
                module = {
                    module: textResource,
                    pid: moduleInfo.pid,
                    mid: moduleInfo.mid,
                    deps: [],
                    getText: function () {
                        var text = this.module.getText ? this.module.getText() : this.module.text;
                        if (text === undefined) {
                            text = fs.readFileSync(this.module.src, 'utf8');
                        }
                        return text;
                    },
                    buildAppender: buildAppender,
                    internStrings: function () {
                        return [this.mid, this.buildAppender(this.getText(), moduleInfo.mid, this.module.src, req_1.rawConfig.packages, req_1.baseUrl)];
                    }
                };
                result.push(module);
            }
            bc.destModules[theMid] = module;
            return result;
        }
        else {
            return [];
        }
    }
    exports.start = start;
});
//# sourceMappingURL=dojo-amd.js.map