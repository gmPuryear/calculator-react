import {ACTIONS} from './App'

// dispatch so we can call reducer from here
const OperationButton = ({dispatch, operation}) => {

    return (
        <button className="calculator_buttons"
                onClick={() => dispatch({type: ACTIONS.CHOOSE_OPERATION, payload: {operation}})}>
            {operation}
        </button>
    )
}

export default OperationButton