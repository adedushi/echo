import { createSelector } from 'reselect';
import jwtFetch from './jwt';
import { RECEIVE_USER_LOGOUT } from './session';

const RECEIVE_ECHOS = "echos/RECEIVE_ECHOS";
const RECEIVE_USER_ECHOS = "echos/RECEIVE_USER_ECHOS";
const RECEIVE_NEW_ECHO = "echos/RECEIVE_NEW_ECHO";
const RECEIVE_ECHO_ERRORS = "echos/RECEIVE_ECHO_ERRORS";
const CLEAR_ECHO_ERRORS = "echos/CLEAR_ECHO_ERRORS";
const REMOVE_ECHO = "echos/REMOVE_ECHO";
const UPDATE_ECHO = "echos/UPDATE_ECHO"
const UPDATE_LIKE_REVERB = "echos/UPDATE_LIKE_REVERB"

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

const removeEcho = echoId => ({
    type: REMOVE_ECHO,
    echoId
});

const updateEcho = updatedEcho => ({
    type: UPDATE_ECHO,
    updatedEcho
})

const receiveErrors = errors => ({
    type: RECEIVE_ECHO_ERRORS,
    errors
});

export const clearEchoErrors = errors => ({
    type: CLEAR_ECHO_ERRORS,
    errors
});

const updateLikeReverbEcho = updatedEcho => ({
    type: UPDATE_LIKE_REVERB,
    updatedEcho
})

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



export const fetchUserEchos = (id, feed) => async dispatch => {
    try {
        const res = await jwtFetch(`/api/users/${id}`);
        const echos = await res.json();
        dispatch(receiveUserEchos(echos[feed]));
    } catch (err) {
        const resBody = await err.json();
        if (resBody.statusCode === 400) {
            return dispatch(receiveErrors(resBody.errors));
        }
    }
};


