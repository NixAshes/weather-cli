const nfetch = require('node-fetch');

// Get city coordinates from Mapquest Geocoding API
export async function getCoords(url: string): Promise<string[]> {

    // fetch coords
    const settings = { method: 'Get' };
    let result = await nfetch(url, settings)
        .then((res: any) => res.json())
        .then((json: any) => {
            if(json) {
                const coords = json.results[0].locations[0].latLng;
                return [coords.lat, coords.lng];
            } else {
                console.error('GEOCODING API ERROR: City not found!')
            }
        })
        .catch((err: any) => console.log('Error: ' + err));

    return new Promise(function( resolve ) {
        resolve(result);
    });
}

// Get weather data from Open Weather Map API
export async function getWeatherData(url: string): Promise<JSON> {

    const settings = { method: "Get" };

    let result = nfetch(url, settings)
        .then((res: any) => res.json())
        .then((json: any) => {
            if(json.cod !== '404') {
                return json;
            } else {
                console.error('WEATHER API ERROR: 404: City not found!');
            }

        });

    return new Promise( function(resolve) {
        resolve(result);
    })
}
