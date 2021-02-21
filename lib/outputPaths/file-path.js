"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.output = void 0;
var appendFile = require('fs/promises').appendFile;
function output(path, formattedOutput) {
    appendFile(path, formattedOutput)
        .then(function () {
        console.log("Forecast information appended to " + path + ".");
    });
}
exports.output = output;
