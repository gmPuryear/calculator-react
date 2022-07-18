import {ACTIONS} from './App'

// dispatch so we can call reducer from here
const DigitButton = ({dispatch, digit}) => {

    return (
        <button className="calculator_buttons"
            onClick={() => dispatch({type: ACTIONS.ADD_DIGIT, payload: {digit}})}>
            {digit}
        </button>
    )
}

export default DigitButton