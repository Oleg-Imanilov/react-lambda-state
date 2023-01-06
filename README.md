# What is all about

This package giving ability to manage state with calculated fields in React app. 

The state defined by model which may contain constants as well as arrow functions & formulas (string that actually executed)

# Actions 

## Action types
* `DEL_PROP`
* `SET_PROP`
* `CLR_PROP`
* `PUSH_PROP`

## Action functions (can be called directly)
* `delProp (rootState, payload : { name: string, prop: string|number })`
* `setProp (rootState, payload : { name: string, value: any })`
* `pushProp(rootState, payload : { name: string })`
* `clrProp (rootState, payload : { name: string, value: any })`

> name parameter is a path to the property separated by '.' including arrays
>
> Example: 
```js
state = { a: [10, 20, { c : 666 } ] }
setProp(state, {name:'a.2.c', value: 333})
// state === { a: [10, 20, { c : 333 } ] }
```

# Supported internal functions

* range
* foreach
* PVIF
* FVIFA
* PMT
* IPMT
* PPMT
* DaysBetween
* XNPV
* XIRR

