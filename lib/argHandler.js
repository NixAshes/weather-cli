"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ArgHandler = void 0;
var ArgHandler = /** @class */ (function () {
    function ArgHandler(argv) {
        this.args = argv;
        this.normalizeArgs();
    }
    ArgHandler.setArgs = function (args) {
        if (!this.instance) {
            this.instance = new ArgHandler(args);
        }
        else {
            this.instance.args = args;
        }
    };
    ArgHandler.getInstance = function () {
        if (!this.instance) {
            console.log('ArgHandler instance is not initialized.');
        }
        return this.instance;
    };
    Object.defineProperty(ArgHandler.prototype, "getArgs", {
        get: function () {
            return ArgHandler.instance.args;
        },
        enumerable: false,
        configurable: true
    });
    ArgHandler.prototype.normalizeArgs = function () {
        this.args.city = ((this.args.city) ? this.args.city : this.args.local);
        this.args.units = ((this.args.f || this.args.c) ?
            (this.args.c ? 'metric' : 'imperial') :
            this.args.default_units);
        this.args.descriptiveUnit = (this.args.units === 'metric') ? 'Celsius' : 'Fahrenheit';
        this.args.outputFile = "./" + this.args.output_file_path;
        this.args.date = new Date().toLocaleDateString();
    };
    return ArgHandler;
}());
exports.ArgHandler = ArgHandler;
module.exports = ArgHandler;
