"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.setup = exports.weather = void 0;
var view_formatter_1 = require("../../view/view-formatter");
require('dotenv').config();
var ArgHandler = require('../argHandler');
var connect = require('../../connect');
var viewParser = require("../../view/view-parser");
var fs = require('fs');
var outputs = require('../../outputPaths');
var args;
exports.weather = {
    name: 'default',
    command: '$0 [city]',
    desc: 'Retrieves current and forecasted weather data for the named city. For city names' +
        'with spaces, eliminate the space; i.e. \'SanAntonio\'. If no city is provided, ' +
        'defaults to the value set in the LOCAL environment variable.',
    builder: {
        f: { type: 'boolean', alias: 'fahrenheit', conflicts: 'c' },
        c: { type: 'boolean', alias: 'celsius', conflicts: 'f' },
        s: { type: 'string', alias: 'state', desc: 'optional flag to set state if needed' },
        v: { type: 'boolean', alias: 'view', desc: 'display data in specified view' },
        p: { type: 'string', alias: 'path', requiresArg: 'v', desc: 'path to a JSON file containing a view' }
    },
    handler: weatherHandler,
    processCommand: function () { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, processCmd()];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); }
};
function setup() {
    return exports.weather;
}
exports.setup = setup;
function weatherHandler(argv) {
    ArgHandler.setArgs(argv);
    args = ArgHandler.getInstance().getArgs;
    args.cmd = exports.weather;
}
function processCmd() {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, connect.getCoords(buildURL('geo'))
                        .then(function (coords) {
                        args.lat = coords[0];
                        args.lng = coords[1];
                    })];
                case 1:
                    _a.sent();
                    connect.getWeatherData(buildURL('weather'))
                        .then(function (data) {
                        var formattedOutput = formatOutput(data);
                        outputs.toConsole.output(/*'\nWeather CLI',*/ formattedOutput);
                        var path = (args.outputFile) ? args.outputFile : '';
                        outputs.toFile.output(path, formattedOutput);
                    });
                    return [2 /*return*/];
            }
        });
    });
}
function buildURL(type) {
    var url = '';
    if (type === 'geo') {
        if (process.env.GEOCODING_FORMAT &&
            process.env.GEOCODING_KEY &&
            process.env.GEOCODING_BASE_URL) {
            url = process.env.GEOCODING_FORMAT;
            url = url.replace('${BASE_URL}', process.env.GEOCODING_BASE_URL)
                .replace('${GEOCODING_KEY}', process.env.GEOCODING_KEY);
            var options = 'location=' + args.city + ((args.state) ? "," + args.state : '');
            url = url.replace('${OPTIONS}', options);
        }
        else {
            console.error('ERROR: Geocoding API environment variables not set. Please ' +
                'check your .env file.');
        }
    }
    else if (type === 'weather') {
        if (process.env.WEATHER_FORMAT &&
            process.env.WEATHER_BASE_URL &&
            process.env.WEATHER_KEY) {
            url = process.env.WEATHER_FORMAT;
            url = url.replace('${BASE_URL}', process.env.WEATHER_BASE_URL)
                .replace('${WEATHER_KEY}', process.env.WEATHER_KEY);
            var options = 'lat=' + args.lat +
                '&lon=' + args.lng +
                '&units=' + args.units;
            url = url.replace('${OPTIONS}', options);
        }
        else {
            console.error('ERROR: Weather API environment variables not set. Please ' +
                'check your .env file.');
        }
    }
    return url;
}
function formatOutput(data) {
    var weatherView = require('../../view/weather-view');
    var outputString;
    if (!args.v) {
        outputString = view_formatter_1.formatView(weatherView(data).view);
    }
    else {
        outputString = viewParser.parseView(fs.readFileSync(args.p, "utf-8"), data);
    }
    return outputString;
}
