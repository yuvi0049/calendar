import { takeEvery, select, call, put } from 'redux-saga/effects';

import { EVENTS } from '../constants';
import { fetchEvent } from '../api';
import { setEvent, setError } from "../actions";


function* handleEventLoad() {
    try {
        const events = yield call(fetchEvent);
        yield put(setEvent(events));
    } catch (error) {
        yield put(setError(error.toString()))
    }
}


export default function* watchEventLoad() {
    yield takeEvery(EVENTS.LOAD, handleEventLoad);
}