require('dotenv').config();
const nfetch = require('node-fetch');
const { appendFile } = require('fs/promises');

const yargs = require('yargs/yargs');
const { hideBin } = require('yargs/helpers');

// set up yargs
var argv = yargs(hideBin(process.argv))
    .usage('USAGE: ts-node weather.ts [city] --options')
    .command({
        command: '$0 [city]',
        desc: 'Retrieves current and forecasted weather data for the named city. For city names' +
            'with spaces, use dash; i.e. \'San-Antonio\'. If no city is provided, defaults to ' +
            'the value set in the LOCAL environment variable.',
        handler: defaultHandler,
        array: true
    })
    .option('f', {
        desc: 'returns temperatures in degrees fahrenheit',
        alias: 'fahrenheit',
        conflicts: 'c'
    })
    .option('c', {
        desc: 'returns temperatures in degrees celsius',
        alias: 'celsius',
        conflicts: 'f'
    })
    .help()
    .argv;

function defaultHandler(args: any) {
    argv = args; // one day I'll figure out why I had to do this
    normalizeArgs(argv);
    processCommand();
}

async function processCommand() {
    await getCoords();
    getWeatherData();
}

// Get city coordinates from Mapquest Geocoding API
async function getCoords() {
    // build request URL
    const reqURL = buildURL('geo');

    // fetch coords
    const settings = { method: 'Get' };
    await nfetch(reqURL, settings)
        .then((res: any) => res.json())
        .then((json: any) => {
            if(json) {
                const coords = json.results[0].locations[0].latLng;
                argv.lat = coords.lat;
                argv.lng = coords.lng;
            } else {
                console.error('GEOCODING API ERROR: City \'%s\' not found!', argv.city)
            }
        })
        .catch((err: any) => console.log('Error: ' + err));

}

// Get weather data from Open Weather Map API
function getWeatherData() {

    const reqURL = buildURL('weather');
    const settings = { method: "Get" };

    nfetch(reqURL, settings)
        .then((res: any) => res.json())
        .then((json: any) => {
            if(json.cod !== '404') {
                formatOutput(json);
            } else {
                console.error('WEATHER API ERROR: 404: City \'%s\' not found!', argv.city);
            }

    });
}

function buildURL(type: string) {
    if(type === 'geo') {
        let url: string;
        if( process.env.GEOCODING_FORMAT &&
            process.env.GEOCODING_KEY &&
            process.env.GEOCODING_BASE_URL) {

            url = process.env.GEOCODING_FORMAT;
            url = url.replace('${BASE_URL}', process.env.GEOCODING_BASE_URL)
                .replace('${GEOCODING_KEY}', process.env.GEOCODING_KEY);

            const options = 'location=' + (argv.city);

            url = url.replace('${OPTIONS}', options);

            return url;

        } else {
            console.error('ERROR: Geocoding API environment variables not set. Please ' +
                'check your .env file.')
        }
    }
    else if (type === 'weather') {
        let url: string;
        if( process.env.WEATHER_FORMAT &&
            process.env.WEATHER_BASE_URL &&
            process.env.WEATHER_KEY) {

            url = process.env.WEATHER_FORMAT;
            url = url.replace('${BASE_URL}', process.env.WEATHER_BASE_URL)
                .replace('${WEATHER_KEY}', process.env.WEATHER_KEY);

            const options = 'lat=' + argv.lat +
                '&lon=' + argv.lng +
                '&units=' + argv.units;

            url = url.replace('${OPTIONS}', options);

            return url;
        } else {
            console.error('ERROR: Weather API environment variables not set. Please ' +
                'check your .env file.')
        }
    }
}


function outputToFile(outputString: string) {

    appendFile(argv.outputFile, outputString)
        .then(() => {
            console.log(`Forecast information appended to ${argv.outputFile}.`);
        });
}

function formatOutput(data: any) {
    let outputString: string =
        `\nForecast for: ${argv.date}\n` +
        `City: ${argv.city}\n` +
        '\nCURRENT WEATHER\n' +
        `Temperature: ${data.current.temp} deg ${argv.descriptiveUnit}\n` +
        `Current conditions: ${data.current.weather[0].main}\n` +
        '\nTOMORROW\'S WEATHER\n' +
        `Temp (Low/High): ${data.daily[1].temp.min}/${data.daily[1].temp.max} deg ${argv.descriptiveUnit}\n` +
        `Conditions: ${data.daily[1].weather[0].main}\n`

    if (data.alerts) {
        outputString += '\nALERTS\n';
        // console.log('\nALERTS');
        data.alerts.forEach( (alert: any) => {
            const sender = alert.sender_name;
            const event = alert.event;
            const desc = alert.description;

            outputString += `Agency: ${sender}\n`;
            outputString += `Alert: ${event}\n`;
            outputString += `\n${desc}\n`;
            /*console.log('Agency: %s', alert.sender_name);
            console.log('Alert: %s', alert.event);
            console.log('\n%s', alert.description);*/
        })
    }

    outputString += `\n${process.env.OUTPUT_DELINEATOR}\n`;

    console.log( '\nWeather CLI' + outputString);
    outputToFile(outputString);

}

function normalizeArgs(args: any) {
    argv.city = ((args.city) ? args.city : process.env.LOCAL);
    argv.units = ((argv.f || argv.c) ?
        ((argv.c===true) ? 'metric' : 'imperial') :
        process.env.DEFAULT_UNITS);
    argv.descriptiveUnit = (argv.units === 'metric') ? 'Celsius' : 'Fahrenheit';
    argv.outputFile = `./${process.env.OUTPUT_FILE_PATH}`;
    argv.date = new Date().toLocaleDateString();
}
