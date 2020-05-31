import { EVENTS } from '../constants';

const eventReducer = (state = [], action) => {
    if (action.type === EVENTS.LOAD_SUCCESS) {
        return [...state, ...action.EVENTS];
    }

    return state;
};

export default eventReducer;