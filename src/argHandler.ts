import { Arguments } from "./commands/Arguments";

export class ArgHandler {
    private args: Arguments;
    private static instance: ArgHandler;
    config = { LOCAL: 'SanAntonio ',
    DEFAULT_UNITS: 'imperial', OUTPUT_FILE_PATH: './weather.txt'

    };

    private constructor(argv: Arguments ) {
        this.args = argv;
        this.normalizeArgs();
    }

    static setArgs(args: Arguments ) {
        if (!this.instance) {
            this.instance = new ArgHandler(args);
        }
        else {
            this.instance.args = args;
        }
    }

    static getInstance(): ArgHandler | undefined {
        if (!this.instance) {
            console.log('ArgHandler instance is not initialized.');
        }
        return this.instance;
    }

    get getArgs(): Arguments {
        return ArgHandler.instance.args;
    }

    private normalizeArgs() {
        this.args.city = ((this.args.city) ? this.args.city : this.config.LOCAL);
        this.args.units = ((this.args.f || this.args.c) ?
            (this.args.c ? 'metric' : 'imperial') :
            this.config.DEFAULT_UNITS);
        this.args.descriptiveUnit = (this.args.units === 'metric') ? 'Celsius' : 'Fahrenheit';
        this.args.outputFile = `./${this.config.OUTPUT_FILE_PATH}`;
        this.args.date = new Date().toLocaleDateString();
    }
}

module.exports = ArgHandler;
