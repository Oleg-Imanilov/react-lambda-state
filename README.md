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


# Usage example

model.js
```js
const model = {
    x: 3,
    $arr: 'range(0, x)', // arr is Array
    $ff: `foreach(arr, (month, ix) => { 
        return (arr.length - ix + 1) * z + 1 / Math.pow(3, 5) 
    })`, // ff is array
    $f0: 'ff[0]',
    $nested: {
        a: 10,
        $b: 'parent.x + a',
        $c: { 
            $n: 'parent.a + parent.parent.x' 
        }
    },
    $z: 'y + 10 - x',
    $y: 'x * x',
    $t: [13, 14, 'parent.x + 99', 'parent.ff[parent.x-1] + 2'],
}
```

reducer.js
```js
function reducer(state, action) {
    const { type, payload } = action;
    switch (type) {
        case "INC": {
            const newX  = state.x + 1
            return { ...state, x: newX };
        }
        default:
            return state;
    }
}
```

app-store.js
```js
import { createContext, useContext, useReducer } from "react";
import { calc } from "react-lambda-state";

const Store = createContext();

export const useAppStore = () => {
    const [state, dispatch, model] = useContext(Store);
    return [state, dispatch, model];
};

export const AppProvider = ({ children, reducer, initState }) => {
    const [model, dispatch] = useReducer(reducer, initState);
    const [state, stateTypes] = calc(model)
    return (
        <Store.Provider value={[state, dispatch, model]}>{children}</Store.Provider>
    );
};
```

TestComponent.jsx
```js
import { useAppStore } from "./app-store";

const TestComponent = () => {
    const [state, dispatch, model] = useAppStore();
    return <div>
        <button onClick={() => { dispatch({ type: 'INC' }) }}><b>Inc x</b></button>|
        <hr />
        x: {state.x}<br/>
        y: {state.y}<br/>
        ff: {JSON.stringify(state.ff)}<br/>
        nested.c.n: {state.nested.c.n}
    </div>
};

```

App.jsx
```js
import { AppProvider } from "./app-store";
import model from './model'
import reducer from './reducer'

function App() {
    return (
        <AppProvider reducer={reducer} initState={model}>
            <TestComponent />
        </AppProvider>
    );
}

export default App;
```
