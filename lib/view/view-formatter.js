"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.formatView = void 0;
function formatView(view) {
    var outputString = '\n';
    outputString += recFormat(outputString, Object.values(view));
    return outputString;
}
exports.formatView = formatView;
function recFormat(outputString, valueArray) {
    valueArray.forEach(function (value) {
        if (typeof value === 'string') {
            outputString += "" + value;
        }
        else if (value instanceof Array) {
            outputString = recFormat(outputString, value);
        }
        else {
            outputString = recFormat(outputString, Object.values(value));
        }
    });
    return outputString;
}
