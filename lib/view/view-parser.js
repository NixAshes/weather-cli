"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseView = void 0;
var view_formatter_1 = require("./view-formatter");
var ArgHandler = require("../commands/argHandler");
function parseView(viewString, json) {
    return recParse(view_formatter_1.formatView(JSON.parse(viewString).view), json);
}
exports.parseView = parseView;
function recParse(workingString, json) {
    var token = findVars(workingString, 0);
    if (token) {
        var replace = parseVar(token, json);
        workingString = workingString.replace(token, replace);
        workingString = recParse(workingString, json);
    }
    return workingString;
}
function findVars(str, startpos) {
    var match = '\\$\\{([a-z|A-Z|0-9|\\._\\[\\]-])+\\}';
    var indexOf = str.substring(startpos || 0).search(match);
    var varStart = (indexOf >= 0) ? (indexOf + (startpos || 0)) : indexOf;
    var varEnd = str.indexOf('}', varStart);
    return str.substring(varStart, varEnd + 1);
}
function parseVar(token, json) {
    var args = ArgHandler.getInstance().getArgs;
    token = token.substring(2, token.length - 1);
    var tokenArr = token.split('.');
    if (tokenArr[0] === 'args') {
        return args[tokenArr[1]];
    }
    else if (tokenArr[0] === 'json') {
        var val = json;
        for (var i = 1; i < tokenArr.length; i++) {
            var k = tokenArr[i].indexOf('[');
            if (k >= 0) {
                var arrVal = tokenArr[i].split('[');
                val = val[arrVal[0]][parseInt(arrVal[1].charAt(0))];
            }
            else {
                val = val[tokenArr[i]];
            }
        }
        return val;
    }
}
