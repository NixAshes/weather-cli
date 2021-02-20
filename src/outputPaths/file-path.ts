const { appendFile } = require('fs/promises');

export function output(path: string, formattedOutput: string) {

    appendFile(path, formattedOutput)
        .then(() => {
            console.log(`Forecast information appended to ${path}.`);
        });
}
