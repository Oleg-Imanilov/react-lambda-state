import React from "react";
import { createContext } from "react";
import { contextProvider } from "../../index";

const Store = createContext();

const model = {
    x: 3,
    $y: ({ z, arr }) => z + arr.length, // We can use lambda functions, which gets state as a parameter
    $z: "x + 1", // Formula can be string, all siblings can be accessed by name, spatial parameter 'parent' may be undefined for top level
    $arr: ({ z }) => {
        const ret = [];
        for (let i = 0; i < z; i++) {
            ret.push(i);
        }
        return ret;
    },
    $test: {
        $px1: "parent.x+1",
        $px2: "parent.x+2",
        $px3: 111,
        $px4: "parent.y+2",
    }, // For object - current scope is object itself, so siblings should be prefexed with 'parent.'
    $test2: ["parent.x+1", "parent.x+2", 111, "parent.y+2"], // Same as object, siblings hould be prefixed with 'parent.'
};

function reducer(state, action) {
    const { type, payload } = action;
    switch (type) {
        case "INC": {
            const newX = state.x + 1;
            return { ...state, x: newX };
        }
        default:
            return state;
    }
}

const { useLambdaStore, LambdaStoreProvider } = contextProvider(React)(
    Store,
    reducer,
    model
);

export { useLambdaStore, LambdaStoreProvider };
