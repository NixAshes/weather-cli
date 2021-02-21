module.exports = {
    f: { type: 'boolean', alias: 'fahrenheit', conflicts: 'c'},
    c: { type: 'boolean', alias: 'celsius', conflicts: 'f'},
    s: { type: 'string', alias: 'state', desc: 'optional flag to set state if needed'},
    v: { type: 'boolean', alias: 'view', desc: 'display data in specified view'},
    p: { type: 'string', alias: 'path', requiresArg: 'v', desc: 'path to a JSON file containing a view'}
}
