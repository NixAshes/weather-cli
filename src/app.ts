require('dotenv').config();

const yargs = require('yargs/yargs');
import { Arguments } from "./commands/Arguments";

// set up yargs
// TODO: move config options to config file instead of .env
var argv: Arguments = yargs(process.argv.slice(2))
    .usage('USAGE: ts-node app.ts [city] --options')
    .command(require('./commands/weather/base-commands').setup())
    .options(require('./commands/weather/weather-args'))
    .help()
    .argv;

normalizeArgs(argv);
argv.cmd.processCommand(argv);


function normalizeArgs(args: Arguments) {
    argv.city = ((args.city) ? args.city : process.env.LOCAL);
    argv.units = ((argv.f || argv.c) ?
        (argv.c ? 'metric' : 'imperial') :
        process.env.DEFAULT_UNITS);
    argv.descriptiveUnit = (argv.units === 'metric') ? 'Celsius' : 'Fahrenheit';
    argv.outputFile = `./${process.env.OUTPUT_FILE_PATH}`;
    argv.date = new Date().toLocaleDateString();
}
