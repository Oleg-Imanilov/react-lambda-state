import { DEL_PROP, SET_PROP, CLR_PROP, PUSH_PROP } from './action-types'
import {  delProp, setProp, pushProp, clrProp } from './actions' 

export function propReducer (state, action) {
    const { type, payload } = action;
    switch (type) {
        case DEL_PROP: return delProp(state, payload)   // payload : { name: string, prop: string|number }
        case SET_PROP: return setProp(state, payload)   // payload : { name: string, value: any }
        case CLR_PROP: return clrProp(state, payload)   // payload : { name: string } // a.b.c
        case PUSH_PROP: return pushProp(state, payload) // payload : { name: string, value: any } 
        default:
            return state;
    }
}

export default (reducer = state => state) => (state, action) =>  reducer(propReducer(state, action), action) 
