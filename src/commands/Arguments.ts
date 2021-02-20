import {Command} from "./Command";

export interface Arguments {
    [x: string]: unknown;
    cmd: Command;
    command: string,
    f: boolean,
    c: boolean,
    s: boolean
}