export const composeEcho = (title, audio) => async dispatch => {
    const formData = new FormData();
    formData.append("title", title);
    formData.append("audio", audio)
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

export const destroyEcho = (echoId) => async dispatch => {
    try {
        // eslint-disable-next-line no-unused-vars
        const res = await jwtFetch(`/api/echos/${echoId}`, {
            method: 'DELETE',
        });
        // const echo = await res.json();
        dispatch(removeEcho(echoId)) 
    } catch (err) {
        const resBody = await err.json();
        if (resBody.statusCode === 400) {
            return dispatch(receiveErrors(resBody.errors));
        }
    }
};

export const updateEchoTitle = (echoId, newTitle) => async dispatch => {
    try {
        const res = await jwtFetch(`/api/echos/updateTitle/${echoId}`, {
            method: 'PUT',
            body: JSON.stringify({newTitle: newTitle})
        });
        const updatedEcho = await res.json();
        dispatch(updateEcho(updatedEcho));
    } catch (err) {
        const resBody = await err.json();
        if (resBody.statusCode === 400) {
            return dispatch(receiveErrors(resBody.errors));
        }
    }
};

export const addEchoLike = echoId => async dispatch => {
    try {
        const res = await jwtFetch(`/api/echos/addLike/${echoId}`, {
            method: 'PUT'
        })
        const updatedEcho = await res.json()
        dispatch(updateEcho(updatedEcho))
    } catch (err) {
        const resBody = await err.json()
        if (resBody.statusCode === 400) {
            return dispatch(receiveErrors(resBody.errors))
        }
    }
}

export const removeEchoLike = (echoId, page=null) => async dispatch => {
    try {
        const res = await jwtFetch(`/api/echos/removeLike/${echoId}`, {
            method: 'PUT'
        })
        const updatedEcho = await res.json()
        if (page === 'likes') {
            dispatch(updateLikeReverbEcho(updatedEcho))
        } else {
            dispatch(updateEcho(updatedEcho))
        }
    } catch (err) {
        const resBody = await err.json()
        if (resBody.statusCode === 400) {
            return dispatch(receiveErrors(resBody.errors))
        }
    }
}

export const addEchoReply = ( echoId, replyText, replyAudio ) => async dispatch => {
    let body = null
    if (replyAudio) {
        const formData = new FormData();
        formData.append("replyAudio", replyAudio)
        body = formData
    } else {
        body = JSON.stringify({text: replyText})
    }
    try {
        const res = await jwtFetch(`/api/echos/addReply/${echoId}`, {
            method: 'PUT',
            body: body
        })
        const updatedEcho = await res.json()
        dispatch(updateEcho(updatedEcho))
    } catch (err) {
        const resBody = await err.json()
        if (resBody.statusCode === 400) {
            return dispatch(receiveErrors(resBody.errors))
        }
    }
}

export const removeEchoReply = (echoId, replyId) => async dispatch => {
    try {
        const res = await jwtFetch(`/api/echos/removeReply/${echoId}`, {
            method: 'PUT',
            body: JSON.stringify({replyId: replyId})
        })
        const updatedEcho = await res.json()
        dispatch(updateEcho(updatedEcho))
    } catch (err) {
        const resBody = await err.json()
        if (resBody.statusCode === 400) {
            return dispatch(receiveErrors(resBody.errors))
        }
    }
}

export const addReplyLike = (echoId, replyId) => async dispatch => {
    try {
        const res = await jwtFetch(`/api/echos/likeReply/${echoId}/${replyId}`, {
            method: 'PUT'
        })
        const updatedEcho = await res.json()
        dispatch(updateEcho(updatedEcho))
    } catch (err) {
        const resBody = await err.json()
        if (resBody.statusCode === 400) {
            return dispatch(receiveErrors(resBody.errors))
        }
    }
}

export const removeReplyLike = (echoId, replyId) => async dispatch => {
    try {
        const res = await jwtFetch(`/api/echos/unlikeReply/${echoId}/${replyId}`, {
            method: 'PUT'
        })
        const updatedEcho = await res.json()
        dispatch(updateEcho(updatedEcho))
    } catch (err) {
        const resBody = await err.json()
        if (resBody.statusCode === 400) {
            return dispatch(receiveErrors(resBody.errors))
        }
    }
}

export const addReverb = echoId => async dispatch => {
    try {
        const res = await jwtFetch(`/api/echos/addReverb/${echoId}`, {
            method: 'PUT'
        })
        const updatedEcho = await res.json()
        dispatch(updateEcho(updatedEcho))
    } catch (err) {
        const resBody = await err.json()
        if (resBody.statusCode === 400) {
            return dispatch(receiveErrors(resBody.errors))
        }
    }
}

export const removeReverb = (echoId, page=null) => async dispatch => {
    try {
        const res = await jwtFetch(`/api/echos/removeReverb/${echoId}`, {
            method: 'PUT'
        })
        const updatedEcho = await res.json()
        if (page === 'reverbs') {
            dispatch(updateLikeReverbEcho(updatedEcho))
        } else {
            dispatch(updateEcho(updatedEcho))
        }
    } catch (err) {
        const resBody = await err.json()
        if (resBody.statusCode === 400) {
            return dispatch(receiveErrors(resBody.errors))
        }
    }
}



export const selectAllEchosArray = createSelector(state => state.echos.all,
    (echos) => Object.values(echos)
);
export const selectUserEchosArray = createSelector(state => state.echos.user,
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

const echosReducer = (state = { all: {}, user: {}}, action) => {
    // eslint-disable-next-line no-unused-vars
    const newState = { ...state }
    switch (action.type) { 
        case RECEIVE_ECHOS:
            return { ...state, all: action.echos };
        case RECEIVE_USER_ECHOS:
            return { ...state, user: action.echos };
        case RECEIVE_NEW_ECHO:{
            const updatedAll = [action.echo, ...state.all];
            return { ...state, all: updatedAll};
        }
        case RECEIVE_USER_LOGOUT:
            return { ...state, user: {}}
        case REMOVE_ECHO:{
            const updatedEchosAll = Array.isArray(state.all)
                ? state.all.filter(echo => echo._id !== action.echoId)
                : state.all;
            const updatedEchosUser = Array.isArray(state.user)
                ? state.user.filter(echo => echo._id !== action.echoId)
                : state.user;
            return {
                ...state,
                all: updatedEchosAll,
                user: updatedEchosUser
            }
        }
        case UPDATE_ECHO:{
            const updatedEchosAll = Array.isArray(state.all)
                ? state.all.map(echo => echo._id === action.updatedEcho._id ? action.updatedEcho : echo)
                : state.all;

            const updatedEchosUser = Array.isArray(state.user)
                ? state.user.map(echo => echo._id === action.updatedEcho._id ? action.updatedEcho : echo)
                : state.user;
            return {
                ...state,
                all: updatedEchosAll,
                user: updatedEchosUser
            }
        }
        case UPDATE_LIKE_REVERB: {
            const updatedEchosAll = Array.isArray(state.all)
                ? state.all.map(echo => echo._id === action.updatedEcho._id ? action.updatedEcho : echo)
                : state.all;

            const updatedEchosUser = Array.isArray(state.user)
                ? state.user.filter(echo => echo._id !== action.updatedEcho._id)
                : state.user;
            return {
                ...state,
                all: updatedEchosAll,
                user: updatedEchosUser
            }
        }
        default:
            return state;
    }
};

export default echosReducer;