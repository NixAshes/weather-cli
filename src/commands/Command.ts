export interface Command {
    name: string,
    command: string,
    desc?: string,
    builder?: Function | any,
    handler: Function,
    processCommand: Function
}
