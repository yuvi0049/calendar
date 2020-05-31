import { combineReducers } from 'redux';

import EventReducer from './eventReducer';
import loadingReducer from './loadingReducer';
import errorReducer from './errorReducer';

const rootReducer = combineReducers({
    isLoading: loadingReducer,
    events: EventReducer,
    error: errorReducer
});

export default rootReducer;