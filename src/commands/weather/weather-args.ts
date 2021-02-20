module.exports = {
    f: { type: 'boolean', alias: 'fahrenheit', conflicts: 'c'},
    c: { type: 'boolean', alias: 'celsius', conflicts: 'f'},
    s: { type: 'string', alias: 'state', desc: 'optional flag to set state if needed'}
}
