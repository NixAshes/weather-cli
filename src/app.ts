import * as fs from "fs";

require('dotenv').config();

const yargs = require('yargs/yargs');

import {Arguments} from "./commands/Arguments";
const ArgHandler = require('./commands/argHandler');

// set up yargs
const argv: Arguments = yargs(process.argv.slice(2))
    .usage('USAGE: ts-node app.ts [city] --options')
    .command(require('./commands/weather').setup())
    .command(require('./commands/config').setup())
    .config(JSON.parse(fs.readFileSync(process.env.DEV_CONFIG_PATH as string, 'utf-8')))
    .help()
    .parse();

ArgHandler.setArgs(argv);
argv.cmd.processCommand();
