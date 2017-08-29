#!/usr/bin/env node
(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports", "../nineplate", "../_css/build/dojo-amd", "optimist", "fs", "path", "../core/deferredUtils"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var nineplate_1 = require("../nineplate");
    var cssBuilder = require("../_css/build/dojo-amd");
    var optimist = require("optimist");
    var fs = require("fs");
    var path = require("path");
    var deferredUtils_1 = require("../core/deferredUtils");
    var argv = optimist.argv;
    function generate(text, args) {
        var options = {};
        if ((args.mode === 'css') || (args.sourceExtension === '.css')) {
            for (var p in args) {
                options[p] = args[p];
            }
            var fn = cssBuilder.buildAppender(text, path.relative(args.baseUrl || '', args.sourcePath).split('\\').join('/'), args.sourcePath, args.cssPrefixes || {}, path.dirname(args.sourcePath), true, options);
            var promiseConstruct = deferredUtils_1.defer();
            promiseConstruct.resolve(fn);
            return promiseConstruct.promise;
        }
        else {
            try {
                var template = nineplate_1.default.buildTemplate(text);
            }
            catch (err) {
                console.error(err);
                throw err;
            }
            if (args.target === 'amd') {
                options.ignoreHtmlOptimization = true;
                options.standalone = args.standalone || false;
                return template.toAmd(false, options);
            }
            else if (args.target === 'commonjs') {
                return template.toCommonJs();
            }
            else if (args.target === 'text') {
                return template.compileText(false);
            }
        }
    }
    var realPath = path.resolve(argv._[0]);
    function getFilter() {
        if (argv.pattern) {
            var pattern = new RegExp(argv.pattern);
            return function (fname) {
                return pattern.test(fname);
            };
        }
        else {
            if (argv.css) {
                return function (fname) {
                    return (path.extname(fname) === '.css');
                };
            }
            else {
                return function (fname) {
                    return path.extname(fname) === '.html';
                };
            }
        }
    }
    var filter = getFilter();
    var watched = {}, hasErrors = 0;
    process.on('beforeExit', function () {
        if (hasErrors) {
            console.log(hasErrors + ' Errors');
            process.exit(1);
        }
        else {
            process.exit(0);
        }
    });
    (function solve(realPath) {
        fs.stat(realPath, function (err, stat) {
            if (err) {
                console.error(err);
                process.exit(1);
            }
            else {
                if (stat.isDirectory()) {
                    fs.readdir(realPath, function (err, files) {
                        if (err) {
                            console.error(err);
                            process.exit(1);
                        }
                        else {
                            files.map(function (f) { return path.resolve(realPath, f); }).forEach(solve);
                        }
                    });
                }
                else {
                    if (filter(realPath)) {
                        if (argv.watch && !watched[realPath]) {
                            watched[realPath] = true;
                            fs.watchFile(realPath, function () {
                                solve(realPath);
                            });
                        }
                        fs.readFile(realPath, { encoding: 'utf8' }, function (err, text) {
                            if (err) {
                                console.error(err);
                                hasErrors += 1;
                            }
                            else {
                                var fileExtension = path.extname(realPath);
                                generate(text, { target: argv.target || 'amd', sourcePath: realPath, sourceExtension: fileExtension, sourceName: path.basename(realPath), baseUrl: argv.baseUrl, toBase64: argv.toBase64, sizeLimit: argv.sizeLimit, mode: argv.mode }).then(function (text) {
                                    var defaultExt = (fileExtension === '.css') ? 'css.js' : '9plate.js';
                                    var extension = argv.extension || defaultExt;
                                    var newPath = path.resolve(path.dirname(realPath), path.basename(realPath, path.extname(realPath)) + '.' + extension);
                                    if (argv.v || argv.watch) {
                                        console.log('Generating ' + newPath);
                                    }
                                    fs.writeFile(newPath, text, function (err) {
                                        if (err) {
                                            console.log('ERROR');
                                            console.log(err);
                                            console.error(err);
                                            hasErrors += 1;
                                        }
                                    });
                                }, function (err) {
                                    console.error('Error generating ' + realPath);
                                    console.error(err);
                                    console.log(err.stack);
                                    hasErrors += 1;
                                });
                            }
                        });
                    }
                }
            }
        });
    })(realPath);
});
//# sourceMappingURL=nineplate.js.map