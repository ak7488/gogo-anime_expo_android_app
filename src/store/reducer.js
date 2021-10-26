import { CHANGE } from "./action";

const initState = {
    colorOne: '#226ce0',
    colorTwo: '#f3f3f3',
    colorThree: '#000000',
    colorFour: '#ff6663',
}

const Reducer = (state = initState, action) => {
    switch (action.type) {
        case CHANGE:
            return {
                ...state,
                ...action.object
            }
        default: return state
    }
};

export default Reducer;