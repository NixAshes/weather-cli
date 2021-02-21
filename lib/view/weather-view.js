"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var ArgHandler = require("../commands/argHandler");
var args = ArgHandler.getInstance().getArgs;
var weatherView = function (json) {
    return {
        forAPI: 'OWM',
        view: {
            title: 'Weather CLI',
            header: "\nForecast for " + args.city + " on " + args.date + "\n",
            sections: [
                {
                    sectionTitle: '\nCURRENT WEATHER\n',
                    records: [
                        {
                            label: 'Temperature: ',
                            dataLocation: json.current.temp + " ",
                            tail: "deg " + args.descriptiveUnit + "\n"
                        },
                        {
                            label: 'Current conditions: ',
                            dataLocation: json.current.weather[0].main + "\n",
                        }
                    ]
                },
                {
                    sectionTitle: '\nTOMORROW\'S WEATHER\n',
                    records: [
                        {
                            label: 'Low: ',
                            dataLocation: json.daily[1].temp.min + " ",
                            tail: "deg " + args.descriptiveUnit + "\n"
                        },
                        {
                            label: 'High: ',
                            dataLocation: json.daily[1].temp.max + " ",
                            tail: "deg " + args.descriptiveUnit + "\n"
                        },
                        {
                            label: 'Conditions: ',
                            dataLocation: json.daily[1].weather[0].main + "\n"
                        }
                    ]
                }
            ]
        }
    };
};
module.exports = weatherView;
