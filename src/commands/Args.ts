export interface Args {
    [x: string]: unknown;
    f: boolean,
    c: boolean,
}

const args = {
    f: { type: 'boolean', alias: 'fahrenheit', conflicts: 'c'},
    c: { type: 'boolean', alias: 'celsius', conflicts: 'f'}
}

module.exports = {
    args
}
