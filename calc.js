import MY_FUNCS from './my-funcs'
import { stringify } from "./utils"

const MAX_CYCLES = 100

/**
 * calcTypes:
 * 'o' - Overrided
 * 'f' - Function
 * 'v' - Value
 * '?' - Unknown
 */


export function calc(obj, parent = undefined, values = {}, calcTypes = {}) {

    const keys = Object.keys(obj)
    keys.filter(k => !k.startsWith('$'))
        .forEach((key) => {
            if (key.startsWith('_') && obj['$' + key.substring(1)]) {
                values[key.substring(1)] = obj[key]
                calcTypes[key.substring(1)] = 'o'
            } else {
                values[key] = obj[key]
                calcTypes[key] = 'v'
            }
        })

    let processed
    let cycles = MAX_CYCLES

    const toCalc = keys.filter(k => {
        if (!k.startsWith('$')) return false
        const k0 = k.substring(1)
        if (obj['_' + k0] !== undefined) return false
        return true
    })

    do {
        processed = 0
        toCalc.forEach((key) => {
            const target = key.substring(1)
            const val = obj[key]
            const oldValue = stringify(values[target])

            try {
                switch (typeof val) {
                    case 'function': {
                        values[target] = val(values)
                        calcTypes[target] = 'f'
                    } break;
                    case 'string': {
                        const fBody = `const {${Object.keys(MY_FUNCS).join(',')}} = MY_FUNCS;  
                            const {${Object.keys(values).join(',')}} = props; 
                            return ${val}`
                        const f = new Function('MY_FUNCS', 'props', 'parent', fBody);
                        values[target] = f(MY_FUNCS, values, parent)
                        calcTypes[key] = 'f'
                    } break;
                    case 'object': {
                        if (Array.isArray(val)) {

                            const valNTypes = val.map((e, ix) => {
                                if (typeof e === 'object') {
                                    const [r, tp] = calc(e, values, {}, {})
                                    if (r !== undefined && Number.isFinite(r)) {
                                        processed++
                                        return [r, 'f']
                                    }
                                    return [undefined, '?']
                                }
                                if (typeof e === 'string') {
                                    const fBody2 = `const {${Object.keys(MY_FUNCS).join(',')}} = MY_FUNCS; return ${e}`
                                    try {
                                        const f = new Function('MY_FUNCS', 'parent', 'arr', 'ix', fBody2);
                                        const p = {...values, parent}
                                        const r = f(MY_FUNCS, p, values[target], ix)
                                        if (r !== undefined && Number.isFinite(r)) {
                                            processed++
                                            return [r, 'f']
                                        }
                                        return [undefined, '?']
                                    } catch (ex) {
                                        return [undefined, '?']
                                    }
                                }
                                return [e, 'v']
                            })
                            values[target] = valNTypes.map(vt => vt[0])
                            calcTypes[target] = valNTypes.map(vt => vt[1])

                        } else {
                            const p = {...values, parent}
                            const [vals, tp] = calc(val, values, values[target], calcTypes[target])
                            values[target] = vals
                            calcTypes[target] = tp
                        }
                    } break
                    case 'number':
                        values[target] = val
                        calcTypes[target] = 'v'
                        break;
                    default: {
                        values[target] = `!Unknown! ${typeof val} : ${stringify(val)}`
                        calcTypes[target] = '?'
                    }
                }
            } catch (ex) {
                console.log(`Internal error calculation of '${target}'. Caused by:`, ex)
                values[target] = undefined
                calcTypes[target] = '?'                
            }

            let newValue = stringify(values[target])
            if (oldValue !== newValue) {
                processed++
            }
        })
        cycles--
    } while (processed > 0 && cycles > 0)

    return [values, calcTypes]
}

