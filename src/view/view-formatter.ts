import {View} from "./view";

export function formatView(view: View): string {
    let outputString: string = '\n';

    outputString += recFormat(outputString, Object.values(view));

    return outputString;
}

function recFormat(outputString: string, valueArray: Array<any>): string {

    valueArray.forEach((value) => {
        if (typeof value === 'string') {
            outputString += `${value}`;
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
