export interface Command {
    name: string,
    command: string,
    handler: Function
    processCommand: Function
}
