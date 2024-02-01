import jwtFetch from "./jwt";

const RECEIVE_USER = "echos/RECEIVE_USER";
const RECEIVE_USER_ERRORS = "echos/RECEIVE_USER_ERRORS";

const receiveUser = user => ({
    type: RECEIVE_USER,
    user
});

const receiveErrors = errors => ({
    type: RECEIVE_USER_ERRORS,
    errors
});

export const fetchUser = (userId) => async dispatch => {
    try {
        const res = await jwtFetch(`/api/users/${userId}`);
        const user = await res.json();
        dispatch(receiveUser(user));
    } catch (err) {
        const resBody = await err.json();
        if (resBody.statusCode === 400) {
            dispatch(receiveErrors(resBody.errors));
        }
    }
};

const initialState = {
    user: undefined
};

const usersReducer = (state = initialState, action) => {
    switch (action.type) {
        case RECEIVE_USER:
            return { user: action.user };
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