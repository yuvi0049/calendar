import { EVENTS } from '../constants';

const loadEvent = () => ({
    type: EVENTS.LOAD
});

const setEvent = images => ({
    type: EVENTS.LOAD_SUCCESS,
    images
});

const setError = error => ({
    type: EVENTS.LOAD_FAIL,
    error
});

export { loadEvent, setEvent, setError };