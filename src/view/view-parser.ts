import {formatView} from "./view-formatter";

const ArgHandler = require("../commands/argHandler");

export function parseView(viewString: string, json: any): string {

    return recParse(formatView(JSON.parse(viewString).view), json);

}

function recParse(workingString: string, json: any): string {

    let token = findVars(workingString, 0);
    if (token) {
        let replace = parseVar(token, json);
        workingString = workingString.replace(token, replace);
        workingString = recParse(workingString, json);
    }

    return workingString;
}

function findVars(str: string, startpos: number) {

    const match: string = '\\$\\{([a-z|A-Z|0-9|\\._\\[\\]-])+\\}';

    let indexOf = str.substring(startpos || 0).search(match);
    let varStart = (indexOf >= 0) ? (indexOf + (startpos || 0)) : indexOf;
    let varEnd = str.indexOf('}', varStart);

    return str.substring(varStart, varEnd + 1);
}

function parseVar(token: string, json: any) {
    const args = ArgHandler.getInstance().getArgs;

    token = token.substring(2, token.length - 1);
    let tokenArr = token.split('.');

    if (tokenArr[0] === 'args') {
        return args[tokenArr[1]];
    }
    else if (tokenArr[0] === 'json') {
        let val = json;

        for (let i = 1; i < tokenArr.length; i++) {

            let k = tokenArr[i].indexOf('[');

            if (k >= 0) {
                let arrVal = tokenArr[i].split('[');
                val = val[arrVal[0]][parseInt(arrVal[1].charAt(0))];
            }
            else {
                val = val[tokenArr[i]];
            }
        }
        return val;
    }
}
