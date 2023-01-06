/**

State object may contain 2 spatial key patterns
1. '$' prefix - for formulas
2. '_' prefix - for overriding formula with value
*/


function copy(obj, prop) {
    return Array.isArray(obj[prop]) ? [...obj[prop]] : { ...obj[prop] }
}

function isIndex(x) {
    try {
        t = parseInt(x)
        return !Number.isNaN(x)
    } catch (ex) {
        return false
    }
}

function delProp(state, payload) {
    const { name, prop } = payload
    const path = name.split('.')
    const root = { ...state }
    let obj = root
    let objType = 'val'
    while (path.length > 1 && obj !== undefined) {
        const curr = path.shift()
        if (obj['$' + curr]) {
            obj['$' + curr] = copy(obj, '$' + curr)
            obj = obj['$' + curr]
            objType = 'lambda'
        } else if (obj['_' + curr]) {
            obj['_' + curr] = copy(obj, '_' + curr)
            obj = obj['_' + curr]
            objType = 'over'
        } else if (obj[curr] === undefined) {
            return state
        } else {
            obj[curr] = copy(obj, curr)
            obj = obj[curr]
        }
    }
    if (obj === undefined) { return state }
    if (Array.isArray(obj[path[0]])) {
        const arr = [...obj[path[0]]]
        arr.splice(parseInt(prop), 1)
        obj[path[0]] = arr
    } else {
        const obj = { ...obj[path[0]] }
        delete obj[prop]
        obj[path[0]] = obj
    }
    return root
}

function setProp(state, payload) {
    const { name, value } = payload
    const path = name.split('.')
    const root = { ...state }
    let obj = root
    while (path.length > 1) {
        const curr = path.shift()
        if (obj['$' + curr]) {
            obj['$' + curr] = copy(obj, '$' + curr)
            obj = obj['$' + curr]
        } else if (obj['_' + curr]) {
            obj['_' + curr] = copy(obj, '_' + curr)
            obj = obj['_' + curr]
        } else {
            obj[curr] = { ...(obj[curr] || isIndex(curr) ? [] : {}) }
            obj = obj[curr]
        }
    }
    if(obj['$'+path[0]]) {
        obj['_' + path[0]] = value
    } else {
        obj[path[0]] = value
    }
    return root
}

function pushProp(state, payload) {
    const { name, value } = payload
    const path = name.split('.')
    const root = { ...state }
    let obj = root
    while (path.length > 1) {
        const curr = path.shift()
        if (obj['$' + curr]) {
            obj['$' + curr] = copy(obj, '$' + curr)
            obj = obj['$' + curr]
        } else if (obj['_' + curr]) {
            obj['_' + curr] = copy(obj, '_' + curr)
            obj = obj['_' + curr]
        } else {
            obj[curr] = { ...(obj[curr] || isIndex(curr) ? [] : {}) }
            obj = obj[curr]
        }
    }
    if (Array.isArray(obj[path[0]])) {
        obj[path[0]].push(value)
    } else if (obj[path[0]] === undefined) {
        obj[path[0]] = [value]
    } else {
        obj[path[0]] = [obj[path[0]], value]
    }
    return root
}

function clrProp(state, payload) {  // clear overrided value 
    const { name } = payload
    const path = name.split('.')
    const root = { ...state }
    let obj = root
    while (path.length > 1) {
        const curr = path.shift()
        if (obj['$' + curr]) {
            obj['$' + curr] = copy(obj, '$' + curr)
            obj = obj['$' + curr]
        } else if (obj['_' + curr]) {
            obj['_' + curr] = copy(obj, '_' + curr)
            obj = obj['_' + curr]
        } else {
            obj[curr] = { ...(obj[curr] || isIndex(curr) ? [] : {}) }
            obj = obj[curr]
        }
    }
    delete obj['_' + path[0]]
    return root
}

export {
    // name parameter is a path to the property separated by '.' including arrays
    // Example: state = { a: [10,20,{c:666}]} ; name = 'a.2.c' -> 666
    delProp,    // rootState, payload : { name: string, prop: string|number }
    setProp,    // rootState, payload : { name: string, value: any }
    pushProp,   // rootState, payload : { name: string } 
    clrProp,    // rootState, payload : { name: string, value: any } 
}
