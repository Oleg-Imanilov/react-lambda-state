import { useContext, useReducer } from 'react'
import lambdaStateReducer, { propReducer } from './lambdaStateReducer'
import { calc } from './calc'

export default function contextProvider(Store, reducer = st => st, initState = null) {
    const useLambdaStore = () => {
        const [state, dispatch, model, stateTypes] = useContext(Store);
        return [state, dispatch, model, stateTypes];
    };
    
    const LambdaStoreProvider = ({ children = [] }) => {
        const [model, dispatch] = useReducer(lambdaStateReducer(reducer), initState);
        const [state, stateTypes] = calc(model)
        const context = [state, dispatch, model, stateTypes]
        return (
            <Store.Provider value={context}>{children}</Store.Provider>
        );
    };
    return {useLambdaStore, LambdaStoreProvider}
}

