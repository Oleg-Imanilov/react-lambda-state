import { stringify } from "./utils"
import { DEL_PROP, SET_PROP, CLR_PROP, PUSH_PROP } from './action-types'
import contextProvider from './context-provider'

const values = (proxy) => {
    console.log(proxy)
    return Object.keys(proxy).reduce((a, key) => {
        a[key] = proxy[key];
        return a;
    }, {});
};

export {
    DEL_PROP,
    SET_PROP,
    CLR_PROP,
    PUSH_PROP,
    contextProvider,
    stringify,
    values
}