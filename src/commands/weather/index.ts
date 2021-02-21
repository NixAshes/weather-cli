import {formatView} from "../../view/view-formatter";
import {Arguments} from "../Arguments";
import {Command} from "../Command";

require('dotenv').config();

const ArgHandler = require('../argHandler');

const connect = require('../../connect');
const viewParser = require("../../view/view-parser");
const fs = require('fs');

const outputs = require('../../outputPaths');

let args: Arguments;
export const weather = {
    name: 'default',
    command: '$0 [city]',
    desc: 'Retrieves current and forecasted weather data for the named city. For city names' +
        'with spaces, eliminate the space; i.e. \'SanAntonio\'. If no city is provided, ' +
        'defaults to the value set in the LOCAL environment variable.',
    builder: {
        f: { type: 'boolean', alias: 'fahrenheit', conflicts: 'c'},
        c: { type: 'boolean', alias: 'celsius', conflicts: 'f'},
        s: { type: 'string', alias: 'state', desc: 'optional flag to set state if needed'},
        v: { type: 'boolean', alias: 'view', desc: 'display data in specified view'},
        p: { type: 'string', alias: 'path', requiresArg: 'v', desc: 'path to a JSON file containing a view'}
    },
    handler: weatherHandler,
    processCommand: async () => {
        await processCmd()
    }
}

export function setup(): Command {
    return weather;
}

function weatherHandler(argv: Arguments) {
    ArgHandler.setArgs(argv);
    args = ArgHandler.getInstance().getArgs;
    args.cmd = weather;

}

async function processCmd() {
    await connect.getCoords(buildURL('geo'))
        .then((coords: string[]) => {
            args.lat = coords[0];
            args.lng = coords[1];
        });

    connect.getWeatherData(buildURL('weather'))
        .then((data: JSON) => {
            const formattedOutput: string = formatOutput(data);
            outputs.toConsole.output(/*'\nWeather CLI',*/ formattedOutput);

            let path: string = (args.outputFile) ? (args.outputFile as string) : '';
            outputs.toFile.output(path, formattedOutput);
        });
}

function buildURL(type: string): string {
    let url: string = '';

    if (type === 'geo') {
        if (process.env.GEOCODING_FORMAT &&
            process.env.GEOCODING_KEY &&
            process.env.GEOCODING_BASE_URL) {

            url = process.env.GEOCODING_FORMAT;
            url = url.replace('${BASE_URL}', process.env.GEOCODING_BASE_URL)
                .replace('${GEOCODING_KEY}', process.env.GEOCODING_KEY);

            const options = 'location=' + args.city + ((args.state) ? `,${args.state}` : '');

            url = url.replace('${OPTIONS}', options);

        } else {
            console.error('ERROR: Geocoding API environment variables not set. Please ' +
                'check your .env file.')
        }
    } else if (type === 'weather') {
        if (process.env.WEATHER_FORMAT &&
            process.env.WEATHER_BASE_URL &&
            process.env.WEATHER_KEY) {

            url = process.env.WEATHER_FORMAT;
            url = url.replace('${BASE_URL}', process.env.WEATHER_BASE_URL)
                .replace('${WEATHER_KEY}', process.env.WEATHER_KEY);

            const options = 'lat=' + args.lat +
                '&lon=' + args.lng +
                '&units=' + args.units;

            url = url.replace('${OPTIONS}', options);

        } else {
            console.error('ERROR: Weather API environment variables not set. Please ' +
                'check your .env file.')
        }
    }

    return url;
}

function formatOutput(data: any) {

    const weatherView = require('../../view/weather-view');
    let outputString;
    if (!args.v) {
        outputString = formatView(weatherView(data).view);
    } else {
        outputString = viewParser.parseView(fs.readFileSync(args.p as string, "utf-8"), data);
    }

    return outputString;

}
