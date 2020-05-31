import { EVENTS } from  '../constants';

const errorReducer = (state = [], action) => {
    switch (action.type) {
        case EVENTS.LOAD_FAIL:
            return action.error;
        case EVENTS.LOAD_SUCCESS:
        case EVENTS.LOAD:
            return null;
        
        default:
            return state;
    }
};

export default errorReducer;
