import * as fs from "fs";

require('dotenv').config();

const yargs = require('yargs/yargs');

import {Arguments} from "./commands/Arguments";
const ArgHandler = require('./commands/argHandler');

function getArgv() {
    try {
        return yargs(process.argv.slice(2))
            .usage('USAGE: ts-node app.ts [city] --options')
            .command(require('./commands/weather/base-commands').setup())
            .options(require('./commands/weather/weather-args'))
            .config(JSON.parse(fs.readFileSync(process.env.CONFIG_PATH as string, 'utf-8')))
            .help()
            .argv;
    }
    catch (err) {
        if (err instanceof TypeError) {
            console.error(`Configuration file not provided. Please provide a configuration file.
            A template can be found at (get a URL to put here).`);
            process.exit(-1);
        }
        else {
            console.error("An unknown error occurred. Exiting program.");
        }
    }
}

// set up yargs
const argv: Arguments = getArgv();

ArgHandler.setArgs(argv);
argv.cmd.processCommand();
