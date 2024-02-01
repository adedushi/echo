import jwtFetch from "./jwt";

const RECEIVE_PROFILE_USER = "echos/RECEIVE_PROFILE_USER";
const RECEIVE_CURRENT_USER = "echos/RECEIVE_CURRENT_USER";
const RECEIVE_USER_ERRORS = "echos/RECEIVE_USER_ERRORS";

const receiveProfileUser = user => ({
    type: RECEIVE_PROFILE_USER,
    user
});

const receiveCurrentUser = user => ({
    type: RECEIVE_CURRENT_USER,
    user
});

const receiveErrors = errors => ({
    type: RECEIVE_USER_ERRORS,
    errors
});

export const fetchProfileUser = (userId) => async dispatch => {
    try {
        const res = await jwtFetch(`/api/users/${userId}`);
        const user = await res.json();
        dispatch(receiveProfileUser(user));
    } catch (err) {
        const resBody = await err.json();
        if (resBody.statusCode === 400) {
            dispatch(receiveErrors(resBody.errors));
        }
    }
};

export const fetchCurrentUser = (userId) => async dispatch => {
    try {
        const res = await jwtFetch(`/api/users/${userId}`);
        const user = await res.json();
        dispatch(receiveCurrentUser(user));
    } catch (err) {
        const resBody = await err.json();
        if (resBody.statusCode === 400) {
            dispatch(receiveErrors(resBody.errors));
        }
    }
};

const initialState = {
    profileUser: undefined,
    currentUser: undefined
};

const usersReducer = (state = initialState, action) => {
    const newState = { ...state }
    switch (action.type) {
        case RECEIVE_PROFILE_USER:
            return { ...newState, profileUser: action.user };
        case RECEIVE_CURRENT_USER:
            return { ...newState, currentUser: action.user };
        default:
            return state;
    }
};

const nullErrors = null;

export const userErrorsReducer = (state = nullErrors, action) => {
    switch (action.type) {
        case RECEIVE_USER_ERRORS:
            return action.errors;
        default:
            return state;
    }
};

export default usersReducer