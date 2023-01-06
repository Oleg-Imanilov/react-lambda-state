import { useLambdaStore } from "./app-store";
import { SET_PROP, CLR_PROP, stringify } from "../../index";
import { useState } from "react";

export default () => {
    const [state, dispatch, model, stateTypes] = useLambdaStore();
    const [xx, setXx] = useState(10);

    return (
        <div>
            <button onClick={() => { dispatch({ type: "INC" }); }}><b>Inc x</b></button>
            &nbsp;
            <button onClick={() => { dispatch({ type: SET_PROP, payload: { name: "x", value: state.x + 1 }}); }}><b>Inc x (SET_PROP)</b></button>
            &nbsp;
            <input value={xx} onChange={(e) => { setXx(parseInt(e.target.value)); }} type="number" />
            &nbsp;
            <button onClick={() => { dispatch({ type: SET_PROP, payload: { name: "y", value: xx }}); }}><b>Override y</b></button>
            &nbsp;
            <button onClick={() => { dispatch({ type: CLR_PROP, payload: { name: "y" } }); }}><b>Clear y</b></button>
            &nbsp;
            <hr />
            x: {state.x} | Type: {stateTypes.x}
            <br />
            {stateTypes.y == "f" ? (
                <>y: {state.y}</>
            ) : (<span style={{ color: "red" }}>y: {state.y}</span>)} | Type:{stateTypes.y}
            <br />
            arr: {stringify(state.arr)} | Types:{stringify(stateTypes.arr)}
            <br />
            test: {stringify(state.test)} | Types:{stringify(stateTypes.test)}
            <br />
            test2: {stringify(state.test2)} | Types:{stringify(stateTypes.test2)}
            <hr />
            <table style={{width:'100%'}}>
                <tbody>
                    <tr>
                        <td valign="top">
                            <pre><b>Model:</b><br />
                            {JSON.stringify(model, null, 2)}
                            </pre>
                        </td>
                        <td valign="top">
                            <pre><b>State:</b><br />
                                {JSON.stringify(state, null, 2)}
                            </pre>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    );
};
