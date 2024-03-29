import jwtFetch from './jwt';

const RECEIVE_CURRENT_USER = "session/RECEIVE_CURRENT_USER";
const RECEIVE_SESSION_ERRORS = "session/RECEIVE_SESSION_ERRORS";
const CLEAR_SESSION_ERRORS = "session/CLEAR_SESSION_ERRORS";
export const RECEIVE_USER_LOGOUT = "session/RECEIVE_USER_LOGOUT";

const receiveCurrentUser = currentUser => ({
    type: RECEIVE_CURRENT_USER,
    currentUser
});

const receiveErrors = errors => ({
    type: RECEIVE_SESSION_ERRORS,
    errors
});

const logoutUser = () => ({
    type: RECEIVE_USER_LOGOUT
});

export const clearSessionErrors = () => ({
    type: CLEAR_SESSION_ERRORS
});

export const signup = user => startSession(user, 'api/users/register');
export const login = user => startSession(user, 'api/users/login');

const startSession = (userInfo, route) => async dispatch => {
    const { image, username, password, email } = userInfo;
    const formData = new FormData();
    formData.append("username", username);
    formData.append("password", password);
    formData.append("email", email);

    if (image) formData.append("image", image);

    try {
        const res = await jwtFetch(route, {
            method: "POST",
            body: formData
        });
        const { user, token } = await res.json();
        localStorage.setItem('jwtToken', token);
        // const mongoUser = await jwtFetch(`/api/users/${user._id}`)
        // console.log(mongoUser)
        return dispatch(receiveCurrentUser(user));
    } catch (err) {
        const res = await err.json();
        return dispatch(receiveErrors(res.errors));

    }
};

export const getCurrentUser = () => async dispatch => {
    const res = await jwtFetch('/api/users/current');
    const user = await res.json();
    // const user = await jwtFetch(`/api/users/${data._id}`)
    return dispatch(receiveCurrentUser(user));
};

export const logout = () => dispatch => {
    localStorage.removeItem('jwtToken');
    dispatch(logoutUser());
};

const initialState = {
    user: undefined
};

const sessionReducer = (state = initialState, action) => {
    switch (action.type) {
        case RECEIVE_CURRENT_USER:
            return { user: action.currentUser };
        case RECEIVE_USER_LOGOUT:
            return initialState;
        default:
            return state;
    }
};

const nullErrors = null;

export const sessionErrorsReducer = (state = nullErrors, action) => {
    switch (action.type) {
        case RECEIVE_SESSION_ERRORS:
            return action.errors;
        case RECEIVE_CURRENT_USER:
        case CLEAR_SESSION_ERRORS:
            return nullErrors;
        default:
            return state;
    }
};

export default sessionReducer;