import { EVENTS } from '../constants';

const loadingReducer = (state = [], action) => {
    switch (action.type) {
        case EVENTS.LOAD:
            return true;
        case EVENTS.LOAD_SUCCESS:
            return false;
        case EVENTS.LOAD_FAIL:
            return false;
        
        default:
            return state;
    }
}

export default loadingReducer;