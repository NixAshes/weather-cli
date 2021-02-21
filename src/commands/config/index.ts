/* Plans for this command module:
TODO: Allow users to configure new APIs
TODO: Allow users to make requests from APIs and view the raw JSON response
TODO: Allow users to add and update config variables to either main config or .env
 */

import {Command} from "../Command";
import {Arguments} from "../Arguments";

const ArgHandler = require('../argHandler');
let args: Arguments;

const config = {
    name: 'config',
    command: 'config',
    desc: 'Configuration options for the CLI',
    builder: {
        a: {
            alias: 'api',
            group: 'Configuration',
            desc: 'configure APIs for the app',
            choices: [ 'new', 'list', 'update']
        }
    },
    handler: configHandler,
    processCommand: processCmd
}

export function setup(): Command {
    return config;
}

function configHandler(argv: Arguments) {
    console.log(argv);
    ArgHandler.setArgs(argv);
    args = ArgHandler.getInstance().getArgs;
    args.cmd = config;

    if (args.a) {
        switch (args.a) {
            case 'new':
                args.cmd.processCommand = buildNewAPI;
        }
    }
}

function processCmd() {

}

function buildNewAPI() {
    console.log('hey it works');
}
