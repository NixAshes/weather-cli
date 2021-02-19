require('dotenv').config();
const nfetch = require('node-fetch');

const yargs = require('yargs/yargs');
const { hideBin } = require('yargs/helpers');

// set up yargs
const args = yargs(hideBin(process.argv))
    .usage('USAGE: ts-node weather.ts [city] --options')
    .command({
        command: '$0 [city]',
        desc: 'Retrieves current and forecasted weather data for the named city. For city names' +
            'with spaces, use dash; i.e. \'San-Antonio\'. If no city is provided, defaults to ' +
            'the value set in the LOCAL environment variable.',
        handler: defaultHandler
    })
    .help()
    .argv;

function defaultHandler(args: any) {
    getWeatherData(args, 'weather');
}

// Get weather data from OpenWeatherMap API

function getWeatherData(args: any, command: string) {
    const reqURL = 'https://api.openweathermap.org/data/2.5/' + command + '?q=' +
        ((args.city) ? args.city : process.env.LOCAL) + '&appid=' + process.env.API_KEY +
        '&units=imperial'

    const settings = { method: "Get" };

    nfetch(reqURL, settings)
        .then((res: any) => res.json())
        .then((json: JSON) => {
        console.log(json);
    })
}
