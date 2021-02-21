import { Arguments } from "./commands/Arguments";

export class ArgHandler {
    private args: Arguments;
    private static instance: ArgHandler;

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
        this.args.city = ((this.args.city) ? this.args.city : this.args.local);
        this.args.units = ((this.args.f || this.args.c) ?
            (this.args.c ? 'metric' : 'imperial') :
            this.args.default_units);
        this.args.descriptiveUnit = (this.args.units === 'metric') ? 'Celsius' : 'Fahrenheit';
        this.args.outputFile = `./${this.args.output_file_path}`;
        this.args.date = new Date().toLocaleDateString();
    }
}

module.exports = ArgHandler;
