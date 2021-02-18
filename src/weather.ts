const yargs = require('yargs/yargs');
const { hideBin } = require('yargs/helpers');

// set up yargs
const args = yargs(hideBin(process.argv))
    .usage('USAGE: ts-node weather.ts [city] --options')
    .command({
        command: '$0 <city>',
        desc: 'Retrieves current and forecasted weather data for the named city. For city names' +
            'with spaces, use dash; i.e. \'San-Antonio\'',
        handler: handler
    })
    .help()
    .argv;

function handler(args: any) {
    return console.log(args.city);
}
