require('dotenv').config();
const nfetch = require('node-fetch');

const yargs = require('yargs/yargs');
const { hideBin } = require('yargs/helpers');

// set up yargs
const argv = yargs(hideBin(process.argv))
    .usage('USAGE: ts-node weather.ts [city] --options')
    .command({
        command: '$0 [city]',
        desc: 'Retrieves current and forecasted weather data for the named city. For city names' +
            'with spaces, use dash; i.e. \'San-Antonio\'. If no city is provided, defaults to ' +
            'the value set in the LOCAL environment variable.',
        handler: defaultHandler,
        array: true
    })
    .help()
    .argv;

function defaultHandler(argv: any) {
    processCommand(argv);
}

async function processCommand(argv: any) {
    await getCoords(argv);
    getWeatherData(argv);
}

// Get city coordinates from Mapquest Geocoding API
async function getCoords(argv: any) {
    // build request URL
    const reqURL = buildURL('geo', argv);

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
function getWeatherData(argv: any) {

    const reqURL = buildURL('weather', argv);
    const settings = { method: "Get" };

    nfetch(reqURL, settings)
        .then((res: any) => res.json())
        .then((json: any) => {
            if(json.cod !== '404') {
                formatOutput(json, argv);
            } else {
                console.error('WEATHER API ERROR: 404: City \'%s\' not found!', argv.city);
            }

    });
}

function buildURL(type: string, argv: any) {
    if(type === 'geo') {
        let url: string;
        if( process.env.GEOCODING_FORMAT &&
            process.env.GEOCODING_KEY &&
            process.env.GEOCODING_BASE_URL) {

            url = process.env.GEOCODING_FORMAT;
            url = url.replace('${BASE_URL}', process.env.GEOCODING_BASE_URL)
                .replace('${GEOCODING_KEY}', process.env.GEOCODING_KEY);

            const options = 'location=' + ((argv.city) ? argv.city : process.env.LOCAL);

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
                '&units=' + (argv.units ? argv.units : process.env.DEFAULT_UNITS);

            url = url.replace('${OPTIONS}', options);

            return url;
        } else {
            console.error('ERROR: Weather API environment variables not set. Please ' +
                'check your .env file.')
        }
    }
}


function formatOutput(data: any, argv: any) {
    console.log('\nWeather CLI\n');
    console.log('City: %s', (argv.city) ? argv.city : process.env.LOCAL);
    console.log('\nCURRENT WEATHER')
    console.log('Temperature: %s deg %s',
        data.current.temp,
        (argv.units ? argv.units : (process.env.DEFAULT_UNITS==='imperial' ? 'Fahrenheit' : 'Celsius')));
    console.log('Current conditions: %s', data.current.weather[0].main);
    console.log('\nTOMORROW\'S WEATHER');
    console.log('Temp (Low/High): %s/%s deg %s',
        data.daily[1].temp.min,
        data.daily[1].temp.max,
        (argv.units ? argv.units : (process.env.DEFAULT_UNITS==='imperial' ? 'Fahrenheit' : 'Celsius')));
    console.log('Conditions: %s', data.daily[1].weather[0].main);
    if (data.alerts) {
        console.log('\nALERTS');
        data.alerts.forEach( (alert: any) => {
            console.log('Agency: %s', alert.sender_name);
            console.log('Alert: %s', alert.event);
            console.log('\n%s', alert.description);
        })
    }
}
