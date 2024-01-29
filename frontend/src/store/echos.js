import { createSelector } from 'reselect';
import jwtFetch from './jwt';
import { RECEIVE_USER_LOGOUT } from './session';

const RECEIVE_ECHOS = "echos/RECEIVE_ECHOS";
const RECEIVE_USER_ECHOS = "echos/RECEIVE_USER_ECHOS";
const RECEIVE_NEW_ECHO = "echos/RECEIVE_NEW_ECHO";
const RECEIVE_ECHO_ERRORS = "echos/RECEIVE_ECHO_ERRORS";
const CLEAR_ECHO_ERRORS = "echos/CLEAR_ECHO_ERRORS";

const receiveEchos = echos => ({
    type: RECEIVE_ECHOS,
    echos
});

const receiveUserEchos = echos => ({
    type: RECEIVE_USER_ECHOS,
    echos
});

const receiveNewEcho = echo => ({
    type: RECEIVE_NEW_ECHO,
    echo
});

const receiveErrors = errors => ({
    type: RECEIVE_ECHO_ERRORS,
    errors
});

export const clearEchoErrors = errors => ({
    type: CLEAR_ECHO_ERRORS,
    errors
});

export const fetchEchos = () => async dispatch => {
    try {
        const res = await jwtFetch('/api/echos');
        const echos = await res.json();
        dispatch(receiveEchos(echos));
    } catch (err) {
        const resBody = await err.json();
        if (resBody.statusCode === 400) {
            dispatch(receiveErrors(resBody.errors));
        }
    }
};

export const fetchUserEchos = id => async dispatch => {
    try {
        const res = await jwtFetch(`/api/echos/user/${id}`);
        const echos = await res.json();
        dispatch(receiveUserEchos(echos));
    } catch (err) {
        const resBody = await err.json();
        if (resBody.statusCode === 400) {
            return dispatch(receiveErrors(resBody.errors));
        }
    }
};

export const composeEcho = (text, images) => async dispatch => {
    const formData = new FormData();
    formData.append("text", text);
    Array.from(images).forEach(image => formData.append("images", image));    
    try {
        const res = await jwtFetch('/api/echos/', {
            method: 'POST',
            body: formData
        });
        const echo = await res.json();
        dispatch(receiveNewEcho(echo));
    } catch (err) {
        const resBody = await err.json();
        if (resBody.statusCode === 400) {
            return dispatch(receiveErrors(resBody.errors));
        }
    }
};

const selectEchos = state => state.echos.all;
const selectUserEchos = state => state.echos.user;
export const selectAllEchosArray = createSelector(selectEchos,
    (echos) => Object.values(echos)
);
export const selectUserEchosArray = createSelector(selectUserEchos,
    (echos) => Object.values(echos)
);

const nullErrors = null;

export const echoErrorsReducer = (state = nullErrors, action) => {
    switch (action.type) {
        case RECEIVE_ECHO_ERRORS:
            return action.errors;
        case RECEIVE_NEW_ECHO:
        case CLEAR_ECHO_ERRORS:
            return nullErrors;
        default:
            return state;
    }
};

const echosReducer = (state = { all: {}, user: {}, new: undefined }, action) => {
    switch (action.type) {
        case RECEIVE_ECHOS:
            return { ...state, all: action.echos, new: undefined };
        case RECEIVE_USER_ECHOS:
            return { ...state, user: action.echos, new: undefined };
        case RECEIVE_NEW_ECHO:
            return { ...state, new: action.echo };
        case RECEIVE_USER_LOGOUT:
            return { ...state, user: {}, new: undefined }
        default:
            return state;
    }
};

export default echosReducer;