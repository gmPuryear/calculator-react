import './App.css';
import {useReducer} from "react";
import DigitButton from "./DigitButton";
import OperationButton from "./OperationButton";

// All the actions we can do
export const ACTIONS = {
    ADD_DIGIT: 'add-digit',
    CHOOSE_OPERATION: 'choose-operation',
    CLEAR: 'clear',
    DELETE_DIGIT: 'delete-digit',
    EVALUATE: 'evaluate',
}

function reducer(state, {type, payload}) {
    switch (type) {
        case ACTIONS.ADD_DIGIT:
            if (state.overwrite) {
                return {
                    ...state,
                    currentOperand: payload.digit,
                    overwrite: false,
                }
            }
            // this just returns current state with no changes
            if (payload.digit === "0" && state.currentOperand === "0") return state
            if (payload.digit === "." && state.currentOperand.includes(".")) {
                return state;
            }
            return {
                ...state,
                currentOperand: `${state.currentOperand || ""}${payload.digit}`
            }
        case ACTIONS.CHOOSE_OPERATION:
            if (state.currentOperand === null && state.previousOperand === null) {
                return state;
            }
            if (state.currentOperand == null) {
                return {
                    ...state,
                    operation: payload.operation,
                }
            }

            if (state.previousOperand == null) {
                return {
                    ...state,
                    operation: payload.operation,
                    previousOperand: state.currentOperand,
                    currentOperand: null
                }
            }
            return {
                ...state,
                previousOperand: evaluate(state),
                operation: payload.operation,
                currentOperand: null
            }

        case ACTIONS.CLEAR:
            return {}
        case ACTIONS.DELETE_DIGIT:
            if (state.overwrite) {
                return {
                    ...state,
                    overwrite: false,
                    currentOperand: null
                }
            }
            if (state.currentOperand == null) return state
            if (state.currentOperand.length === 1) {
                return {
                    ...state,
                    currentOperand: null
                }
            }
            return {
                ...state,
                currentOperand: state.currentOperand.slice(0, -1)
            }
        case ACTIONS.EVALUATE:
            if (
                state.operation == null ||
                state.currentOperand == null ||
                state.previousOperand == null
            ) {
                return state;
            }
            return {
                ...state,
                overwrite: true,
                previousOperand: null,
                operation: null,
                currentOperand: evaluate(state),
            }
    }
}

function evaluate({currentOperand, previousOperand, operation}) {
    const prev = parseFloat(previousOperand);
    const current = parseFloat(currentOperand);
    if (isNaN(prev) || isNaN(current)) return ""
    let computation = "";
    switch (operation) {
        case "+":
            computation = prev + current
            break
        case "-":
            computation = prev - current;
            break
        case "*":
            computation = prev * current;
            break
        case "÷":
            computation = prev / current;
            break
    }
    return computation.toString();
}

const INTEGER_FORMATTER = new Intl.NumberFormat("en-us", {
    maximumFractionDigits: 0,
})

function formatOperand(operand) {
    if (operand == null) return
    const [integer, decimal] = operand.split('.')
    if (decimal == null) return INTEGER_FORMATTER.format(integer);
    return `${INTEGER_FORMATTER.format(integer)}.${decimal}`
}


function App() {
    // we want to use a useReducer  in react in order to maintain the multiple states, such as previous operand, current
    // and operation
    const [{currentOperand, previousOperand, operation}, dispatch] = useReducer(reducer, {})

    return (
        <div
            className="w-80 calculator-grid grid bg-blue-400 gap-2 grid-cols-4 grid-rows-7 mt-8  border-2 border-solid border-black p-2">
            <div className="output col-span-4 resize bg-blue-900 flex flex-col place-content-evenly">
                {/*vv these are where our state variables are in HTML (previousOP, current, operation)*/}
                <div className="h-5 flex justify-end previous-operand text-white text-s">{formatOperand(previousOperand)} {operation}</div>
                <div className="h-10 flex justify-end current-operand text-white text-3xl">{formatOperand(currentOperand)}</div>
            </div>
            <button onClick={() => dispatch({type: ACTIONS.CLEAR})} className="calculator_buttons col-span-2">AC
            </button>
            <button onClick={() => dispatch ({ type: ACTIONS.DELETE_DIGIT})} className="calculator_buttons">DEL</button>
            <OperationButton operation='÷' dispatch={dispatch} className="calculator_buttons"/>
            <DigitButton digit='1' dispatch={dispatch}/>
            <DigitButton digit='2' dispatch={dispatch}/>
            <DigitButton digit='3' dispatch={dispatch}/>
            <OperationButton operation='*' dispatch={dispatch}/>
            <DigitButton digit='4' dispatch={dispatch}/>
            <DigitButton digit='5' dispatch={dispatch}/>
            <DigitButton digit='6' dispatch={dispatch}/>
            <OperationButton operation='+' dispatch={dispatch}/>
            <DigitButton digit='7' dispatch={dispatch}/>
            <DigitButton digit='8' dispatch={dispatch}/>
            <DigitButton digit='9' dispatch={dispatch}/>
            <OperationButton operation='-' dispatch={dispatch}/>
            <DigitButton digit='.' dispatch={dispatch}/>
            <DigitButton digit='0' dispatch={dispatch}/>
            <buttton onClick={() => dispatch({type: ACTIONS.EVALUATE})} className="calculator_buttons flex justify-center">=</buttton>
        </div>
    )
}

export default App;
