#!/usr/bin/env node
(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports", "optimist", "fs", "path"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var optimist = require("optimist");
    var fs = require("fs");
    var path = require("path");
    function globalRun() {
        var argv = optimist.argv;
        if (process.env['NINEJS_CWD']) {
            process.chdir(process.env['NINEJS_CWD']);
        }
        if (process.env['NINEJS_ARGS']) {
            var arr = process.env['NINEJS_ARGS'].split(' ');
            arr.forEach(function (item) {
                argv._.push(item);
            });
        }
        if (argv.cwd) {
            process.chdir(argv.cwd);
        }
        var ninejs = require('../lib/ninejs');
        if (argv.verbose) {
            ninejs.on('log', function (data) {
                console.log(data.message);
            });
        }
        if (!argv.quiet) {
            ninejs.on('print', function (data) {
                console.log(data.message);
            });
        }
        return ninejs.run(argv._);
    }
    var localCmd = path.resolve(process.cwd(), 'node_modules', 'ninejs', 'bin', 'ninejs');
    fs.exists(localCmd, function (val) {
        if (val) {
            fs.realpath(localCmd, {}, function (err, real) {
                if ((!err) && (real !== __filename)) {
                    require(real);
                }
                else {
                    globalRun();
                }
            });
        }
        else {
            globalRun();
        }
    });
});
//# sourceMappingURL=ninejs.js.map