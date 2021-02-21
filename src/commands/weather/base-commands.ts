import {Command} from "../Command";

require('dotenv').config();
import { Arguments } from "../Arguments";
const ArgHandler = require('../../argHandler')


const connect = require('../../connect');
const outputs = require('../../outputPaths');

let args: Arguments;
const defaultCommand = {
    name: 'default',
    command: '$0 [city]',
    desc: 'Retrieves current and forecasted weather data for the named city. For city names' +
        'with spaces, eliminate the space; i.e. \'SanAntonio\'. If no city is provided, ' +
        'defaults to the value set in the LOCAL environment variable.',
    handler: defaultHandler,
    array: true,
    processCommand: async () => {

        await processCmd()
    }
}

function defaultHandler(argv: Arguments){
    ArgHandler.setArgs(argv);
    args = ArgHandler.getInstance().getArgs;
    args.cmd = defaultCommand;

}

export async function processCmd() {
    await connect.getCoords(buildURL('geo')).then( (coords: string[]) => {
        args.lat = coords[0];
        args.lng = coords[1];
    });
    connect.getWeatherData(buildURL('weather'))
        .then( (data: JSON) => {
            const formattedOutput: string = formatOutput(data);
            outputs.toConsole.output('\nWeather CLI', formattedOutput);

            let path: string = (args.outputFile) ? (args.outputFile as string) : '';
            outputs.toFile.output(path, formattedOutput);
        } );
}

export function setup(): Command {
    return defaultCommand;
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

            const options = 'location=' + (args.city);

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
    let outputString: string =
        `\nForecast for: ${args.date}\n` +
        `City: ${args.city}\n` +
        '\nCURRENT WEATHER\n' +
        `Temperature: ${data.current.temp} deg ${args.descriptiveUnit}\n` +
        `Current conditions: ${data.current.weather[0].main}\n` +
        '\nTOMORROW\'S WEATHER\n' +
        `Temp (Low/High): ${data.daily[1].temp.min}/${data.daily[1].temp.max} deg ${args.descriptiveUnit}\n` +
        `Conditions: ${data.daily[1].weather[0].main}\n`

    if (data.alerts) {
        outputString += '\nALERTS\n';
        data.alerts.forEach( (alert: any) => {
            const sender = alert.sender_name;
            const event = alert.event;
            const desc = alert.description;

            outputString += `Agency: ${sender}\n`;
            outputString += `Alert: ${event}\n`;
            outputString += `\n${desc}\n`;
        })
    }

    outputString += `\n${args.output_delineator}\n`;

    return outputString;

}
